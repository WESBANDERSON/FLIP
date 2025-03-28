import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { MeshTransmissionMaterial } from '@react-three/drei';

export function CoinModel() {
  const coinRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!coinRef.current) return;

    const createRandomFlip = () => {
      const tl = gsap.timeline({
        onComplete: () => {
          createRandomFlip(); // Chain the next random flip
        }
      });
      
      // Reset position and rotation
      coinRef.current!.position.set(0, 0, 0);
      coinRef.current!.rotation.set(0, 0, 0);

      // Animation parameters
      const numFlips = 2 + Math.floor(Math.random() * 2); // 2-3 flips for more consistency
      const flipDuration = 4; // Increased from 2 to 4 seconds
      const jumpHeight = 1.5; // Fixed height
      const sideRotation = (Math.random() - 0.5) * Math.PI * 0.1; // Reduced wobble
      const flipAxis = Math.random() < 0.2 ? "y" : "x"; // 20% chance of side flip
      
      // Main flip animation
      tl.to(coinRef.current!.rotation, {
        [flipAxis]: Math.PI * 2 * numFlips,
        duration: flipDuration,
        ease: "power2.inOut" // Consistent easing
      })
      // Jump animation
      .to(coinRef.current!.position, {
        y: jumpHeight,
        duration: flipDuration / 2,
        ease: "power2.out"
      }, 0)
      // Fall animation
      .to(coinRef.current!.position, {
        y: 0,
        duration: flipDuration / 2,
        ease: "bounce.out"
      }, flipDuration / 2)
      // Slight wobble on landing
      .to(coinRef.current!.rotation, {
        z: sideRotation,
        duration: 0.6, // Increased from 0.3
        ease: "power2.out"
      }, flipDuration - 0.4) // Adjusted timing
      // Stabilize
      .to(coinRef.current!.rotation, {
        z: 0,
        duration: 0.8, // Increased from 0.4
        ease: "power2.out"
      }, flipDuration + 0.2) // Adjusted timing
      // Longer pause before next flip
      .to({}, {
        duration: 3 // Increased from 1 to 3 seconds
      });

      return tl;
    };

    // Start the random flip sequence
    createRandomFlip();

    return () => {
      // Cleanup all GSAP animations
      gsap.killTweensOf(coinRef.current!.rotation);
      gsap.killTweensOf(coinRef.current!.position);
    };
  }, []);

  // Create an array of decorative rings with more spacing
  const rings = Array.from({ length: 8 }, (_, i) => {
    const radius = 1 - (i * 0.1); // Increased spacing between rings
    const thickness = 0.025 + (i * 0.002); // Slightly thicker rings
    // More contrast in metallic values
    const metallic = i % 2 ? 0.8 : 1;
    // More contrast in roughness
    const roughness = i % 2 ? 0.4 : 0.1;
    return { radius, thickness, metallic, roughness };
  });

  // Create spiral pattern rings with more elements
  const spiralRings = Array.from({ length: 8 }, (_, i) => {
    const baseRadius = 0.4 + (i * 0.06);
    const thickness = 0.015 + (i * 0.001);
    return { radius: baseRadius, thickness };
  });

  // Add refs for the spiral rings groups
  const frontSpiralRef = useRef<THREE.Group>(null);
  const backSpiralRef = useRef<THREE.Group>(null);

  // Add rotation animation for spiral rings
  useEffect(() => {
    if (!frontSpiralRef.current || !backSpiralRef.current) return;

    const animateSpirals = () => {
      if (frontSpiralRef.current) {
        frontSpiralRef.current.rotation.y += 0.02; // Rotate around Y axis
        frontSpiralRef.current.rotation.x += 0.01; // Add slight X rotation
      }
      if (backSpiralRef.current) {
        backSpiralRef.current.rotation.y -= 0.02; // Opposite Y rotation
        backSpiralRef.current.rotation.x -= 0.01; // Opposite X rotation
      }
      requestAnimationFrame(animateSpirals);
    };

    animateSpirals();
  }, []);

  // Create edge rings for depth with fewer rings
  const edgeRings = Array.from({ length: 4 }, (_, i) => {
    const y = (i - 1.5) * 0.03; // Increased spacing between edge rings
    return { y };
  });

  return (
    <group ref={coinRef} scale={[0.8, 0.8, 0.8]}>
      {/* Edge rings replacing the main body */}
      {edgeRings.map((ring, i) => (
        <mesh key={`edge-ring-${i}`} castShadow position={[0, ring.y, 0]}>
          <torusGeometry args={[1, 0.025, 32, 128]} />
          <meshPhysicalMaterial
            color={new THREE.Color('#FFD700').convertSRGBToLinear()}
            metalness={1}
            roughness={0.1}
            envMapIntensity={2}
            clearcoat={1}
            clearcoatRoughness={0.2}
            reflectivity={1}
            ior={1.5}
            sheen={0.8}
            sheenRoughness={0.2}
            sheenColor={new THREE.Color('#FFE5B4').convertSRGBToLinear()}
          />
        </mesh>
      ))}

      {/* Outer rim */}
      <mesh castShadow>
        <torusGeometry args={[1.02, 0.08, 32, 128]} />
        <meshPhysicalMaterial
          color={new THREE.Color('#B8860B').convertSRGBToLinear()}
          metalness={1}
          roughness={0.2}
          envMapIntensity={1.5}
          clearcoat={0.8}
          clearcoatRoughness={0.2}
          sheen={0.5}
          sheenRoughness={0.2}
          sheenColor={new THREE.Color('#8B7355').convertSRGBToLinear()}
        />
      </mesh>

      {/* Front decorative layers */}
      {rings.map((ring, i) => (
        <mesh
          key={`front-ring-${i}`}
          castShadow
          position={[0, 0.06 + (i * 0.004), 0]}
        >
          <torusGeometry args={[ring.radius, ring.thickness, 32, 128]} />
          <meshPhysicalMaterial
            color={new THREE.Color(i % 2 ? '#DAA520' : '#FFD700').convertSRGBToLinear()}
            metalness={1}
            roughness={0.1}
            envMapIntensity={2}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>
      ))}

      {/* Back decorative layers */}
      {rings.map((ring, i) => (
        <mesh
          key={`back-ring-${i}`}
          castShadow
          position={[0, -0.06 - (i * 0.004), 0]}
        >
          <torusGeometry args={[ring.radius, ring.thickness, 32, 128]} />
          <meshPhysicalMaterial
            color={new THREE.Color(i % 2 ? '#DAA520' : '#FFD700').convertSRGBToLinear()}
            metalness={1}
            roughness={0.1}
            envMapIntensity={2}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>
      ))}

      {/* Spiral pattern - Front */}
      <group ref={frontSpiralRef}>
        {spiralRings.map((ring, i) => (
          <mesh
            key={`front-spiral-${i}`}
            castShadow
            position={[0, 0.07 + (i * 0.002), 0]}
            rotation={[0, (i * Math.PI) / 2, 0]}
          >
            <torusGeometry args={[ring.radius, ring.thickness, 16, 128]} />
            <meshPhysicalMaterial
              color={new THREE.Color('#FFD700').convertSRGBToLinear()}
              metalness={1}
              roughness={0.05}
              envMapIntensity={2.5}
              clearcoat={1}
              clearcoatRoughness={0.05}
              transparent={true}
              opacity={0.9 - (i * 0.03)}
            />
          </mesh>
        ))}
      </group>

      {/* Spiral pattern - Back */}
      <group ref={backSpiralRef}>
        {spiralRings.map((ring, i) => (
          <mesh
            key={`back-spiral-${i}`}
            castShadow
            position={[0, -0.07 - (i * 0.002), 0]}
            rotation={[0, -(i * Math.PI) / 2, 0]}
          >
            <torusGeometry args={[ring.radius, ring.thickness, 16, 128]} />
            <meshPhysicalMaterial
              color={new THREE.Color('#FFD700').convertSRGBToLinear()}
              metalness={1}
              roughness={0.05}
              envMapIntensity={2.5}
              clearcoat={1}
              clearcoatRoughness={0.05}
              transparent={true}
              opacity={0.9 - (i * 0.03)}
            />
          </mesh>
        ))}
      </group>

      {/* Additional decorative rings */}
      {[0.88, 0.96].map((radius, i) => (
        <mesh
          key={`decorative-ring-${i}`}
          castShadow
          position={[0, 0, 0]}
        >
          <torusGeometry args={[radius, 0.02, 32, 128]} />
          <meshPhysicalMaterial
            color={new THREE.Color('#DAA520').convertSRGBToLinear()}
            metalness={1}
            roughness={0.2}
            envMapIntensity={1.5}
            clearcoat={0.8}
            clearcoatRoughness={0.2}
            sheen={0.5}
            sheenRoughness={0.2}
            sheenColor={new THREE.Color('#8B7355').convertSRGBToLinear()}
          />
        </mesh>
      ))}

      {/* Center piece */}
      <mesh castShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.02, 32]} />
        <meshPhysicalMaterial
          color={new THREE.Color('#FFD700').convertSRGBToLinear()}
          metalness={1}
          roughness={0.1}
          envMapIntensity={2}
          clearcoat={1}
          clearcoatRoughness={0.1}
          reflectivity={1}
          ior={1.5}
          sheen={0.8}
          sheenRoughness={0.2}
          sheenColor={new THREE.Color('#FFE5B4').convertSRGBToLinear()}
        />
      </mesh>
    </group>
  );
} 