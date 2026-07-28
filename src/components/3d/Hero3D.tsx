import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  Stars,
  MeshDistortMaterial,
  Environment,
} from "@react-three/drei";
import * as THREE from "three";

const FloatingShape = ({
  position,
  color,
  speed,
  distort,
  scale = 1,
}: {
  position: [number, number, number];
  color: string;
  speed: number;
  distort: number;
  scale?: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * speed * 0.3) * 0.2;
      meshRef.current.rotation.y += speed * 0.005;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 2]} />
        <MeshDistortMaterial
          color={color}
          distort={distort}
          speed={speed}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
    </Float>
  );
};

const Scene = () => {
  const shapes = useMemo(
    () => [
      { position: [-3, 1, -2] as [number, number, number], color: "#047857", speed: 1.5, distort: 0.3, scale: 0.8 },
      { position: [3, -1, -3] as [number, number, number], color: "#10b981", speed: 2, distort: 0.4, scale: 0.6 },
      { position: [0, 2, -4] as [number, number, number], color: "#059669", speed: 1.2, distort: 0.2, scale: 1.2 },
      { position: [-2, -2, -1] as [number, number, number], color: "#065f46", speed: 1.8, distort: 0.35, scale: 0.5 },
      { position: [2.5, 2.5, -2.5] as [number, number, number], color: "#34d399", speed: 1.4, distort: 0.25, scale: 0.7 },
    ],
    []
  );

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.4} color="#10b981" />
      <Stars
        radius={50}
        depth={50}
        count={500}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      {shapes.map((shape, i) => (
        <FloatingShape key={i} {...shape} />
      ))}
      <Environment preset="city" />
    </>
  );
};

export default function Hero3D() {
  return (
    <div className="absolute inset-0 z-0">
      <Suspense
        fallback={
          <div className="w-full h-full bg-gradient-to-br from-emerald-950 to-slate-900" />
        }
      >
        <Canvas
          camera={{ position: [0, 0, 8], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
}