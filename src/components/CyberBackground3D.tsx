import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo, memo } from "react";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/use-mobile";

const ParticleField = memo(({ count }: { count: number }) => {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return pos;
  }, [count]);

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
});

const WireframeGlobe = memo(() => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.05;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.15;
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[3, 1]} />
      <meshBasicMaterial color="#00d4ff" wireframe transparent opacity={0.08} />
    </mesh>
  );
});

const FloatingRings = memo(() => {
  const ref1 = useRef<THREE.Mesh>(null);
  const ref2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref1.current) { ref1.current.rotation.x = t * 0.1; ref1.current.rotation.z = t * 0.05; }
    if (ref2.current) { ref2.current.rotation.y = t * 0.08; ref2.current.rotation.z = -t * 0.03; }
  });

  return (
    <>
      <mesh ref={ref1}>
        <torusGeometry args={[4, 0.02, 8, 64]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.12} />
      </mesh>
      <mesh ref={ref2}>
        <torusGeometry args={[5, 0.015, 8, 64]} />
        <meshBasicMaterial color="#e03030" transparent opacity={0.08} />
      </mesh>
    </>
  );
});

const GridFloor = memo(() => (
  <gridHelper args={[40, 20, "#00d4ff", "#00d4ff"]} position={[0, -8, 0]}>
    <meshBasicMaterial color="#00d4ff" transparent opacity={0.03} />
  </gridHelper>
));

const CyberBackground3D = ({ className = "" }: { className?: string }) => {
  const isMobile = useIsMobile();
  const particleCount = isMobile ? 300 : 600;

  return (
    <div className={`fixed inset-0 z-0 pointer-events-none ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
        dpr={isMobile ? [1, 1] : [1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
        frameloop="always"
      >
        <ParticleField count={particleCount} />
        <WireframeGlobe />
        <FloatingRings />
        {!isMobile && <GridFloor />}
      </Canvas>
    </div>
  );
};

export default memo(CyberBackground3D);
