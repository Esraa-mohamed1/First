import React from 'react';

export type ShapeType = 'none' | 'wave-top' | 'wave-bottom' | 'circle-blur' | 'blob' | 'grid-dots' | 'diagonal-lines';

interface SectionShapeOverlayProps {
  shapeType?: ShapeType;
  shapeColor?: string;
  shapeOpacity?: number;
}

export default function SectionShapeOverlay({
  shapeType = 'none',
  shapeColor = '#3b82f6',
  shapeOpacity = 20,
}: SectionShapeOverlayProps) {
  if (shapeType === 'none') return null;

  const opacity = Math.max(5, Math.min(100, shapeOpacity)) / 100;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]" style={{ opacity }}>
      {shapeType === 'wave-top' && (
        <svg viewBox="0 0 1440 120" className="absolute top-0 left-0 w-full" preserveAspectRatio="none" style={{ height: '30%' }}>
          <path d="M0,60 C360,120 1080,0 1440,60 L1440,0 L0,0 Z" fill={shapeColor} />
        </svg>
      )}

      {shapeType === 'wave-bottom' && (
        <svg viewBox="0 0 1440 120" className="absolute bottom-0 left-0 w-full" preserveAspectRatio="none" style={{ height: '30%' }}>
          <path d="M0,60 C360,0 1080,120 1440,60 L1440,120 L0,120 Z" fill={shapeColor} />
        </svg>
      )}

      {shapeType === 'circle-blur' && (
        <>
          <div
            className="absolute -top-1/4 -right-1/4 w-3/4 h-3/4 rounded-full"
            style={{ background: `radial-gradient(circle, ${shapeColor} 0%, transparent 70%)` }}
          />
          <div
            className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 rounded-full"
            style={{ background: `radial-gradient(circle, ${shapeColor} 0%, transparent 70%)` }}
          />
        </>
      )}

      {shapeType === 'blob' && (
        <svg viewBox="0 0 600 600" className="absolute -top-1/4 -right-1/4 w-3/4 h-3/4" xmlns="http://www.w3.org/2000/svg">
          <path
            fill={shapeColor}
            d="M300,50 C380,50 450,100 480,180 C510,260 490,350 440,410 C390,470 310,490 240,460 C170,430 120,360 110,280 C100,200 140,120 200,80 C240,55 270,50 300,50Z"
          />
        </svg>
      )}

      {shapeType === 'grid-dots' && (
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-dots-pattern" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill={shapeColor} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-dots-pattern)" />
        </svg>
      )}

      {shapeType === 'diagonal-lines' && (
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="diagonal-lines-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="20" stroke={shapeColor} strokeWidth="1.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diagonal-lines-pattern)" />
        </svg>
      )}
    </div>
  );
}
