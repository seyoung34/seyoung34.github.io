import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useRef, useEffect, useState } from 'react';

function Box({
    position = [0, 0, 0],
    size = [1, 1, 1],
    border = true,
    color = "hotpink"
}) {
    const boxRef = useRef();

    useEffect(() => {
        if (border && boxRef.current) {
            boxRef.current.children.forEach((child) => {
                if (child.isLineSegments) boxRef.current.remove(child);
            });

            const edges = new THREE.EdgesGeometry(
                new THREE.BoxGeometry(...size)
            );
            const line = new THREE.LineSegments(
                edges,
                new THREE.LineBasicMaterial({ color: 0xffffff })
            );
            boxRef.current.add(line);
        }
    }, [border, size]);

    return (
        <mesh
            ref={boxRef}
            position={position}
            castShadow
            receiveShadow
            rotation={[0, 0, 0]}
        >
            <boxGeometry args={size} />
            <meshStandardMaterial
                color={color}
                metalness={0.3}
                roughness={0.4}
            />
        </mesh>
    );
}

// ✅ d가 자동으로 바뀌는 컴포넌트
function AnimatedBoxes() {
    const [d, setD] = useState(2);
    const [boxes, setBoxes] = useState([]);

    // 매 프레임마다 d 값을 변경
    const direction = useRef(1);
    const speed = 0.02;

    useFrame(() => {
        setD(prev => {
            let next = prev + speed * direction.current;

            if (next > 4) direction.current = -1; // 확장 → 축소 방향 반전
            if (next < 1) direction.current = 1;  // 축소 → 확장 방향 반전

            return next;
        });
    });

    // d가 바뀔 때마다 boxes 재생성
    useEffect(() => {
        const temp = [];
        for (let x = -d; x <= d; x += d) {
            for (let y = -d; y <= d; y += d) {
                for (let z = -d; z <= d; z += d) {
                    temp.push([x, y, z]);
                }
            }
        }
        setBoxes(temp);
    }, [d]);

    return boxes.map((pos, i) => (
        <Box key={i} position={pos} color={`hsl(${(pos[0] + 2) * 60}, 70%, 60%)`} />
    ));
}

export default function ThreeScene() {
    return (
        <div className="w-full h-[90vh] bg-black">
            <Canvas shadows camera={{ position: [5, 5, 10], fov: 80 }}>
                <color attach="background" args={["#111"]} />
                <axesHelper args={[5]} />

                {/* 바닥 */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]} receiveShadow>
                    <planeGeometry args={[20, 20]} />
                    <meshStandardMaterial color="white" />
                </mesh>

                {/* 조명 */}
                <ambientLight intensity={0.3} />
                <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />

                {/* 박스 그룹 */}
                <AnimatedBoxes />

                <OrbitControls />
            </Canvas>
        </div>
    );
}
