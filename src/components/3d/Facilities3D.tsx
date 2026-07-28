import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

const FacilityCard = ({
  position,
  color,
  label,
  description,
  isActive,
  onClick,
}: {
  position: [number, number, number];
  color: string;
  label: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.lerp(
        new THREE.Vector3(
          isActive ? 1.3 : hovered ? 1.1 : 1,
          isActive ? 1.3 : hovered ? 1.1 : 1,
          isActive ? 1.3 : hovered ? 1.1 : 1
        ),
        0.1
      );
    }
  });

  return (
    <group position={position}>
      <Float speed={isActive ? 2 : 1} floatIntensity={isActive ? 0.3 : 0.1}>
        <RoundedBox
          ref={meshRef}
          args={[2, 2.5, 0.2]}
          radius={0.1}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <meshStandardMaterial
            color={color}
            roughness={0.4}
            metalness={0.1}
            emissive={isActive ? color : "#000000"}
            emissiveIntensity={isActive ? 0.3 : 0}
          />
        </RoundedBox>
        <Text
          position={[0, 0.6, 0.15]}
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {label}
        </Text>
        <Text
          position={[0, -0.3, 0.15]}
          fontSize={0.12}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.8}
        >
          {description}
        </Text>
      </Float>
    </group>
  );
};

const Scene = ({ activeFacility, setActiveFacility }: {
  activeFacility: number;
  setActiveFacility: (i: number) => void;
}) => {
  const facilities = [
    { label: "Science Labs", description: "8 state-of-the-art labs with modern equipment", color: "#047857" },
    { label: "Sports Complex", description: "Olympic-size pool, courts, and fields", color: "#059669" },
    { label: "Digital Library", description: "50,000+ books and digital resources", color: "#10b981" },
    { label: "AI & Robotics", description: "Cutting-edge AI/ML research center", color: "#065f46" },
  ];

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#10b981" />
      {facilities.map((f, i) => (
        <FacilityCard
          key={i}
          position={[(i - 1.5) * 2.5, 0, 0]}
          color={f.color}
          label={f.label}
          description={f.description}
          isActive={activeFacility === i}
          onClick={() => setActiveFacility(i)}
        />
      ))}
    </>
  );
};

export default function Facilities3D() {
  const [activeFacility, setActiveFacility] = useState(0);

  const facilities = [
    { label: "Science Labs", description: "8 state-of-the-art labs with modern equipment", color: "#047857" },
    { label: "Sports Complex", description: "Olympic-size pool, courts, and fields", color: "#059669" },
    { label: "Digital Library", description: "50,000+ books and digital resources", color: "#10b981" },
    { label: "AI & Robotics", description: "Cutting-edge AI/ML research center", color: "#065f46" },
  ];

  return (
    <div className="relative w-full h-[500px] rounded-2xl overflow-hidden bg-gradient-to-b from-slate-900 to-emerald-950">
      <Canvas camera={{ position: [0, 1, 8], fov: 50 }} dpr={[1, 1.5]}>
        <Scene activeFacility={activeFacility} setActiveFacility={setActiveFacility} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {facilities.map((f, i) => (
          <button
            key={i}
            onClick={() => setActiveFacility(i)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeFacility === i
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}