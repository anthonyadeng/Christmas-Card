'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Snow to disable SSR (prevents window/canvas errors)
const Snow = dynamic(() => import('@/components/Snow'), { ssr: false });

export default function WinterPlayer() {
  const imageUrl = "/image (44) (2).png";
  const audioUrl = "/Untitled project (1).mp3";

  return (
    <main className="flex justify-center items-center min-h-screen w-full bg-gradient-to-b from-[#0f172a] to-[#1e293b] overflow-hidden relative">
      
      {/* Three.js Snow Layer */}
      <Snow />

      {/* Content Layer */}
      <div className="media-card relative z-10">
        <img 
          src={imageUrl} 
          alt="Visual" 
          className="artwork" 
        />
        <audio 
          controls 
          src={audioUrl}
          className="w-full outline-none h-[40px]"
        >
          Your browser does not support the audio element.
        </audio>
      </div>

      <style jsx>{`
        .media-card {
          background-color: rgba(255, 255, 255, 0.95);
         border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          max-width: 400px;
          width: 90%;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .artwork {
          width: 100%;
          height: auto;
          border-radius: 12px;
          display: block;
          object-fit: cover;
          aspect-ratio: 1 / 1;
        }
      `}</style>
    </main>
  );
}