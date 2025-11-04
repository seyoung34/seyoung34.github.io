import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useHelper } from "@react-three/drei";
import * as THREE from "three";
import Lion from "../components/Lion";
import Minion from "../components/Minion";

/* ------------------------------------------
   🎛️ 보조 함수
--------------------------------------------- */
export function rule3(v, vmin, vmax, tmin, tmax) {
    const nv = Math.max(Math.min(v, vmax), vmin);
    const pc = (nv - vmin) / (vmax - vmin);
    return tmin + pc * (tmax - tmin);
}

/* ------------------------------------------
   🌬️ Fan Component
--------------------------------------------- */
function Fan({ mouse, isBlowing }) {
    const group = useRef();
    const propeller = useRef();
    const speed = useRef(0);
    const acc = useRef(0);

    useFrame((_, delta) => {
        const xTarget = mouse.current.x;
        const yTarget = mouse.current.y;

        // 위치 매핑 (화면 좌표 → 3D 공간)
        const tPosX = rule3(xTarget, -200, 200, -2, 2);
        const tPosY = rule3(yTarget, -200, 200, 2, -2);

        group.current.position.x += (tPosX - group.current.position.x) * delta * 4;
        group.current.position.y += (tPosY - group.current.position.y) * delta * 4;

        // 4️⃣ 사자(Lion) 바라보기 (y축 기준 회전)
        const lionPosition = new THREE.Vector3(0, 0, 0); // 사자의 중심
        group.current.lookAt(lionPosition);

        // 5️⃣ lookAt 이후, 자연스러운 오차 보정
        // 사자를 보되, 부드러운 회전감 유지
        const targetRotY = Math.atan2(
            lionPosition.x - group.current.position.x,
            lionPosition.z - group.current.position.z
        );
        const targetRotX = rule3(tPosY, -1.5, 1.5, -0.3, 0.3);


        const targetSpeed = isBlowing ? 15 * delta : 5 * delta;
        if (isBlowing && speed.current < targetSpeed) {
            acc.current += 0.01 * delta;
            speed.current += acc.current;
        } else if (!isBlowing) {
            acc.current = 0;
            speed.current *= Math.pow(0.4, delta);
        }

        propeller.current.rotation.z += speed.current;
    });


    return (
        <group ref={group} position={[0, 0, 1]}>
            {/* 본체 */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.2, 0.2, 0.3]} />
                <meshStandardMaterial color="#555" />
            </mesh>

            {/* 중심 구 */}
            <mesh position={[0, 0, 0.2]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial color="#fdd276" />
            </mesh>

            {/* 날개 */}
            <group ref={propeller} position={[0, 0, 0.2]}>
                {[0, Math.PI / 2, Math.PI, -Math.PI / 2].map((rot, i) => (
                    <mesh key={i} rotation={[0, 0, rot]} position={[0, 0, 0]}>
                        <boxGeometry args={[0.08, 0.6, 0.03]} />
                        <meshStandardMaterial color="#ad3525" />
                    </mesh>
                ))}
            </group>
        </group>
    );
}

/* ------------------------------------------
   🌍 메인 Scene
--------------------------------------------- */
export default function LionFanScene() {
    const mouse = useRef({ x: 0, y: 0 });
    const [isBlowing, setIsBlowing] = useState(false);

    const handlePointerMove = (e) => {
        const { width, height } = e.target.getBoundingClientRect();
        mouse.current.x = (e.clientX - width / 2) / 2; // 범위 조정
        mouse.current.y = (e.clientY - height / 2) / 2;
    };

    const handlePointerDown = () => setIsBlowing(true);
    const handlePointerUp = () => setIsBlowing(false);

    return (
        <div className="w-full h-[90vh]">
            <Canvas
                onPointerMove={handlePointerMove}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                shadows
                camera={{ position: [0, 1.5, 5], fov: 60 }}
            >
                <axesHelper />
                <color attach="background" args={["#ebe5e7"]} />
                <ambientLight intensity={0.6} />
                <directionalLight
                    position={[5, 10, 5]}
                    intensity={1}
                    castShadow
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                    shadow-camera-near={0.5}
                    shadow-camera-far={50}
                    shadow-camera-left={-10}
                    shadow-camera-right={10}
                    shadow-camera-top={10}
                    shadow-camera-bottom={-10}
                />

                <OrbitControls enableZoom={true} />



                {/* 바닥 */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
                    <planeGeometry args={[10, 10]} />
                    <meshStandardMaterial color="#d8d3d0" roughness={1} metalness={0} />
                </mesh>

                {/* 사자와 선풍기 */}
                <Lion mouse={mouse} isBlowing={isBlowing} />
                {/* <Minion mouse={mouse} /> */}
                <Fan mouse={mouse} isBlowing={isBlowing} />
            </Canvas>
        </div>
    );
}
