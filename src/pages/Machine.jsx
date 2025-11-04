// src/ThreeScene.jsx
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import { Suspense, useMemo } from "react";

function RobotModel({ position }) {
    const { scene } = useGLTF("/donny/scene.gltf");
    const clonedScene = useMemo(() => scene.clone(true), [scene]);

    return (
        <RigidBody
            colliders="ball" // ✅ 구체 collider (충돌체)
            restitution={0.9} // ✅ 탄성 (0~1, 클수록 더 튀김)
            friction={0.5} // ✅ 마찰
            position={position}
            linearDamping={0.2} // 속도 감쇠
            angularDamping={0.2}
        >
            <primitive object={clonedScene} scale={0.1} castShadow receiveShadow />
        </RigidBody>
    );
}

export default function ThreeScene() {
    const positions = [
        [-8, 5, 0],
        [0, 10, 0],
        [8, 15, 0],
        [-5, 20, 5],
    ];

    return (
        <div className="w-full h-[90vh] bg-black relative">
            <Canvas shadows camera={{ position: [0, 15, 25], fov: 75 }}>
                <color attach="background" args={["#111"]} />

                <ambientLight intensity={0.3} />
                <directionalLight position={[5, 10, 20]} intensity={1.2} castShadow />
                <axesHelper args={[5]} />

                <Suspense fallback={null}>
                    {/* ✅ 환경 맵 (HDR 조명) */}
                    <Environment files="/hdrs/horn-koppe_spring_2k.hdr" background />
                </Suspense>

                {/* ✅ 물리엔진 시작 */}
                <Physics gravity={[0, -9.81, 0]}>
                    {/* 🔸 바닥 */}
                    <RigidBody type="fixed" restitution={0.6}>
                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
                            <planeGeometry args={[50, 50]} />
                            <meshStandardMaterial color="#888" />
                        </mesh>
                    </RigidBody>

                    {/* 🔸 벽 4면 (보이지 않지만 충돌 있음) */}
                    <RigidBody type="fixed" restitution={0.6}>
                        {/* 왼쪽 벽 */}
                        <mesh position={[-25, 10, 0]} rotation={[0, Math.PI / 2, 0]}>
                            <boxGeometry args={[50, 20, 0.5]} />
                            <meshBasicMaterial transparent opacity={0} />
                        </mesh>
                        {/* 오른쪽 벽 */}
                        <mesh position={[25, 10, 0]} rotation={[0, -Math.PI / 2, 0]}>
                            <boxGeometry args={[50, 20, 0.5]} />
                            <meshBasicMaterial transparent opacity={0} />
                        </mesh>
                        {/* 앞뒤 벽 */}
                        <mesh position={[0, 10, 25]}>
                            <boxGeometry args={[50, 20, 0.5]} />
                            <meshBasicMaterial transparent opacity={0} />
                        </mesh>
                        <mesh position={[0, 10, -25]}>
                            <boxGeometry args={[50, 20, 0.5]} />
                            <meshBasicMaterial transparent opacity={0} />
                        </mesh>
                    </RigidBody>

                    {/* ✅ 여러 개의 minion */}
                    <Suspense fallback={null}>
                        {positions.map((pos, i) => (
                            <RobotModel key={i} position={pos} />
                        ))}
                    </Suspense>
                </Physics>

                <OrbitControls target={[0, 5, 0]} />
            </Canvas>
        </div>
    );
}
