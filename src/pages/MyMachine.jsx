// CardFlipScene.jsx
import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture, Environment, Html } from "@react-three/drei";
import * as THREE from "three";
import { easing } from "maath"; // 매끄러운 회전용 (npm install maath)

function Card({
    front = "/images/마법진.png",
    back = "/images/ji3.jpg",
    width = 2,
    height = 3,
    position = [0, 0, 0],
}) {
    const group = useRef();
    const [flipped, setFlipped] = useState(false);
    const targetRotation = useRef(0);

    const [frontMap, backMap] = useTexture([front, back]);
    frontMap.encoding = backMap.encoding = THREE.sRGBEncoding;

    const handleClick = (e) => {
        e.stopPropagation();
        const next = !flipped;
        setFlipped(next);
        targetRotation.current = next ? Math.PI : 0;
    };

    useFrame((_, delta) => {
        if (!group.current) return;
        const currentY = group.current.rotation.y;
        group.current.rotation.y = THREE.MathUtils.lerp(currentY, targetRotation.current, delta * 6);
    });

    const depth = 0.015;

    return (
        <group ref={group} position={position} onPointerDown={handleClick}>
            {/* 앞면 */}
            <mesh position={[0, 0, depth / 2]} castShadow receiveShadow>
                <planeGeometry args={[width, height]} />
                <meshPhysicalMaterial
                    map={frontMap}
                    clearcoat={1}
                    clearcoatRoughness={0.6}
                    metalness={0.1}
                    roughness={0.75}
                    reflectivity={0.3}
                    envMapIntensity={0.4}
                />
            </mesh>

            {/* 뒷면 */}
            <mesh position={[0, 0, -depth / 2]} rotation={[0, Math.PI, 0]} castShadow >
                <planeGeometry args={[width, height]} />
                <meshPhysicalMaterial
                    map={backMap}
                    clearcoat={1}
                    clearcoatRoughness={0.7}
                    metalness={0.05}
                    roughness={0.8}
                    color="#f8f8f8"
                />
            </mesh>

            {/* 테두리 */}
            <lineSegments position={[0, 0, depth / 2 + 0.001]}>
                <edgesGeometry args={[new THREE.PlaneGeometry(width, height)]} />
                <lineBasicMaterial color="#FFD700" linewidth={1} />
            </lineSegments>
        </group>
    );
}


export default function CardFlipScene() {
    const imageList = ["/images/ji1.jpg", "/images/ji2.jpg", "/images/ji3.jpg", "/images/ji4.jpg"];
    const positions = [
        [-5, 0, 0],
        [0, 0, 0],
        [5, 0, 0],
        [-2.5, 3.5, 0],
        [2.5, 3.5, 0],
    ];

    return (
        <div className="w-full h-[90vh] bg-gradient-to-b from-gray-900 to-black relative">
            <Canvas
                shadows
                camera={{ position: [0, 2.5, 7], fov: 45 }}
                gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, outputEncoding: THREE.sRGBEncoding }}
            >
                <color attach="background" args={["#111"]} />

                <ambientLight intensity={0.3} />
                <directionalLight
                    position={[5, 10, 5]}
                    intensity={1.2}
                    castShadow
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                    shadow-bias={-0.0015}
                />
                <Environment files="/hdrs/horn-koppe_spring_2k.hdr" background={false} />

                {/* 매끄러운 바닥면 */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]} receiveShadow>
                    <planeGeometry args={[50, 50]} />
                    <meshStandardMaterial color="#2b2b2b" roughness={0.9} metalness={0.1} />
                </mesh>

                {positions.map((pos, i) => (
                    <Card key={i} position={pos} back={imageList[i % imageList.length]} />
                ))}

                <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2.2} />
            </Canvas>


            {/* 📄 간단한 제목 UI */}
            <div className="absolute bottom-6 w-full text-center text-white font-semibold tracking-wider text-lg opacity-70">
                ✨ 3D Interactive Card Flip ✨
            </div>
        </div>
    );
}
