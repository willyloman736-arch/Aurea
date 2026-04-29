"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, Float, Environment } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function PackageCube() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.22;
    ref.current.rotation.y += delta * 0.32;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={1.1}>
      <mesh ref={ref}>
        <boxGeometry args={[1.6, 1.6, 1.6]} />
        <MeshTransmissionMaterial
          backside
          samples={3}
          resolution={128}
          thickness={0.6}
          roughness={0.08}
          chromaticAberration={0.2}
          anisotropy={0.15}
          distortion={0.18}
          distortionScale={0.3}
          temporalDistortion={0}
          ior={1.5}
          transmission={0.98}
          color="#f3d6a8"
          attenuationColor="#d9a56a"
          attenuationDistance={1.2}
        />
      </mesh>
      {/* Inner accent cube (edge-only) */}
      <mesh scale={1.01}>
        <boxGeometry args={[1.6, 1.6, 1.6]} />
        <meshBasicMaterial color="#d9a56a" wireframe transparent opacity={0.08} />
      </mesh>
    </Float>
  );
}

export function HeroCube({ active = true }: { active?: boolean }) {
  return (
    <Canvas
      camera={{ position: [2.4, 1.6, 3.2], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 1.6]}
      frameloop={active ? "always" : "never"}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[6, 5, 4]} intensity={3.2} color="#f3d6a8" />
      <pointLight position={[-4, -2, -3]} intensity={1.2} color="#6b8db5" />
      <Environment preset="sunset" />
      <PackageCube />
    </Canvas>
  );
}
