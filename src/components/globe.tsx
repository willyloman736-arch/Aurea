"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const RADIUS = 1;

const HUBS = [
  { name: "Singapore",   lat: 1.35,   lng: 103.82 },
  { name: "Amsterdam",   lat: 52.37,  lng: 4.90 },
  { name: "Dubai",       lat: 25.20,  lng: 55.27 },
  { name: "Los Angeles", lat: 33.94,  lng: -118.41 },
  { name: "São Paulo",   lat: -23.55, lng: -46.63 },
  { name: "Tokyo",       lat: 35.68,  lng: 139.76 },
  { name: "Berlin",      lat: 52.52,  lng: 13.40 },
  { name: "Rotterdam",   lat: 51.92,  lng: 4.48 },
  { name: "Hong Kong",   lat: 22.32,  lng: 114.17 },
  { name: "Johannesburg",lat: -26.20, lng: 28.04 },
];

const ROUTES: Array<[number, number]> = [
  [0, 1], // Singapore → Amsterdam
  [2, 3], // Dubai → LA
  [3, 4], // LA → São Paulo
  [5, 6], // Tokyo → Berlin
  [7, 4], // Rotterdam → São Paulo
  [0, 5], // Singapore → Tokyo
  [8, 2], // Hong Kong → Dubai
  [9, 1], // Johannesburg → Amsterdam
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
  const positions = useMemo(() => {
    const count = 280;
    const arr = new Float32Array(count * 3);
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;
      arr[i * 3 + 0] = Math.cos(theta) * r * RADIUS * 1.005;
      arr[i * 3 + 1] = y * RADIUS * 1.005;
      arr[i * 3 + 2] = Math.sin(theta) * r * RADIUS * 1.005;
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.012}
        color="#d9a56a"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function Arc({ start, end }: { start: typeof HUBS[number]; end: typeof HUBS[number] }) {
  const points = useMemo(() => {
    const s = latLngToVec3(start.lat, start.lng);
    const e = latLngToVec3(end.lat, end.lng);
    const mid = s.clone().add(e).multiplyScalar(0.5);
    const distance = s.distanceTo(e);
    const height = RADIUS + distance * 0.35;
    mid.normalize().multiplyScalar(height);
    const curve = new THREE.QuadraticBezierCurve3(s, mid, e);
    return curve.getPoints(64);
  }, [start, end]);

  return (
    <Line
      points={points}
      color="#e9b981"
      lineWidth={1.4}
      transparent
      opacity={0.85}
    />
  );
}

function HubMarkers() {
  return (
    <>
      {HUBS.map((h) => {
        const v = latLngToVec3(h.lat, h.lng, RADIUS * 1.008);
        return (
          <mesh key={h.name} position={[v.x, v.y, v.z]}>
            <sphereGeometry args={[0.014, 12, 12]} />
            <meshBasicMaterial color="#f5d4a5" />
          </mesh>
        );
      })}
    </>
  );
}

function GlobeGroup() {
  const ref = useRef<THREE.Group>(null!);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.08;
  });

  return (
    <group ref={ref} rotation={[0.2, 0, 0]}>
      <mesh>
        <sphereGeometry args={[RADIUS, 64, 64]} />
        <meshStandardMaterial
          color="#0c1218"
          roughness={0.7}
          metalness={0.25}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[RADIUS * 1.001, 28, 20]} />
        <meshBasicMaterial
          color="#d9a56a"
          wireframe
          transparent
          opacity={0.06}
        />
      </mesh>
      <Dots />
      {ROUTES.map(([a, b], i) => (
        <Arc key={i} start={HUBS[a]} end={HUBS[b]} />
      ))}
      <HubMarkers />
    </group>
  );
}

function Glow() {
  return (
    <mesh>
      <sphereGeometry args={[RADIUS * 1.12, 48, 48]} />
      <meshBasicMaterial
        color="#d9a56a"
        transparent
        opacity={0.06}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}

export function Globe() {
  return (
    <Canvas
      camera={{ position: [0, 0.25, 2.75], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 2]}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 3, 4]} intensity={2.4} color="#d9a56a" />
      <pointLight position={[-3, -1, -4]} intensity={0.7} color="#5b7b9c" />
      <Glow />
      <GlobeGroup />
    </Canvas>
  );
}
