import React, { useEffect, useMemo, useRef, useState } from "react";
import { NOTES, EASTER_EGGS, PALETTE } from "../stickyNotesMessages";

/**
 * Backdrop of animated, draggable sticky notes.
 * - 85–90% beige/tan; a few pastel accents
 * - Idle quiver (wind); occasional peel/fall
 * - Drag to pull a note off the wall (it falls)
 * - Rare easter eggs
 *
 * Usage: place <StickyNotesBackdrop /> early in your App tree (position: fixed, behind content).
 */

type NoteModel = {
  id: number;
  text: string;
  color: string;
  x: number;
  y: number;
  r: number; // rotation
  falling: boolean;
  z: number;
  secret?: boolean; // for easter eggs
  floatOffset: number; // for gentle floating animation
  textRotation: number; // stable text rotation
  fontSize: string; // stable font size
};

const NOTE_COUNT = 60;            // reduced for better performance
const FALL_INTERVAL_MS = 12000;   // random note peels off every N ms
const WIND_GUST_MS = 20000;       // gentler wind gusts
const WIND_GUST_DURATION = 2000;  // gust effect length

export default function StickyNotesBackdrop() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [wind, setWind] = useState(false);
  const [notes, setNotes] = useState<NoteModel[]>([]);

  // Initialize notes after component mounts when window is available
  useEffect(() => {
    const newNotes = seedNotes();
    console.log('Creating notes:', newNotes.length, newNotes);
    setNotes(newNotes);
  }, []);


  // Randomly trigger a note to fall every few seconds  
  useEffect(() => {
    const t = setInterval(() => {
      setNotes((prev) => {
        const candidates = prev.filter((n) => !n.falling);
        if (candidates.length < 5) return prev; // keep at least 5 notes up
        const pick = candidates[Math.floor(Math.random() * candidates.length)].id;
        return prev.map((n) => (n.id === pick ? { ...n, falling: true } : n));
      });
    }, FALL_INTERVAL_MS);
    return () => clearInterval(t);
  }, []);

  // Gentle wind gust toggler
  useEffect(() => {
    const t = setInterval(() => {
      setWind(true);
      setTimeout(() => setWind(false), WIND_GUST_DURATION);
    }, WIND_GUST_MS);
    return () => clearInterval(t);
  }, []);



  // Handle drag (pointer events) for each note
  const onPointerDown = (id: number, e: React.PointerEvent) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLDivElement;
    target.setPointerCapture(e.pointerId);

    const startX = e.clientX;
    const startY = e.clientY;
    let currentX = startX;
    let currentY = startY;

    // Bring note to front
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, z: Date.now() } : n
      )
    );

    const move = (ev: PointerEvent) => {
      const deltaX = ev.clientX - currentX;
      const deltaY = ev.clientY - currentY;
      
      setNotes((prev) =>
        prev.map((n) =>
          n.id === id
            ? {
                ...n,
                x: Math.max(0, Math.min(window.innerWidth - 120, n.x + deltaX)),
                y: Math.max(0, Math.min(window.innerHeight - 120, n.y + deltaY)),
              }
            : n
        )
      );
      currentX = ev.clientX;
      currentY = ev.clientY;
    };

    const up = (ev: PointerEvent) => {
      target.releasePointerCapture(e.pointerId);
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", up);

      // If dragged down significantly, make it fall
      const dragDistance = Math.hypot(ev.clientX - startX, ev.clientY - startY);
      const draggedDown = ev.clientY - startY > 50;
      
      if (dragDistance > 100 || draggedDown) {
        setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, falling: true } : n)));
      }
    };

    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", up);
  };

  // Keep notes within viewport on resize (soft clamp)
  useEffect(() => {
    const clamp = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setNotes((prev) =>
        prev.map((n) => ({
          ...n,
          x: Math.min(Math.max(n.x, 10), w - 140),
          y: Math.min(Math.max(n.y, 10), h - 160),
        }))
      );
    };
    window.addEventListener("resize", clamp);
    return () => window.removeEventListener("resize", clamp);
  }, []);

  console.log('Rendering notes:', notes.length);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {notes.map((n) => {
        // Wind effect - subtle tilt only
        const windRotation = wind ? Math.sin(n.floatOffset) * 1.5 : 0;

        const finalX = n.x;
        const finalY = n.falling ? window.innerHeight + 50 : n.y;
        const finalRotation = n.r + windRotation;

        return (
          <div
            key={n.id}
            onPointerDown={(e) => onPointerDown(n.id, e)}
            className="absolute will-change-transform cursor-grab active:cursor-grabbing"
            style={{
              width: 120,
              height: 120,
              transform: `translate3d(${finalX}px, ${finalY}px, 0) rotate(${finalRotation}deg)`,
              transition: n.falling 
                ? "transform 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)" 
                : "transform 0.3s ease-out",
              zIndex: n.z,
              filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))",
            }}
          >
            <NoteVisual
              color={n.color}
              text={n.secret && n.falling ? pick(EASTER_EGGS) : n.text}
              gust={wind}
              textRotation={n.textRotation}
              fontSize={n.fontSize}
            />
          </div>
        );
      })}
    </div>
  );
}

