import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

const ParticleField = () => {
  const ref = useRef<THREE.Points>(null);
  const count = 600;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
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

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref1.current) {
      ref1.current.rotation.x = t * 0.1;
      ref1.current.rotation.z = t * 0.05;
    }
    if (ref2.current) {
      ref2.current.rotation.y = t * 0.08;
      ref2.current.rotation.z = -t * 0.03;
    }
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
    </>
  );
};

const CyberBackground3D = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`fixed inset-0 z-0 pointer-events-none ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ParticleField />
        <WireframeGlobe />
        <FloatingRings />
      </Canvas>
    </div>
  );
};

export default CyberBackground3D;
