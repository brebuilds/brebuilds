import React, { useEffect, useMemo, useRef } from 'react';

interface DoodleElement {
  type: 'star' | 'heart' | 'arrow' | 'circle' | 'triangle' | 'squiggle' | 'flower' | 'spiral';
  x: number;
  y: number;
  size: number;
  rotation: number;
  opacity: number;
}

export default function DoodleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const doodles = useMemo(() => {
    const elements: DoodleElement[] = [];
    const count = 150; // Number of doodle elements
    
    for (let i = 0; i < count; i++) {
      elements.push({
        type: ['star', 'heart', 'arrow', 'circle', 'triangle', 'squiggle', 'flower', 'spiral'][
          Math.floor(Math.random() * 8)
        ] as DoodleElement['type'],
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: 15 + Math.random() * 25,
        rotation: Math.random() * 360,
        opacity: 0.3 + Math.random() * 0.4
      });
    }
    
    return elements;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      draw();
    };
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      doodles.forEach(doodle => {
        ctx.save();
        ctx.translate(doodle.x, doodle.y);
        ctx.rotate((doodle.rotation * Math.PI) / 180);
        ctx.globalAlpha = doodle.opacity;
        ctx.strokeStyle = '#8B5A2B';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        drawDoodle(ctx, doodle.type, doodle.size);
        
        ctx.restore();
      });
    };
    
    const drawDoodle = (ctx: CanvasRenderingContext2D, type: DoodleElement['type'], size: number) => {
      const half = size / 2;
      
      switch (type) {
        case 'star':
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5;
            const x = Math.cos(angle) * half;
            const y = Math.sin(angle) * half;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.stroke();
          break;
          
        case 'heart':
          ctx.beginPath();
          ctx.moveTo(0, half * 0.3);
          ctx.bezierCurveTo(-half, -half * 0.3, -half * 0.5, -half * 0.8, 0, -half * 0.2);
          ctx.bezierCurveTo(half * 0.5, -half * 0.8, half, -half * 0.3, 0, half * 0.3);
          ctx.stroke();
          break;
          
        case 'arrow':
          ctx.beginPath();
          ctx.moveTo(-half, 0);
          ctx.lineTo(half * 0.5, 0);
          ctx.moveTo(half * 0.2, -half * 0.3);
          ctx.lineTo(half * 0.5, 0);
          ctx.lineTo(half * 0.2, half * 0.3);
          ctx.stroke();
          break;
          
        case 'circle':
          ctx.beginPath();
          ctx.arc(0, 0, half * 0.8, 0, 2 * Math.PI);
          ctx.stroke();
          break;
          
        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(0, -half);
          ctx.lineTo(-half * 0.8, half * 0.6);
          ctx.lineTo(half * 0.8, half * 0.6);
          ctx.closePath();
          ctx.stroke();
          break;
          
        case 'squiggle':
          ctx.beginPath();
          ctx.moveTo(-half, 0);
          ctx.quadraticCurveTo(-half * 0.3, -half * 0.8, 0, 0);
          ctx.quadraticCurveTo(half * 0.3, half * 0.8, half, 0);
          ctx.stroke();
          break;
          
        case 'flower':
          for (let i = 0; i < 6; i++) {
            ctx.save();
            ctx.rotate((i * Math.PI) / 3);
            ctx.beginPath();
            ctx.ellipse(0, -half * 0.5, half * 0.3, half * 0.6, 0, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.restore();
          }
          break;
          
        case 'spiral':
          ctx.beginPath();
          let angle = 0;
          let radius = 0;
          ctx.moveTo(0, 0);
          while (radius < half) {
            angle += 0.2;
            radius += 0.8;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            ctx.lineTo(x, y);
          }
          ctx.stroke();
          break;
      }
    };
    
    resize();
    window.addEventListener('resize', resize);
    
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [doodles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-20 pointer-events-none"
      style={{
        background: 'linear-gradient(135deg, #F4D03F 0%, #F7DC6F 50%, #F9E79F 100%)'
      }}
    />
  );
}