/* ============ visuals ============ */

function NoteVisual({ color, text, gust, textRotation, fontSize }: { 
  color: string; 
  text: string; 
  gust: boolean;
  textRotation: number;
  fontSize: string;
}) {
  
  return (
    <div
      className="w-full h-full rounded-[8px] transition-transform duration-300"
      style={{
        background: color,
        boxShadow: "0 8px 16px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1)",
        border: "1px solid rgba(0,0,0,0.05)",
        transform: gust ? 'scale(1.02) rotate(1deg)' : 'scale(1)',
      }}
    >
      <div
        className="w-full h-[12px] rounded-t-[8px]"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.4), rgba(255,255,255,0))",
        }}
      />
      <div 
        className="px-3 py-2.5 leading-[1.2] text-[#2d3748]"
        style={{
          fontFamily: '"Just Another Hand", cursive',
          fontSize,
          transform: `rotate(${textRotation}deg)`,
          fontWeight: '400',
          whiteSpace: 'pre-line'
        }}
      >
        {text}
      </div>
      {/* Tape effect */}
      <div
        className="absolute left-1/2 -translate-x-1/2 -top-2 w-8 h-2 rounded-[1px] opacity-60"
        style={{ 
          background: "rgba(255,255,240,0.8)",
          border: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
        }}
      />
      {/* Add Google Fonts import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Just+Another+Hand&display=swap');
      `}</style>
    </div>
  );
}

/* ============ helpers ============ */

function seedNotes(): NoteModel[] {
  const w = typeof window !== "undefined" ? window.innerWidth : 1200;
  const h = typeof window !== "undefined" ? window.innerHeight : 800;

  const pool = shuffle(pickMany(NOTES, NOTE_COUNT - 2)); // reserve 2 for secrets
  // Inject a couple of "secret" notes at random indices
  const secretIndices = new Set<number>();
  while (secretIndices.size < 2) secretIndices.add(Math.floor(Math.random() * NOTE_COUNT));

  // Scatter notes randomly across entire background
  const seeded: NoteModel[] = Array.from({ length: NOTE_COUNT }).map((_, i) => {
    const text = secretIndices.has(i) ? "Psst…" : pool[i % pool.length];
    
    // Completely random positioning across the ENTIRE screen
    const x = rand(10, w - 130); // Keep notes away from edges
    const y = rand(10, h - 130); // Cover the full height including behind character
    
    return {
      id: i + 1,
      text,
      color: pick(PALETTE.colors), // Random color from our vibrant assortment
      x,
      y,
      r: rand(-12, 12), // Slightly less rotation for cleaner look
      z: i + 1,
      falling: false,
      secret: secretIndices.has(i),
      floatOffset: Math.random() * Math.PI * 2, // Random phase for floating animation
      textRotation: (Math.random() - 0.5) * 3, // Stable text rotation
      fontSize: Math.random() < 0.3 ? '14px' : Math.random() < 0.6 ? '16px' : '18px', // Stable font size
    };
  });

  return seeded;
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function pickMany<T>(arr: T[], n: number): T[] {
  const a = [...arr];
  shuffle(a);
  return a.slice(0, Math.min(n, a.length));
}
function shuffle<T>(a: T[]): T[] {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}