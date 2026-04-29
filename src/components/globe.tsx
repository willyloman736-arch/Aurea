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

// Soft round sprite for dots and halos — avoids the "ugly square pixel" look
// that pointsMaterial gets without a map.
function makeRadialSprite(inner: string, outer: string): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, inner);
  g.addColorStop(0.5, outer);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

function Dots() {
  const tex = useMemo(
    () =>
      makeRadialSprite(
        "rgba(255, 232, 196, 1)",
        "rgba(217, 165, 106, 0.5)",
      ),
    [],
  );

  const positions = useMemo(() => {
    const count = 1600;
    const arr = new Float32Array(count * 3);
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;
      arr[i * 3 + 0] = Math.cos(theta) * r * RADIUS * 1.004;
      arr[i * 3 + 1] = y * RADIUS * 1.004;
      arr[i * 3 + 2] = Math.sin(theta) * r * RADIUS * 1.004;
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.026}
        map={tex}
        color="#e9b981"
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        alphaTest={0.01}
      />
    </points>
  );
}

function Arc({
  start,
  end,
  index,
}: {
  start: Hub;
  end: Hub;
  index: number;
}) {
  const curve = useMemo(() => {
    const s = latLngToVec3(start.lat, start.lng);
    const e = latLngToVec3(end.lat, end.lng);
    const mid = s.clone().add(e).multiplyScalar(0.5);
    const distance = s.distanceTo(e);
    const height = RADIUS + distance * 0.42;
    mid.normalize().multiplyScalar(height);
    return new THREE.QuadraticBezierCurve3(s, mid, e);
  }, [start, end]);

  const points = useMemo(() => curve.getPoints(96), [curve]);

  const pulseRef = useRef<THREE.Mesh>(null!);
  const period = 3.4 + (index % 4) * 0.9;
  const phase = (index * 0.41) % 1;

  useFrame((state) => {
    if (!pulseRef.current) return;
    const t =
      ((state.clock.elapsedTime / period) + phase) % 1;
    const p = curve.getPoint(t);
    pulseRef.current.position.copy(p);
    // Bright in the middle of the arc, fade at endpoints.
    const fade = Math.sin(t * Math.PI);
    const m = pulseRef.current.material as THREE.MeshBasicMaterial;
    m.opacity = 0.25 + fade * 0.75;
    const s = 0.7 + fade * 0.6;
    pulseRef.current.scale.setScalar(s);
  });

  return (
    <group>
      {/* Soft outer glow line */}
      <Line
        points={points}
        color="#d9a56a"
        lineWidth={3.5}
        transparent
        opacity={0.18}
      />
      {/* Bright inner line */}
      <Line
        points={points}
        color="#fff1d8"
        lineWidth={1.1}
        transparent
        opacity={0.85}
      />
      {/* Travelling pulse */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.014, 16, 16]} />
        <meshBasicMaterial
          color="#fff4dd"
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function HubMarker({
  hub,
  haloTex,
  onClick,
  isSelected,
}: {
  hub: Hub;
  haloTex: THREE.CanvasTexture;
  onClick: (hub: Hub) => void;
  isSelected: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const v = latLngToVec3(hub.lat, hub.lng, RADIUS * 1.008);
  const pulseRef = useRef<THREE.Mesh>(null!);
  const haloRef = useRef<THREE.Sprite>(null!);

  useFrame((state) => {
    // Always-on subtle pulse on the halo so the network feels "alive".
    const breathe = 1 + Math.sin(state.clock.elapsedTime * 1.4 + hub.lat) * 0.08;
    const baseScale = isSelected ? 0.16 : hovered ? 0.13 : 0.08;
    if (haloRef.current) {
      haloRef.current.scale.setScalar(baseScale * breathe);
    }
    if (pulseRef.current && (hovered || isSelected)) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.25;
      pulseRef.current.scale.set(s, s, s);
    }
  });

  const coreScale = hovered || isSelected ? 1.5 : 1;
  const coreColor = isSelected ? "#ffffff" : hovered ? "#fff5e0" : "#fbe4bd";

  return (
    <group position={[v.x, v.y, v.z]}>
      {/* Always-on halo sprite (billboarded) */}
      <sprite ref={haloRef}>
        <spriteMaterial
          map={haloTex}
          color="#d9a56a"
          transparent
          opacity={isSelected ? 0.95 : hovered ? 0.8 : 0.55}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>

      {/* Bright inner core */}
      <mesh
        scale={coreScale}
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
        <sphereGeometry args={[0.013, 20, 20]} />
        <meshBasicMaterial color={coreColor} />
      </mesh>

      {/* Active-state pulse ring */}
      {(hovered || isSelected) && (
        <mesh ref={pulseRef}>
          <sphereGeometry args={[0.032, 24, 24]} />
          <meshBasicMaterial
            color="#d9a56a"
            transparent
            opacity={0.28}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  );
}

function Atmosphere() {
  // Three stacked back-side shells produce a soft amber rim that fades
  // outward — no shaders needed.
  return (
    <group>
      <mesh>
        <sphereGeometry args={[RADIUS * 1.025, 64, 64]} />
        <meshBasicMaterial
          color="#d9a56a"
          transparent
          opacity={0.22}
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[RADIUS * 1.09, 48, 48]} />
        <meshBasicMaterial
          color="#d9a56a"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[RADIUS * 1.22, 32, 32]} />
        <meshBasicMaterial
          color="#b8844a"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
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
  const haloTex = useMemo(
    () =>
      makeRadialSprite(
        "rgba(255, 232, 196, 0.95)",
        "rgba(217, 165, 106, 0.35)",
      ),
    [],
  );

  useFrame((_, delta) => {
    if (!ref.current) return;
    if (!interactive) {
      ref.current.rotation.y += delta * 0.06;
    }
  });

  return (
    <group ref={ref} rotation={[0.18, 0, 0]}>
      {/* Solid base sphere — very dark, slightly cool so the warm dots pop */}
      <mesh>
        <sphereGeometry args={[RADIUS, 96, 96]} />
        <meshStandardMaterial
          color="#0a0f15"
          roughness={1}
          metalness={0}
        />
      </mesh>
      {/* Thin warm rim sitting on the surface */}
      <mesh>
        <sphereGeometry args={[RADIUS * 1.0008, 64, 64]} />
        <meshBasicMaterial
          color="#1a1410"
          transparent
          opacity={0.6}
          depthWrite={false}
        />
      </mesh>
      <Dots />
      {ROUTES.map(([a, b], i) => (
        <Arc key={i} index={i} start={HUBS[a]} end={HUBS[b]} />
      ))}
      {HUBS.map((h) => (
        <HubMarker
          key={h.name}
          hub={h}
          haloTex={haloTex}
          onClick={onHubClick}
          isSelected={selectedHub?.name === h.name}
        />
      ))}
    </group>
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
      camera={{ position: [0, 0.2, 2.85], fov: 38 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      dpr={[1, 2]}
      style={{ background: "transparent" }}
    >
      {/* Cool low ambient + warm directional key + cool fill */}
      <ambientLight intensity={0.18} color="#9fb6cc" />
      <directionalLight
        position={[3.2, 2.6, 4]}
        intensity={1.6}
        color="#ffd9a8"
      />
      <directionalLight
        position={[-4, -1.5, -3]}
        intensity={0.4}
        color="#5c7d9f"
      />
      <Atmosphere />
      <GlobeGroup
        onHubClick={onHubClick}
        selectedHub={selectedHub}
        interactive={interacting}
      />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={!interacting}
        autoRotateSpeed={0.45}
        rotateSpeed={0.55}
        onStart={() => setInteracting(true)}
        onEnd={() => {
          setTimeout(() => setInteracting(false), 2500);
        }}
      />
    </Canvas>
  );
}
