import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

const ParticleField = () => {
  const ref = useRef<THREE.Points>(null);
  const count = 800;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#00d4ff" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
};

const WireframeGlobe = () => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.05;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.15;
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[3, 2]} />
      <meshBasicMaterial color="#00d4ff" wireframe transparent opacity={0.08} />
    </mesh>
  );
};

const FloatingRings = () => {
  const ref1 = useRef<THREE.Mesh>(null);
  const ref2 = useRef<THREE.Mesh>(null);
  const ref3 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref1.current) { ref1.current.rotation.x = t * 0.1; ref1.current.rotation.z = t * 0.05; }
    if (ref2.current) { ref2.current.rotation.y = t * 0.08; ref2.current.rotation.z = -t * 0.03; }
    if (ref3.current) { ref3.current.rotation.x = -t * 0.06; ref3.current.rotation.y = t * 0.04; }
  });

  return (
    <>
      <mesh ref={ref1}>
        <torusGeometry args={[4, 0.02, 16, 100]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.12} />
      </mesh>
      <mesh ref={ref2}>
        <torusGeometry args={[5, 0.015, 16, 100]} />
        <meshBasicMaterial color="#e03030" transparent opacity={0.08} />
      </mesh>
      <mesh ref={ref3}>
        <torusGeometry args={[6, 0.01, 16, 100]} />
        <meshBasicMaterial color="#00ff55" transparent opacity={0.05} />
      </mesh>
    </>
  );
};

// Floating wireframe octahedron
const FloatingOctahedron = () => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.15;
    ref.current.rotation.z = t * 0.1;
    ref.current.position.y = Math.sin(t * 0.3) * 0.5 + 2;
    ref.current.position.x = Math.cos(t * 0.2) * 3;
  });
  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[0.6, 0]} />
      <meshBasicMaterial color="#00d4ff" wireframe transparent opacity={0.15} />
    </mesh>
  );
};

// DNA helix-like structure
const DNAHelix = () => {
  const ref = useRef<THREE.Group>(null);
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i < 40; i++) {
      const t = i * 0.3;
      pts.push([Math.cos(t) * 1.5, t - 6, Math.sin(t) * 1.5]);
      pts.push([-Math.cos(t) * 1.5, t - 6, -Math.sin(t) * 1.5]);
    }
    return pts;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.03;
    ref.current.position.x = -6;
  });

  return (
    <group ref={ref}>
      {points.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshBasicMaterial color={i % 2 === 0 ? "#00d4ff" : "#e03030"} transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
};

// Grid floor
const GridFloor = () => {
  const ref = useRef<THREE.GridHelper>(null);
  useFrame(() => {
    if (ref.current) ref.current.position.z = 0;
  });
  return (
    <gridHelper ref={ref} args={[40, 40, "#00d4ff", "#00d4ff"]} position={[0, -8, 0]} rotation={[0, 0, 0]}>
      <meshBasicMaterial color="#00d4ff" transparent opacity={0.03} />
    </gridHelper>
  );
};

const CyberBackground3D = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`fixed inset-0 z-0 pointer-events-none ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ParticleField />
        <WireframeGlobe />
        <FloatingRings />
        <FloatingOctahedron />
        <DNAHelix />
        <GridFloor />
      </Canvas>
    </div>
  );
};

export default CyberBackground3D;
