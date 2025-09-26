import { useState, useEffect, useRef } from 'react';
import svgPaths from "./imports/svg-8wqljlgjvw";
import StickyNotesBackdrop from "./components/StickyNotesBackdrop";

export default function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Calculate pupil positions based on mouse position
  const calculatePupilPosition = (eyeCenterX: number, eyeCenterY: number, eyeRadius: number) => {
    if (!svgRef.current) return { x: eyeCenterX, y: eyeCenterY };

    const svgRect = svgRef.current.getBoundingClientRect();
    const svgX = ((mousePosition.x - svgRect.left) / svgRect.width) * 864;
    const svgY = ((mousePosition.y - svgRect.top) / svgRect.height) * 864;

    const deltaX = svgX - eyeCenterX;
    const deltaY = svgY - eyeCenterY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Limit pupil movement to stay within the eye
    const maxDistance = eyeRadius * 0.6; // Keep pupils well within the eye bounds
    
    if (distance <= maxDistance) {
      return { x: svgX, y: svgY };
    } else {
      const angle = Math.atan2(deltaY, deltaX);
      return {
        x: eyeCenterX + Math.cos(angle) * maxDistance,
        y: eyeCenterY + Math.sin(angle) * maxDistance
      };
    }
  };

  // Eye centers and radius based on the SVG paths
  const leftEyeCenter = { x: 376.2, y: 381.7 };
  const rightEyeCenter = { x: 498.3, y: 381.7 };
  const eyeRadius = 61.1;

  const leftPupil = calculatePupilPosition(leftEyeCenter.x, leftEyeCenter.y, eyeRadius);
  const rightPupil = calculatePupilPosition(rightEyeCenter.x, rightEyeCenter.y, eyeRadius);

  return (
    <div className="relative size-full min-h-screen overflow-hidden bg-white">
      {/* Animated sticky notes (background layer) */}
      <StickyNotesBackdrop />
      
      {/* Website name at top center */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
        <h1 
          className="text-6xl text-gray-700 select-none"
          style={{
            fontFamily: '"Just Another Hand", cursive',
            transform: 'rotate(-2deg)',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          brebuilds.com
        </h1>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Just+Another+Hand&display=swap');
        `}</style>
      </div>
      
      {/* Character positioned at bottom center (top layer) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10">
        <div className="relative w-[32rem] h-[32rem]" data-name="Artboard 2 1">
        <svg 
          ref={svgRef}
          className="block size-full" 
          fill="none" 
          preserveAspectRatio="xMidYMid meet" 
          viewBox="0 0 864 864"
        >
          <g id="Artboard 2 1">
            <path d={svgPaths.p297af500} fill="var(--fill-0, #E0D555)" id="Vector" stroke="var(--stroke-0, black)" strokeMiterlimit="10" strokeWidth="4" />
            <path d={svgPaths.p36798300} fill="var(--fill-0, #E0D555)" id="Vector_2" stroke="var(--stroke-0, black)" strokeMiterlimit="10" strokeWidth="4" />
            <path d={svgPaths.p1bf243c0} id="Vector_3" stroke="var(--stroke-0, black)" strokeMiterlimit="10" strokeWidth="3" />
            <path d={svgPaths.p26b41b00} id="Vector_4" stroke="var(--stroke-0, black)" strokeMiterlimit="10" strokeWidth="3" />
            <path d={svgPaths.pd8c1700} id="Vector_5" stroke="var(--stroke-0, black)" strokeMiterlimit="10" strokeWidth="3" />
            <path d={svgPaths.p3ce9f180} fill="var(--fill-0, #E0D555)" id="Vector_6" stroke="var(--stroke-0, black)" strokeMiterlimit="10" strokeWidth="4" />
            <path d={svgPaths.p320b4b80} id="Vector_7" stroke="var(--stroke-0, black)" strokeMiterlimit="10" strokeWidth="3" />
            <path d={svgPaths.p18b9c640} id="Vector_8" stroke="var(--stroke-0, black)" strokeMiterlimit="10" strokeWidth="3" />
            <path d={svgPaths.p27a78f00} id="Vector_9" stroke="var(--stroke-0, black)" strokeMiterlimit="10" strokeWidth="3" />
            <g id="Group">
              <path d={svgPaths.ped10e00} fill="var(--fill-0, #E0D555)" id="Vector_10" />
              <path d={svgPaths.p30b10c00} fill="var(--fill-0, black)" id="Vector_11" />
            </g>
            <path d={svgPaths.p224cc500} fill="var(--fill-0, #603813)" id="Vector_12" stroke="var(--stroke-0, black)" strokeMiterlimit="10" strokeWidth="6" />
            <path d={svgPaths.p3325b780} fill="var(--fill-0, black)" id="Vector_13" stroke="var(--stroke-0, black)" strokeMiterlimit="10" strokeWidth="4" />
            <path d={svgPaths.p4aabe80} fill="var(--fill-0, black)" id="Vector_14" stroke="var(--stroke-0, black)" strokeMiterlimit="10" strokeWidth="2" />
            <path d={svgPaths.p8325300} fill="var(--fill-0, black)" id="Vector_15" stroke="var(--stroke-0, black)" strokeMiterlimit="10" strokeWidth="2" />
            <g id="Vector_16"></g>
            <path d={svgPaths.p3872f600} id="Vector_17" stroke="var(--stroke-0, black)" strokeMiterlimit="10" strokeWidth="0.2" />
            <path d={svgPaths.p244fe900} id="Vector_18" stroke="var(--stroke-0, black)" strokeMiterlimit="10" strokeWidth="0.2" />
            <path d={svgPaths.p22f25e00} id="Vector_19" stroke="var(--stroke-0, black)" strokeMiterlimit="10" strokeWidth="0.2" />
            <path d={svgPaths.pd136260} id="Vector_20" stroke="var(--stroke-0, black)" strokeMiterlimit="10" strokeWidth="0.2" />
            <path d={svgPaths.p1988d840} id="Vector_21" stroke="var(--stroke-0, black)" strokeMiterlimit="10" strokeWidth="0.2" />
            <path d={svgPaths.p1923d500} id="Vector_22" stroke="var(--stroke-0, black)" strokeMiterlimit="10" strokeWidth="0.2" />
            <path d={svgPaths.p3c49cb00} id="Vector_23" stroke="var(--stroke-0, black)" strokeMiterlimit="10" strokeWidth="0.2" />
            <path d={svgPaths.p26c47300} id="Vector_24" stroke="var(--stroke-0, black)" strokeMiterlimit="10" strokeWidth="0.2" />
            <path d={svgPaths.p37fc3600} id="Vector_25" stroke="var(--stroke-0, black)" strokeMiterlimit="10" strokeWidth="0.2" />
            <path d={svgPaths.p2bd73a80} id="Vector_26" stroke="var(--stroke-0, black)" strokeMiterlimit="10" strokeWidth="0.2" />
            <path d={svgPaths.p177e3e00} id="Vector_27" stroke="var(--stroke-0, black)" strokeMiterlimit="10" strokeWidth="0.2" />
            <path d={svgPaths.p2e248800} fill="var(--fill-0, white)" id="Vector_28" stroke="var(--stroke-0, black)" strokeMiterlimit="10" strokeWidth="3" />
            <path d={svgPaths.p14a2aee0} id="Vector_29" stroke="var(--stroke-0, black)" strokeMiterlimit="10" strokeWidth="3" />
            <path d={svgPaths.p2842d6c0} id="Vector_30" stroke="var(--stroke-0, black)" strokeMiterlimit="10" strokeWidth="3" />
            <path d={svgPaths.p10db9600} fill="var(--fill-0, black)" id="Vector_31" stroke="var(--stroke-0, black)" strokeMiterlimit="10" strokeWidth="4" />
            
            {/* White eye circles */}
            <path d={svgPaths.p20f09780} fill="var(--fill-0, white)" id="Vector_32" stroke="var(--stroke-0, black)" strokeMiterlimit="10" strokeWidth="4" />
            <path d={svgPaths.p8d4cd00} fill="var(--fill-0, white)" id="Vector_33" stroke="var(--stroke-0, black)" strokeMiterlimit="10" strokeWidth="4" />
            
            {/* Pupils that follow the mouse */}
            <circle 
              cx={leftPupil.x} 
              cy={leftPupil.y} 
              r="22" 
              fill="black"
              style={{ transition: 'cx 0.1s ease-out, cy 0.1s ease-out' }}
            />
            <circle 
              cx={rightPupil.x} 
              cy={rightPupil.y} 
              r="22" 
              fill="black"
              style={{ transition: 'cx 0.1s ease-out, cy 0.1s ease-out' }}
            />
          </g>
        </svg>
        </div>
      </div>
    </div>
  );
}