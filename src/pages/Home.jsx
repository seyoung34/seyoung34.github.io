import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, useHelper, Stars, Stats } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useMemo, } from "react";

function Sphere({ position = [0, 0, 0], args = [2, 1] }) {

  const sphereRef = useRef();

  useFrame((_, delta) => {
    sphereRef.current.rotation.y += delta * 0.4;
  })

  return (
    <mesh ref={sphereRef} position={position}>
      <icosahedronGeometry args={args} />
      <meshStandardMaterial
        color="#00ff00"
        metalness={0.4}
        roughness={0.5}
        emissive={"#0000ff"}
        emissiveIntensity={0.3}
        transparent={true}
        opacity={1}
        flatShading={true}
      />
    </mesh>
  );
}

function Satellite({ speed = Math.random() * 1.2 + 0.5 }) {
  const satelliteRef = useRef();
  const radius = Math.random() * 2 + 3;
  const angleOffset = Math.random() * Math.PI * 2; // 각 위성의 시작 각도
  const inclination = Math.random() * Math.PI / 3; // 궤도 기울기
  let lastTime = 0;


  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    const t = elapsed * speed + angleOffset;
    const x = Math.cos(t) * radius;
    const z = Math.sin(t) * radius;
    const y = Math.sin(t) * Math.sin(inclination) * radius;

    satelliteRef.current.position.set(x, y, z);

    if (elapsed - lastTime > 1) {
      // console.log(`elapsed : ${elapsed.toFixed(2)} y : ${y.toFixed(2)}`);
      // lastTime = elapsed;
    }

  });

  console.log(`radius : ${radius.toFixed(2)}, angleOFfset : ${angleOffset.toFixed(2)}, inclination : ${inclination.toFixed(2)}`)

  return (
    <mesh ref={satelliteRef}>
      <Sphere args={[0.6, 1]} />
    </mesh>
  );
}


function FloatingParticles({ count = 300, radius = 40 }) {
  const meshRef = useRef();

  // 파티클 위치 랜덤 생성
  const positions = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const r = Math.random() * radius + 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      arr.push([x, y, z]);
    }
    return arr;
  }, [count, radius]);

  // 회전 애니메이션
  useFrame((_, delta) => {
    meshRef.current.rotation.y += delta * 0.05;
  });

  return (
    <group ref={meshRef}>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos} rotation={[Math.random(), Math.random(), Math.random()]}>
          <tetrahedronGeometry args={[0.15, 0]} />
          <meshStandardMaterial
            color="#aaffff"
            emissive="#66ffff"
            emissiveIntensity={0.8}
            metalness={0.3}
            roughness={0.2}
            flatShading
          />
        </mesh>
      ))}
    </group>
  );
}

function Scene() {
  const pointLight = useRef();
  const dirLight = useRef();

  // ✅ useHelper 훅은 JSX 바깥(컴포넌트 실행 영역)에서 호출해야 함
  useHelper(pointLight, THREE.PointLightHelper, 0.5, "red");
  useHelper(dirLight, THREE.DirectionalLightHelper, 2, "red");

  return (
    <>
      {/* 조명 부분 */}
      <ambientLight intensity={0.3} />
      <directionalLight ref={dirLight} position={[3, 5, 5]} intensity={1.2} />
      <pointLight ref={pointLight} position={[-3, 2, 3]} intensity={1.5} />



      <axesHelper args={[5]} />
      {/* <gridHelper args={[10, 10]} /> */}
    </>
  );
}

export default function Home() {
  return (
    <div className="w-full h-[90vh] bg-black">
      <Canvas camera={{ position: [0, 1, 10], fov: 75 }}>
        <Scene />

        {/* <Stars radius={100} saturation={0.2} speed={0.5} fade /> */}
        <FloatingParticles />

        <Sphere position={[0, 0, 0]} />
        <Satellite />
        <Satellite />
        <Satellite />


        <OrbitControls enableZoom enablePan={true} />
        <Stats />
      </Canvas>
    </div>
  );
}
