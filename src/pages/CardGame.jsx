import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture, Environment } from "@react-three/drei";
import * as THREE from "three";
import { easing } from "maath"; // npm install maath

// ✅ 카드 반짝임 효과용 파티클
function ClickParticles({ origin, onComplete }) {
    const ref = useRef();
    const [life, setLife] = useState(1.0);

    // 파티클 초기화
    const positions = useMemo(() => {
        const arr = new Float32Array(100 * 3);
        for (let i = 0; i < 100; i++) {
            arr[i * 3 + 0] = (Math.random() - 0.5) * 1.5;
            arr[i * 3 + 1] = (Math.random() - 0.5) * 1.5;
            arr[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
        }
        return arr;
    }, []);

    useFrame((_, delta) => {
        if (ref.current) {
            setLife((l) => l - delta * 0.8); // 수명감소
            ref.current.material.opacity = Math.max(0, life);
            ref.current.material.size = 0.1 + life * 0.1;
            ref.current.rotation.y += delta * 0.8;
            if (life <= 0 && onComplete) onComplete();
        }
    });

    if (life <= 0) return null;

    return (
        <points ref={ref} position={origin}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial color="#FFD700" size={0.12} transparent opacity={life} />
        </points>
    );
}

// ✅ 카드 컴포넌트
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
    const [hovered, setHovered] = useState(false);
    const [lift, setLift] = useState(0);
    const [glow, setGlow] = useState(0);
    const [particles, setParticles] = useState([]);

    const [frontMap, backMap] = useTexture([front, back]);
    frontMap.encoding = backMap.encoding = THREE.sRGBEncoding;

    const handleClick = (e) => {
        e.stopPropagation();
        const next = !flipped;
        setFlipped(next);
        targetRotation.current = next ? Math.PI : 0;

        // lift + glow + particle trigger
        setLift(1);
        setGlow(1);
        setParticles((prev) => [
            ...prev,
            { id: Math.random(), pos: [...position] },
        ]);
    };

    // Lift + Glow + 회전 부드럽게 처리
    useFrame((_, delta) => {
        if (!group.current) return;

        // 회전
        easing.dampAngle(group.current.rotation, "y", targetRotation.current, 0.15, delta);

        // Lift (위로 0.8 올라갔다 내려오기)
        if (lift > 0) {
            const nextLift = Math.max(0, lift - delta * 1.2);
            setLift(nextLift);
            group.current.position.y = position[1] + Math.sin(nextLift * Math.PI) * 0.8;
        }

        // Glow
        if (glow > 0) {
            const nextGlow = Math.max(0, glow - delta * 1.5);
            setGlow(nextGlow);
        }
    });

    const depth = 0.015;

    return (
        <group
            ref={group}
            position={position}
            onPointerDown={handleClick}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            scale={[1, 1, 1]}
        >
            {/* 앞면 */}
            <mesh position={[0, 0, depth / 2]} castShadow receiveShadow>
                <planeGeometry args={[width, height]} />
                <meshPhysicalMaterial
                    map={frontMap}
                    clearcoat={1}
                    clearcoatRoughness={0.6}
                    metalness={0.1}
                    roughness={0.7}
                    reflectivity={0.3}
                    envMapIntensity={0.5}
                    emissive="#FFD700"
                    emissiveIntensity={glow * 3}
                />
            </mesh>

            {/* 뒷면 */}
            <mesh position={[0, 0, -depth / 2]} rotation={[0, Math.PI, 0]}>
                <planeGeometry args={[width, height]} />
                <meshPhysicalMaterial
                    map={backMap}
                    metalness={0.05}
                    roughness={0.8}
                    color="#f8f8f8"
                />
            </mesh>

            {/* 금빛 테두리 */}
            <lineSegments position={[0, 0, depth / 2 + 0.001]}>
                <edgesGeometry args={[new THREE.PlaneGeometry(width, height)]} />
                <lineBasicMaterial color={hovered ? "#FFD700" : "#aaa"} linewidth={1} />
            </lineSegments>

            {/* 클릭 시 파티클 생성 */}
            {particles.map((p) => (
                <ClickParticles
                    key={p.id}
                    origin={[0, 0, 0]}
                    onComplete={() =>
                        setParticles((prev) => prev.filter((x) => x.id !== p.id))
                    }
                />
            ))}
        </group>
    );
}

// ✅ 씬 전체
export default function CardGame() {
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
            <Canvas shadows camera={{ position: [0, 2.5, 8], fov: 50 }}>
                <color attach="background" args={["#101015"]} />

                <ambientLight intensity={0.3} />
                <directionalLight
                    position={[5, 10, 5]}
                    intensity={1.2}
                    castShadow
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                    shadow-bias={-0.001}
                />
                <spotLight position={[0, 8, 5]} intensity={0.8} angle={0.4} penumbra={1} />

                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]} receiveShadow>
                    <planeGeometry args={[50, 50]} />
                    <meshStandardMaterial color="#222" roughness={0.9} metalness={0.2} />
                </mesh>

                {positions.map((pos, i) => (
                    <Card key={i} position={pos} back={imageList[i % imageList.length]} />
                ))}

                <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2.2} minPolarAngle={Math.PI / 3} />
            </Canvas>

            <div className="absolute bottom-6 w-full text-center text-white font-semibold tracking-wider text-lg opacity-70">
                ✨ Click the Card — It Comes Alive ✨
            </div>
        </div>
    );
}
