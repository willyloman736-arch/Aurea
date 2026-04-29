"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function SpiralRibbon({ phase = 0, color = "#d9a56a" }: { phase?: number; color?: string }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.10;
    ref.current.rotation.y += delta * 0.06;
  });

  return (
    <mesh ref={ref} rotation={[phase, phase * 0.5, 0]}>
      {/* Reduced tessellation: 240→120 tubular, 16→10 radial — ~40% fewer verts */}
      <torusKnotGeometry args={[1.4, 0.08, 120, 10, 2, 5]} />
      <meshStandardMaterial
        color={color}
        roughness={0.25}
        metalness={0.85}
        emissive={color}
        emissiveIntensity={0.18}
      />
    </mesh>
  );
}

export function MetricsBg({ active = true }: { active?: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.2], fov: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      dpr={[1, 1.3]}
      frameloop={active ? "always" : "never"}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 3, 5]} intensity={2.2} color="#d9a56a" />
      <pointLight position={[-5, -3, -2]} intensity={0.9} color="#6b8db5" />
      <SpiralRibbon phase={0} color="#d9a56a" />
      <SpiralRibbon phase={1.2} color="#b8844a" />
    </Canvas>
  );
}
