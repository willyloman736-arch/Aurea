"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const RADIUS = 1;

// Fewer hubs now — only the ones that visibly pulse
const HUBS: Array<[number, number]> = [
  [1.35, 103.82],   // Singapore
  [52.37, 4.90],    // Amsterdam
  [33.94, -118.41], // Los Angeles
  [35.68, 139.76],  // Tokyo
  [51.50, -0.13],   // London
  [-23.55, -46.63], // São Paulo
];

function latLngToVec3(lat: number, lng: number, r = RADIUS): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  );
}

function Dots() {
  // Reduced from 140 → 70 points
  const positions = useMemo(() => {
    const count = 70;
    const arr = new Float32Array(count * 3);
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;
      arr[i * 3 + 0] = Math.cos(theta) * r * RADIUS * 1.008;
      arr[i * 3 + 1] = y * RADIUS * 1.008;
      arr[i * 3 + 2] = Math.sin(theta) * r * RADIUS * 1.008;
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.028}
        color="#d9a56a"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function HubDots() {
  // Combine 6 hub dots into one static mesh pair (no per-frame opacity churn).
  // Single sin() still pulses them via shader-less approach: offset by hub index.
  const groupRef = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < groupRef.current.children.length; i++) {
      const child = groupRef.current.children[i] as THREE.Mesh;
      const s = 1 + Math.sin(t * 2 + i * 0.8) * 0.35;
      child.scale.setScalar(s);
    }
  });
  return (
    <group ref={groupRef}>
      {HUBS.map(([lat, lng], i) => {
        const v = latLngToVec3(lat, lng, RADIUS * 1.015);
        return (
          <mesh key={i} position={[v.x, v.y, v.z]}>
            <sphereGeometry args={[0.038, 8, 8]} />
            <meshBasicMaterial color="#ffe2b8" transparent opacity={0.9} />
          </mesh>
        );
      })}
    </group>
  );
}

function GlobeGroup() {
  const ref = useRef<THREE.Group>(null!);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.35;
  });

  return (
    <group ref={ref} rotation={[0.25, 0, 0]}>
      {/* Solid core — reduced tessellation 40→24 */}
      <mesh>
        <sphereGeometry args={[RADIUS, 24, 24]} />
        <meshStandardMaterial color="#0c1218" roughness={0.75} metalness={0.25} />
      </mesh>
      {/* Wireframe shell — already minimal */}
      <mesh>
        <sphereGeometry args={[RADIUS * 1.002, 16, 12]} />
        <meshBasicMaterial color="#d9a56a" wireframe transparent opacity={0.18} />
      </mesh>
      <Dots />
      <HubDots />
    </group>
  );
}

export function NavGlobe({ active = true }: { active?: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0.2, 2.6], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[3, 2, 3]} intensity={2.2} color="#d9a56a" />
      <GlobeGroup />
    </Canvas>
  );
}
