import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Text3D, Environment, Html } from "@react-three/drei";
import { Suspense, useRef, useState, useMemo, useEffect } from "react";
import * as THREE from "three";


function RobotModel({ position, index, minionRefs }) {
    const { scene } = useGLTF("/donny/scene.gltf");
    const minion = useRef();
    const clonedScene = useMemo(() => scene.clone(true), [scene]);

    const [direction, setDirection] = useState(() => ({
        x: Math.random() < 0.5 ? -1 : 1,
        z: Math.random() < 0.5 ? -1 : 1,
    }));

    const speed = 0.1;
    const boundary = 25;
    const minionRadius = 1.8;

    useFrame(() => {
        if (!minion.current) return;

        const pos = minion.current.position;

        // --- 이동 ---
        pos.x += direction.x * speed;
        pos.z += direction.z * speed;

        // --- 벽 반사 ---
        if (pos.x > boundary - minionRadius || pos.x < -boundary + minionRadius)
            setDirection((d) => ({ ...d, x: -d.x }));
        if (pos.z > boundary - minionRadius || pos.z < -boundary + minionRadius)
            setDirection((d) => ({ ...d, z: -d.z }));

        // --- 다른 minion들과 충돌 감지 ---
        minionRefs.current.forEach((other, j) => {
            if (!other || j === index) return;
            const diff = new THREE.Vector3().subVectors(pos, other.position);
            const distance = diff.length();
            const minDistance = minionRadius * 2;

            if (distance < minDistance) {
                // 🟠 충돌 시, 방향 반전
                setDirection((d) => ({ x: -d.x, z: -d.z }));

                // 서로 약간 밀어내기
                const push = diff.normalize().multiplyScalar(0.2);
                pos.add(push);
            }
        });

        // --- 방향에 따라 회전 ---
        const angle = Math.atan2(direction.x, direction.z);
        minion.current.rotation.y = angle;
    });

    useEffect(() => {
        minionRefs.current[index] = minion.current;
        return () => (minionRefs.current[index] = null);
    }, [index]);

    return (
        <primitive
            ref={minion}
            object={clonedScene}
            scale={0.1}
            position={position}
            castShadow
            receiveShadow
        />
    );
}



function TextModel({ position, char }) {
    const textRef = useRef();

    useFrame((state) => {
        const { x, y } = state.pointer;
        const clampedX = THREE.MathUtils.clamp(x, -1, 1);
        const clampedY = THREE.MathUtils.clamp(y, -1, 1);

        // 마우스 기반으로 텍스트 위치 부드럽게 이동
        textRef.current.position.x = position[0] + clampedX * 2;
        textRef.current.position.y = position[1] + clampedY * 2;
    });

    return (
        <Text3D
            ref={textRef}
            font="/BM JUA_Regular.json"
            size={2}
            height={0.4}
            curveSegments={12}
            bevelEnabled
            position={position}
            bevelThickness={0.05}
            bevelSize={0.02}
            bevelOffset={0}
            bevelSegments={3}
        >
            {char}
            <meshStandardMaterial color="hotpink" metalness={0.2} roughness={0.4} />
        </Text3D>
    );
}

function BgmPlayer() {
    return (
        <audio
            src="/bgm/minions_bananasong.mp3"   // ✅ public 폴더 기준 경로
            autoPlay
            loop
            controls={false}            // 🎧 숨기고 싶을 때 false
            id="bgm"
        />
    );
}

export default function ThreeScene() {
    const minionRefs = useRef([]);
    const posList = [
        [-8, 0, 0],
        [0, 0, 0],
        [8, 0, 0],
        [-8, 0, -8],
        [0, 0, -8],
        [8, 0, -8],
    ];

    return (
        <div className="relative w-full h-[90vh] bg-black">
            <BgmPlayer />
            <Canvas shadows camera={{ position: [0, 15, 20], fov: 80 }}>
                <Suspense fallback={null}>
                    <Environment files="/hdrs/horn-koppe_spring_2k.hdr" background />
                </Suspense>

                <axesHelper args={[5]} />
                <ambientLight intensity={0.3} />
                <directionalLight position={[5, 10, 20]} intensity={0.3} castShadow />

                <Suspense fallback={null}>
                    {posList.map((pos, i) => (
                        <RobotModel
                            key={i}
                            position={pos}
                            index={i}
                            minionRefs={minionRefs}
                        />
                    ))}
                </Suspense>

                <Suspense fallback={null}>
                    <TextModel position={[-5, 13, 1]} char="영서야 안뇽" />
                </Suspense>

                <mesh position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[50, 50]} />
                    <meshStandardMaterial />
                </mesh>

                <OrbitControls target={[0, 10, 0]} />
            </Canvas>


        </div>
    );
}
