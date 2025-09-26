# Brebuilds Interactive Web App 🎪

An interactive web application featuring a cartoon character with mesmerizing mouse-following pupils and a dynamic backdrop of draggable sticky notes with absurd messages.

![Brebuilds App](https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop)

## ✨ Features

### 🎯 Interactive Character
- **Mouse-following pupils** that track your cursor anywhere on screen
- **Adorable cartoon character** positioned at the bottom center
- **Smooth animations** with realistic eye movement physics

### 📝 Dynamic Sticky Notes
- **60+ absurd messages** like "Train my pet cactus" and "Download more RAM"
- **Fully draggable** - click and drag notes anywhere on screen
- **Realistic physics** - drag them down or far enough and they fall off
- **Auto-falling notes** - random notes peel off every 12 seconds
- **Wind effects** - gentle gusts make notes sway every 20 seconds
- **Pastel office colors** - realistic sticky note colors that pop against the white background

### 🎨 Design
- **Clean white background** that makes colors pop
- **"Just Another Hand" font** for authentic handwritten feel
- **Responsive design** that works on all screen sizes
- **Professional branding** with "brebuilds.com" header

## 🛠️ Technologies Used

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling
- **Vite** - Fast build tool and dev server
- **Google Fonts** - Just Another Hand handwritten font

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/brebuilds-interactive-app.git
   cd brebuilds-interactive-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the app in action!

## 📦 Deployment

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Connect your GitHub repo to [Vercel](https://vercel.com)
3. Vercel will automatically detect it's a Vite React app and deploy it

### Deploy to Netlify
1. Push your code to GitHub
2. Connect your GitHub repo to [Netlify](https://netlify.com)
3. Set build command to `npm run build` and publish directory to `dist`

### Deploy to GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json:
   ```json
   {
     "homepage": "https://yourusername.github.io/brebuilds-interactive-app",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```
3. Run: `npm run deploy`

## 🎮 How to Use

1. **Move your mouse** around the screen to see the character's pupils follow your cursor
2. **Click and drag** any sticky note to move it around
3. **Drag notes down** or far enough to make them fall off the screen
4. **Watch for** random notes that fall off automatically
5. **Enjoy the wind effects** that gently sway the notes
6. **Look for easter eggs** - some notes reveal special messages when they fall!

## 📁 Project Structure

```
├── App.tsx                    # Main application component
├── components/
│   ├── StickyNotesBackdrop.tsx  # Draggable sticky notes system
│   └── ui/                      # Reusable UI components
├── imports/
│   └── svg-8wqljlgjvw.ts       # Character SVG data
├── stickyNotesMessages.ts      # All the absurd sticky note messages
├── styles/
│   └── globals.css             # Global styles and Tailwind config
└── README.md                   # This file
```

## 🎨 Customization

### Adding New Sticky Note Messages
Edit `stickyNotesMessages.ts` to add your own absurd messages:

```typescript
export const NOTES = [
  "Your custom message here",
  "Another silly note",
  // ... existing messages
];
```

### Changing Colors
Modify the color palette in `stickyNotesMessages.ts`:

```typescript
export const PALETTE = {
  colors: [
    "your-custom-color",
    // ... existing colors
  ]
};
```

### Adjusting Animation Timing
Update timing constants in `StickyNotesBackdrop.tsx`:

```typescript
const FALL_INTERVAL_MS = 12000;   // How often notes fall
const WIND_GUST_MS = 20000;       // How often wind gusts occur
```

## 🐛 Troubleshooting

**Sticky notes not appearing?**
- Check browser console for errors
- Ensure window dimensions are available (notes initialize after mount)

**Character pupils not following mouse?**
- Make sure JavaScript is enabled
- Check that the SVG is loading properly

**Fonts not loading?**
- Ensure you have internet connection for Google Fonts
- Check browser network tab for font loading errors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎪 About Brebuilds

This interactive web app showcases the creative possibilities of modern web development. Perfect for portfolios, creative agencies, or anyone who wants to add some playful interactivity to their web presence.

Visit [brebuilds.com](https://brebuilds.com) for more awesome projects!

---

**Built with ❤️ and lots of coffee ☕**

*Have fun dragging those sticky notes around! 🎉*