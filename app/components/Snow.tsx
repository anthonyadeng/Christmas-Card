'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Snow = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.pointerEvents = 'none';
    
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Create snowflakes
    const particlesCount = 500;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i+=3) {
      posArray[i] = (Math.random() - 0.5) * 20;
      posArray[i+1] = Math.random() * 20 - 10;
      posArray[i+2] = (Math.random() - 0.5) * 10;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Create snowflake texture
    const createSnowflakeTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.Texture();

      const centerX = 32;
      const centerY = 32;
      ctx.strokeStyle = 'white';
      ctx.fillStyle = 'white';
      ctx.lineWidth = 2;

      // Draw 6-pointed snowflake
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const x = centerX + Math.cos(angle) * 20;
        const y = centerY + Math.sin(angle) * 20;
        
        // Main arm
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        // Side branches
        const branchLen = 8;
        const branchX = centerX + Math.cos(angle) * 12;
        const branchY = centerY + Math.sin(angle) * 12;
        
        ctx.beginPath();
        ctx.moveTo(branchX, branchY);
        ctx.lineTo(branchX + Math.cos(angle + Math.PI/4) * branchLen, 
                   branchY + Math.sin(angle + Math.PI/4) * branchLen);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(branchX, branchY);
        ctx.lineTo(branchX + Math.cos(angle - Math.PI/4) * branchLen, 
                   branchY + Math.sin(angle - Math.PI/4) * branchLen);
        ctx.stroke();
      }

      // Center dot
      ctx.beginPath();
      ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
      ctx.fill();

      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    const material = new THREE.PointsMaterial({
      size: 0.15,
      map: createSnowflakeTexture(),
      transparent: true,
      opacity: 0.9,
      depthWrite: false
    });

    const particlesMesh = new THREE.Points(particlesGeometry, material);
    scene.add(particlesMesh);

    let animationId: number;
    
    const animate = () => {
      const positions = particlesGeometry.attributes.position.array as Float32Array;
      
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] -= 0.02;
        
        if (positions[i] < -10) {
          positions[i] = 10;
        }
      }

      particlesGeometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      particlesGeometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 50
      }}
    />
  );
};

export default Snow;