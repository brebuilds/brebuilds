#!/usr/bin/env node
// Arcade-style "hi-score" card for the GitHub profile README.
//
//   node scripts/scoreboard.mjs           fetch fresh stats (needs STATS_TOKEN), then render
//   node scripts/scoreboard.mjs --render  re-render assets/scoreboard.svg from assets/stats.json
//
// STATS_TOKEN must be able to see private repos (fine-grained PAT: all repos,
// read-only Metadata + Pull requests + Contents). Without it, the search API only
// sees public repos and the numbers would drop, so the script refuses to fetch.
// If any query fails, the whole previous card (numbers and date) is kept.

import { readFile, writeFile } from "node:fs/promises";

const USER = "brebuilds";
const STATS_PATH = new URL("../assets/stats.json", import.meta.url);
const SVG_PATH = new URL("../assets/scoreboard.svg", import.meta.url);

const daysAgo = (n) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);

async function searchCount(kind, q, token) {
  const res = await fetch(`https://api.github.com/search/${kind}?per_page=1&q=${encodeURIComponent(q)}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "User-Agent": "brebuilds-scoreboard" },
  });
  if (!res.ok) throw new Error(`${kind} "${q}": HTTP ${res.status}`);
  return (await res.json()).total_count;
}

async function fetchStats(previous) {
  const token = process.env.STATS_TOKEN;
  if (!token) throw new Error("STATS_TOKEN is not set; refusing to fetch public-only numbers.");
  const since = daysAgo(30);
  const queries = {
    repos: ["repositories", `user:${USER}`],
    mergedPrs: ["issues", `author:${USER} is:pr is:merged`],
    prs30: ["issues", `author:${USER} is:pr created:>=${since}`],
    commits30: ["commits", `author:${USER} committer-date:>=${since}`],
  };
  // All-or-nothing: the card shows one "as of" date, so a partial refresh would
  // label stale numbers as current. Any failed query keeps the whole previous card.
  const next = {};
  for (const [key, [kind, q]] of Object.entries(queries)) {
    try {
      next[key] = await searchCount(kind, q, token);
    } catch (err) {
      console.warn(`${key} failed (${err.message}); keeping the previous card as of ${previous.asOf}.`);
      return previous;
    }
  }
  next.asOf = new Date().toISOString().slice(0, 10);
  return next;
}

// Level curve: level n needs n^2 merged PRs. 557 merged -> level 23.
const levelFor = (xp) => {
  const level = Math.floor(Math.sqrt(xp));
  const floor = level ** 2;
  const ceil = (level + 1) ** 2;
  return { level, progress: (xp - floor) / (ceil - floor), toNext: ceil - xp };
};

const fmt = (n) => Number(n).toLocaleString("en-US");
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

function render(s) {
  const { level, progress, toNext } = levelFor(s.mergedPrs);
  const W = 840, H = 300;
  const tiles = [
    ["REPOS BUILT", s.repos],
    ["PRs MERGED", s.mergedPrs],
    ["PRs · 30 DAYS", s.prs30],
    ["COMMITS · 30 DAYS", s.commits30],
  ];
  const tileW = 182, gap = 16, x0 = 32, y0 = 108;
  const tileSvg = tiles
    .map(([label, value], i) => {
      const x = x0 + i * (tileW + gap);
      return `
    <g transform="translate(${x} ${y0})">
      <rect width="${tileW}" height="92" rx="10" fill="#0f1b33" stroke="#1e3a8a"/>
      <text x="16" y="26" class="label">${esc(label)}</text>
      <text x="16" y="72" class="num">${esc(fmt(value))}</text>
    </g>`;
    })
    .join("");
  const barX = 32, barY = 236, barW = W - 64, filled = Math.max(6, Math.round(barW * progress));

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t d">
  <title id="t">Bre's builder scoreboard</title>
  <desc id="d">Level ${level}. ${fmt(s.repos)} repos, ${fmt(s.mergedPrs)} merged pull requests, ${fmt(s.prs30)} pull requests and ${fmt(s.commits30)} commits in the last 30 days, as of ${s.asOf}.</desc>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0a1428"/><stop offset="1" stop-color="#050b18"/>
    </linearGradient>
    <linearGradient id="xp" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#1d4ed8"/><stop offset="1" stop-color="#60a5fa"/>
    </linearGradient>
    <pattern id="scan" width="4" height="4" patternUnits="userSpaceOnUse">
      <rect width="4" height="1" fill="#ffffff" opacity="0.025"/>
    </pattern>
    <filter id="glow" x="-20%" y="-50%" width="140%" height="200%">
      <feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <style>
    text { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace; }
    .label { fill: #7ea6e0; font-size: 11px; letter-spacing: 1.5px; }
    .num { fill: #dbeafe; font-size: 38px; font-weight: 700; filter: url(#glow); }
    .title { fill: #93c5fd; font-size: 15px; letter-spacing: 4px; font-weight: 700; }
    .big { fill: #eff6ff; font-size: 30px; font-weight: 800; letter-spacing: 2px; filter: url(#glow); }
    .dim { fill: #5b7bb5; font-size: 11px; letter-spacing: 1.5px; }
    .blink { fill: #60a5fa; font-size: 12px; letter-spacing: 3px; font-weight: 700; }
  </style>
  <rect width="${W}" height="${H}" rx="18" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" rx="18" fill="url(#scan)"/>
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="17" fill="none" stroke="#1e40af" stroke-width="2"/>

  <text x="32" y="44" class="title">PLAYER 1 · BRE</text>
  <text x="32" y="84" class="big">LVL ${level} BUILDER</text>
  <text x="${W - 32}" y="44" class="blink" text-anchor="end">▶ PRESS START<animate attributeName="opacity" values="1;1;0;0" keyTimes="0;0.55;0.6;1" dur="1.2s" repeatCount="indefinite"/></text>
  <text x="${W - 32}" y="84" class="dim" text-anchor="end">HI-SCORES AS OF ${esc(s.asOf)}</text>
${tileSvg}
  <text x="${barX}" y="${barY - 10}" class="dim">XP · MERGED PRs</text>
  <text x="${barX + barW}" y="${barY - 10}" class="dim" text-anchor="end">${esc(fmt(toNext))} TO LVL ${level + 1}</text>
  <rect x="${barX}" y="${barY}" width="${barW}" height="14" rx="7" fill="#0f1b33" stroke="#1e3a8a"/>
  <rect x="${barX}" y="${barY}" width="${filled}" height="14" rx="7" fill="url(#xp)" filter="url(#glow)"/>
  <text x="${W / 2}" y="${H - 18}" class="dim" text-anchor="middle">PRIVATE CLIENT WORK COUNTED · NEVER SHOWN · UPDATES NIGHTLY</text>
</svg>
`;
}

const stats = JSON.parse(await readFile(STATS_PATH, "utf8"));
const next = process.argv.includes("--render") ? stats : await fetchStats(stats);
await writeFile(STATS_PATH, JSON.stringify(next, null, 2) + "\n");
await writeFile(SVG_PATH, render(next));
console.log("scoreboard:", next);
