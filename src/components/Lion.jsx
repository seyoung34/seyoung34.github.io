import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { rule3 } from "../pages/LionMap";



/**
 * Lion Component (React Three Fiber)
 * - FlatShading 기반의 큐브 스타일 사자
 * - 머리, 갈기, 눈, 코, 수염 등 구조 분리
 * - 바람에 따라 갈기가 흔들리는 애니메이션
 */

export default function Lion({ position = [0, 0, 0], mouse, isBlowing }) {
    const group = useRef();
    const maneRefs = useRef([]);
    const windTime = useRef(0);

    // Flat shading 재질 프리셋
    const materials = useMemo(() => ({
        yellow: new THREE.MeshLambertMaterial({ color: 0xfdd276, flatShading: true }),
        red: new THREE.MeshLambertMaterial({ color: 0xad3525, flatShading: true }),
        grey: new THREE.MeshLambertMaterial({ color: 0x653f4c, flatShading: true }),
        purple: new THREE.MeshLambertMaterial({ color: 0x451954, flatShading: true }),
        black: new THREE.MeshLambertMaterial({ color: 0x302925, flatShading: true }),
        white: new THREE.MeshLambertMaterial({ color: 0xffffff, flatShading: true }),
    }), []);

    // 갈기 구성 (4x4)
    const maneParts = useMemo(() => {
        const parts = [];
        for (let j = 0; j < 4; j++) {
            for (let k = 0; k < 4; k++) {
                const x = (j * 0.4) - 0.6;
                const y = (k * 0.4) - 0.6;
                const amp =
                    (j === 0 || j === 3 || k === 0 || k === 3)
                        ? -5 - Math.random() * 3
                        : 0;
                const zOffset =
                    (j === 0 || j === 3 || k === 0 || k === 3) ? -2 : 0;
                const periodOffset = Math.random() * Math.PI * 2;
                parts.push({ x, y, amp, zOffset, periodOffset });
            }
        }
        return parts;
    }, []);

    // 애니메이션
    useFrame((_, delta) => {

        const x = mouse.current.x;
        const y = mouse.current.y;

        const headRotY = rule3(x, -200, 200, -Math.PI / 4, Math.PI / 4);
        const headRotX = rule3(y, -200, 200, -Math.PI / 6, Math.PI / 6);

        group.current.rotation.y += (headRotY - group.current.rotation.y) * delta * 5;
        group.current.rotation.x += (headRotX - group.current.rotation.x) * delta * 5;



        windTime.current += delta * 40;
        maneRefs.current.forEach((m, i) => {
            if (!m) return;
            const { amp, zOffset, periodOffset } = maneParts[i];
            const t = windTime.current + periodOffset;
            const motion = isBlowing ? Math.sin(t) * amp * 3 : 0;
            m.position.z = zOffset + motion;
        });
    });

    return (
        <group ref={group} scale={0.01} position={position} castShadow receiveShadow >
            {/* 몸통 */}
            <mesh castShadow position={[0, -20, -50]} rotation={[0.2, 0, 0]} geometry={new THREE.CylinderGeometry(30, 80, 140, 4)} material={materials.yellow} />

            {/* 앞다리 */}
            <mesh castShadow position={[30, -60, 0]} rotation={[-0.3, 0, 0]} geometry={new THREE.BoxGeometry(25, 80, 35)} material={materials.yellow} />
            <mesh castShadow position={[-30, -60, 0]} rotation={[-0.3, 0, 0]} geometry={new THREE.BoxGeometry(25, 80, 35)} material={materials.yellow} />

            {/* 뒷다리 */}
            <mesh castShadow position={[65, -60, -20]} rotation={[0, 0, -0.3]} geometry={new THREE.BoxGeometry(25, 80, 35)} material={materials.yellow} />
            <mesh castShadow position={[-65, -60, -20]} rotation={[0, 0, 0.3]} geometry={new THREE.BoxGeometry(25, 80, 35)} material={materials.yellow} />

            {/* 발 */}
            <mesh castShadow position={[75, -90, 10]} geometry={new THREE.BoxGeometry(40, 20, 20)} material={materials.yellow} />
            <mesh castShadow position={[-75, -90, 10]} geometry={new THREE.BoxGeometry(40, 20, 20)} material={materials.yellow} />

            <mesh castShadow position={[-22, -85, 40]} geometry={new THREE.BoxGeometry(40, 20, 20)} material={materials.yellow} />
            <mesh castShadow position={[22, -85, 40]} geometry={new THREE.BoxGeometry(40, 20, 20)} material={materials.yellow} />

            {/* 머리 */}
            <group castShadow position={[0, 60, -90]} rotation={[-0.3, 0, 0]}>
                {/* 얼굴 */}
                <mesh castShadow position={[0, 0, 135]} geometry={new THREE.BoxGeometry(80, 80, 80)} material={materials.yellow} />

                {/* 갈기 */}
                <group position={[0, -10, 80]}>
                    {maneParts.map((part, i) => (
                        <mesh
                            key={i}
                            ref={(el) => (maneRefs.current[i] = el)}
                            position={[part.x * 100, part.y * 100, part.zOffset * 100]}
                            geometry={new THREE.BoxGeometry(40, 40, 15)}
                            material={materials.red}
                            castShadow
                        />
                    ))}
                </group>

                {/* 귀 */}
                <mesh castShadow position={[-50, 50, 105]} geometry={new THREE.BoxGeometry(20, 20, 20)} material={materials.yellow} />
                <mesh castShadow position={[50, 50, 105]} geometry={new THREE.BoxGeometry(20, 20, 20)} material={materials.yellow} />

                {/* 코 */}
                <mesh castShadow position={[0, 25, 170]} geometry={new THREE.BoxGeometry(40, 40, 20)} material={materials.grey} />

                {/* 눈 */}
                <group position={[0, 25, 120]}>
                    <mesh castShadow position={[45, 0, 0]} geometry={new THREE.BoxGeometry(10, 30, 30)} material={materials.white} />
                    <mesh castShadow position={[-45, 0, 0]} geometry={new THREE.BoxGeometry(10, 30, 30)} material={materials.white} />
                    {/* 홍채 */}
                    <mesh castShadow position={[50, 0, 0]} geometry={new THREE.BoxGeometry(5, 10, 10)} material={materials.purple} />
                    <mesh castShadow position={[-50, 0, 0]} geometry={new THREE.BoxGeometry(5, 10, 10)} material={materials.purple} />

                </group >
                {/* 입 */}
                <mesh castShadow position={[0, -30, 171]} scale={[0.5, 0.5, 1]} geometry={new THREE.BoxGeometry(20, 20, 10)} material={materials.black} />

                {/* 수염 */}
                {[...Array(6)].map((_, i) => {
                    const side = i < 3 ? 1 : -1;
                    const y = -5 - (i % 3) * 7;
                    const x = side * (30 + (i % 3) * 5);
                    return (
                        <mesh
                            castShadow
                            key={i}
                            position={[x, y, 175]}
                            rotation={[0, 0, side === 1 ? 0 : Math.PI]}
                            geometry={new THREE.BoxGeometry(30, 2, 1)}
                            material={materials.grey}
                        />
                    );
                })}
            </group>
        </group>
    );
}
