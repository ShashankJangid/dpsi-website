import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Float, RoundedBox, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ChevronRight } from "lucide-react";

const facilityData = [
  {
    id: "ai",
    label: "AI & Robotics Lab",
    description: "Next-gen AI research center with humanoid robotics, 3D printing, and holographic workstations.",
    color: "#10b981",
    accent: "#34d399",
    image: "/images/facilities/ai_robotics_lab.webp",
    geometry: "torusKnot"
  },

  {
    id: "smart",
    label: "Next-Gen Smart Classrooms",
    description: "Interactive learning environments equipped with AR/VR pods and curved glass touchboards.",
    color: "#047857",
    accent: "#a7f3d0",
    image: "/images/facilities/smart_classroom.webp",
    geometry: "icosahedron"
  },
  {
    id: "aquatic",
    label: "Sports & Aquatic Complex",
    description: "Olympic-standard swimming arena, multi-sport indoor courts, and FIFA-standard turf fields.",
    color: "#065f46",
    accent: "#f59e0b",
    image: "/images/facilities/swimming_pool.webp",
    geometry: "dodecahedron"
  }
];

const FacilityMesh = ({
  facility,
  position,
  isActive,
  onClick
}: {
  facility: typeof facilityData[0];
  position: [number, number, number];
  isActive: boolean;
  onClick: () => void;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const geomRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
      meshRef.current.scale.lerp(
        new THREE.Vector3(
          isActive ? 1.25 : hovered ? 1.1 : 1,
          isActive ? 1.25 : hovered ? 1.1 : 1,
          isActive ? 1.25 : hovered ? 1.1 : 1
        ),
        0.1
      );
    }
    if (geomRef.current) {
      geomRef.current.rotation.x += delta * 0.5;
      geomRef.current.rotation.z += delta * 0.3;
    }
  });

  return (
    <group position={position}>
      <Float speed={isActive ? 3 : 1.5} floatIntensity={isActive ? 0.4 : 0.15}>
        <RoundedBox
          ref={meshRef}
          args={[2.2, 2.8, 0.25]}
          radius={0.15}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <meshPhysicalMaterial
            color={facility.color}
            roughness={0.2}
            metalness={0.8}
            transmission={0.4}
            thickness={0.5}
            emissive={isActive || hovered ? facility.accent : "#000000"}
            emissiveIntensity={isActive ? 0.6 : hovered ? 0.3 : 0.05}
          />
        </RoundedBox>

        <mesh ref={geomRef} position={[0, 0.5, 0.25]}>
          {facility.geometry === "torusKnot" && <torusKnotGeometry args={[0.3, 0.1, 64, 16]} />}
          {facility.geometry === "octahedron" && <octahedronGeometry args={[0.38]} />}
          {facility.geometry === "icosahedron" && <icosahedronGeometry args={[0.38]} />}
          {facility.geometry === "dodecahedron" && <dodecahedronGeometry args={[0.38]} />}
          <meshStandardMaterial color={facility.accent} emissive={facility.accent} emissiveIntensity={0.8} wireframe />
        </mesh>

        <Text
          position={[0, -0.4, 0.2]}
          fontSize={0.2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {facility.label}
        </Text>
      </Float>
    </group>
  );
};

const Scene = ({ activeIndex, setActiveIndex }: { activeIndex: number; setActiveIndex: (i: number) => void }) => {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-10, 5, -5]} intensity={1} color="#10b981" />
      <pointLight position={[10, -5, 5]} intensity={1} color="#f59e0b" />
      <Sparkles count={120} scale={10} size={3} speed={0.4} color="#34d399" />

      {facilityData.map((f, i) => (
        <FacilityMesh
          key={f.id}
          facility={f}
          position={[(i - 1.5) * 2.7, 0, 0]}
          isActive={activeIndex === i}
          onClick={() => setActiveIndex(i)}
        />
      ))}
    </>
  );
};

export default function Facilities3D() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [webglError, setWebglError] = useState(false);
  const active = facilityData[activeIndex];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-slate-950 border border-emerald-500/30 shadow-2xl shadow-emerald-950/40">
      <div className="relative h-[480px]">
        {!webglError ? (
          <Canvas
            camera={{ position: [0, 1.2, 8.5], fov: 48 }}
            dpr={[1, 1.5]}
            gl={{
              powerPreference: "high-performance",
              antialias: true,
              alpha: true,
            }}
            onCreated={({ gl }) => {
              gl.domElement.addEventListener(
                "webglcontextlost",
                (event) => {
                  event.preventDefault();
                  console.warn("WebGL Context Lost on Facilities preview. Restoring gracefully.");
                },
                false
              );
            }}
          >
            <Scene activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
            <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 3} />
          </Canvas>
        ) : (
          <div className="w-full h-full flex items-center justify-center p-8 text-center bg-slate-900/90">
            <div className="max-w-md space-y-3">
              <h3 className="text-xl font-bold text-white">{active.label}</h3>
              <p className="text-sm text-slate-300">{active.description}</p>
              <img src={active.image} alt={active.label} className="w-full h-48 object-cover rounded-xl mt-4" />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="absolute top-6 left-6 max-w-sm p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-emerald-500/30 shadow-2xl text-white pointer-events-none hidden sm:block"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">
              <span>DPS Indirapuram Innovation</span>
            </div>
            <h3 className="text-xl font-black text-white mb-2">{active.label}</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">{active.description}</p>
            <div className="h-32 w-full rounded-xl overflow-hidden border border-white/10">
              <img src={active.image} alt={active.label} className="w-full h-full object-cover" />
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 px-4 flex-wrap z-10">
          {facilityData.map((f, i) => (
            <button
              key={f.id}
              onClick={() => setActiveIndex(i)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 ${
                activeIndex === i
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl shadow-emerald-600/40 scale-105"
                  : "bg-slate-900/80 text-slate-300 border border-slate-700/60 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>{f.label}</span>
              <ChevronRight className="w-3 h-3 opacity-60" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}