"use client";

import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

const RADIUS = 1;

export interface Hub {
  name: string;
  country: string;
  lat: number;
  lng: number;
  throughput: string;
  lanes: number;
}

export const HUBS: Hub[] = [
  { name: "Singapore",    country: "SG", lat: 1.35,   lng: 103.82,  throughput: "2.4M/mo", lanes: 42 },
  { name: "Amsterdam",    country: "NL", lat: 52.37,  lng: 4.90,    throughput: "1.8M/mo", lanes: 38 },
  { name: "Dubai",        country: "AE", lat: 25.20,  lng: 55.27,   throughput: "1.5M/mo", lanes: 31 },
  { name: "Los Angeles",  country: "US", lat: 33.94,  lng: -118.41, throughput: "2.1M/mo", lanes: 44 },
  { name: "São Paulo",    country: "BR", lat: -23.55, lng: -46.63,  throughput: "0.9M/mo", lanes: 22 },
  { name: "Tokyo",        country: "JP", lat: 35.68,  lng: 139.76,  throughput: "1.7M/mo", lanes: 35 },
  { name: "Berlin",       country: "DE", lat: 52.52,  lng: 13.40,   throughput: "0.8M/mo", lanes: 24 },
  { name: "Rotterdam",    country: "NL", lat: 51.92,  lng: 4.48,    throughput: "1.2M/mo", lanes: 28 },
  { name: "Hong Kong",    country: "HK", lat: 22.32,  lng: 114.17,  throughput: "1.9M/mo", lanes: 37 },
  { name: "Johannesburg", country: "ZA", lat: -26.20, lng: 28.04,   throughput: "0.5M/mo", lanes: 18 },
];

const ROUTES: Array<[number, number]> = [
  [0, 1], [2, 3], [3, 4], [5, 6], [7, 4], [0, 5], [8, 2], [9, 1],
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
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
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

function Arc({ start, end }: { start: Hub; end: Hub }) {
  const points = useMemo(() => {
    const s = latLngToVec3(start.lat, start.lng);
    const e = latLngToVec3(end.lat, end.lng);
    const mid = s.clone().add(e).multiplyScalar(0.5);
    const distance = s.distanceTo(e);
    const height = RADIUS + distance * 0.35;
    mid.normalize().multiplyScalar(height);
    return new THREE.QuadraticBezierCurve3(s, mid, e).getPoints(64);
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

function HubMarker({
  hub,
  onClick,
  isSelected,
}: {
  hub: Hub;
  onClick: (hub: Hub) => void;
  isSelected: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const v = latLngToVec3(hub.lat, hub.lng, RADIUS * 1.008);
  const pulseRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (pulseRef.current && (hovered || isSelected)) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      pulseRef.current.scale.set(s, s, s);
    }
  });

  const scale = hovered || isSelected ? 1.6 : 1;
  const color = isSelected ? "#ffffff" : hovered ? "#fff1d8" : "#f5d4a5";

  return (
    <group position={[v.x, v.y, v.z]}>
      <mesh
        scale={scale}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick(hub);
        }}
      >
        <sphereGeometry args={[0.014, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {(hovered || isSelected) && (
        <mesh ref={pulseRef}>
          <sphereGeometry args={[0.028, 24, 24]} />
          <meshBasicMaterial color="#d9a56a" transparent opacity={0.25} />
        </mesh>
      )}
    </group>
  );
}

function GlobeGroup({
  onHubClick,
  selectedHub,
  interactive,
}: {
  onHubClick: (hub: Hub) => void;
  selectedHub: Hub | null;
  interactive: boolean;
}) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((_, delta) => {
    if (!ref.current) return;
    if (!interactive) {
      ref.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group ref={ref} rotation={[0.2, 0, 0]}>
      <mesh>
        <sphereGeometry args={[RADIUS, 64, 64]} />
        <meshStandardMaterial color="#0c1218" roughness={0.7} metalness={0.25} />
      </mesh>
      <mesh>
        <sphereGeometry args={[RADIUS * 1.001, 28, 20]} />
        <meshBasicMaterial color="#d9a56a" wireframe transparent opacity={0.06} />
      </mesh>
      <Dots />
      {ROUTES.map(([a, b], i) => (
        <Arc key={i} start={HUBS[a]} end={HUBS[b]} />
      ))}
      {HUBS.map((h) => (
        <HubMarker
          key={h.name}
          hub={h}
          onClick={onHubClick}
          isSelected={selectedHub?.name === h.name}
        />
      ))}
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

export function Globe({
  onHubClick,
  selectedHub,
}: {
  onHubClick: (hub: Hub) => void;
  selectedHub: Hub | null;
}) {
  const [interacting, setInteracting] = useState(false);

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
      <GlobeGroup
        onHubClick={onHubClick}
        selectedHub={selectedHub}
        interactive={interacting}
      />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={!interacting}
        autoRotateSpeed={0.5}
        rotateSpeed={0.55}
        onStart={() => setInteracting(true)}
        onEnd={() => {
          setTimeout(() => setInteracting(false), 2500);
        }}
      />
    </Canvas>
  );
}
