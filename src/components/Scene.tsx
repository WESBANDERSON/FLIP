import { Canvas } from '@react-three/fiber';
import { Environment } from "@react-three/drei";
import { CoinModel } from "./CoinModel";
import { EffectComposer, Bloom, Vignette, HueSaturation, Noise, ColorAverage } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from 'three';

export function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 40 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
        pixelRatio: Math.min(window.devicePixelRatio, 2)
      }}
      style={{ background: '#000000' }}
    >
      {/* Lighting setup */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={2}
        color="#FFF5E1"
      />
      
      <directionalLight
        position={[-5, 3, -5]}
        intensity={1}
        color="#FFE5B4"
      />
      
      <directionalLight
        position={[0, 5, -5]}
        intensity={0.8}
        color="#FFD700"
      />
      
      <ambientLight intensity={0.4} color="#FFE5B4" />

      <CoinModel />
      
      {/* Post-processing effects */}
      <EffectComposer>
        {/* Bloom for shine */}
        <Bloom
          intensity={1.5}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          blendFunction={BlendFunction.SCREEN}
        />
        
        {/* Sepia effect */}
        <HueSaturation
          saturation={-0.5} // Reduce saturation
          hue={0.1} // Slight sepia tint
          blendFunction={BlendFunction.NORMAL}
        />

        {/* Color averaging for vintage look */}
        <ColorAverage
          blendFunction={BlendFunction.NORMAL}
        />
        
        {/* Film grain effect */}
        <Noise
          premultiply
          blendFunction={BlendFunction.MULTIPLY}
          opacity={0.4}
        />
        
        {/* Dark edges */}
        <Vignette
          darkness={0.4}
          offset={0.5}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>

      {/* Environment lighting */}
      <Environment
        preset="studio"
        background={false}
        blur={0.8}
      />
    </Canvas>
  );
} 