import * as THREE from "three";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { rule3 } from "./three";


export default function Minion({ mouse }) {
    const group = useRef();
    const eyes = useRef([]);
    const blink = useRef(0);

    useFrame((_, delta) => {

        const x = mouse.current.x;
        const y = mouse.current.y;

        const headRotY = rule3(x, -200, 200, -Math.PI / 4, Math.PI / 4);
        const headRotX = rule3(y, -200, 200, -Math.PI / 6, Math.PI / 6);

        group.current.rotation.y += (headRotY - group.current.rotation.y) * delta * 5;
        group.current.rotation.x += (headRotX - group.current.rotation.x) * delta * 5;


        blink.current += delta * 2;
        const scale = 0.9 + 0.1 * Math.sin(blink.current * 2);
        eyes.current.forEach((e) => {
            if (e) e.scale.y = scale; // 눈 깜박임
        });
    });

    return (
        <group ref={group} scale={0.8}>
            {/* 몸통 */}
            <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[1, 1, 2, 32]} />
                <meshStandardMaterial color="#ffea00" roughness={0.5} />
            </mesh>

            {/* 옷 */}
            <mesh position={[0, -0.5, 0]}>
                <cylinderGeometry args={[1.02, 1.02, 1, 32, 1, true]} />
                <meshStandardMaterial color="#3b6ee0" />
            </mesh>

            {/* 고글 테두리 */}
            {[-0.3, 0.3].map((x, i) => (
                <mesh key={i} position={[x, 0.5, 0.95]}>
                    <torusGeometry args={[0.25, 0.05, 16, 32]} />
                    <meshStandardMaterial color="#7a7a7a" metalness={0.8} />
                </mesh>
            ))}

            {/* 눈 */}
            {[-0.3, 0.3].map((x, i) => (
                <mesh
                    key={i}
                    ref={(el) => (eyes.current[i] = el)}
                    position={[x, 0.5, 0.9]}
                >
                    <sphereGeometry args={[0.2, 16, 16]} />
                    <meshStandardMaterial color="#fff" />
                </mesh>
            ))}

            {/* 홍채 */}
            {[-0.3, 0.3].map((x, i) => (
                <mesh position={[x, 0.5, 1.05]} key={i}>
                    <sphereGeometry args={[0.08, 16, 16]} />
                    <meshStandardMaterial color={i === 0 ? "#8b4513" : "#6b8e23"} />
                </mesh>
            ))}

            {/* 입 */}
            <mesh position={[0, -0.1, 1]}>
                <torusGeometry args={[0.25, 0.05, 8, 16, Math.PI]} />
                <meshStandardMaterial color="#8b0000" />
            </mesh>

            {/* 팔 */}
            {[-1.2, 1.2].map((x, i) => (
                <mesh key={i} position={[x, 0.2, 0]}>
                    <cylinderGeometry args={[0.15, 0.15, 0.8, 12]} />
                    <meshStandardMaterial color="#ffea00" />
                </mesh>
            ))}

            {/* 손 */}
            {[-1.2, 1.2].map((x, i) => (
                <mesh key={i} position={[x, -0.3, 0]}>
                    <sphereGeometry args={[0.2, 16, 16]} />
                    <meshStandardMaterial color="#111" />
                </mesh>
            ))}

            {/* 다리 */}
            {[-0.4, 0.4].map((x, i) => (
                <mesh key={i} position={[x, -1.2, 0]}>
                    <cylinderGeometry args={[0.15, 0.15, 0.8, 12]} />
                    <meshStandardMaterial color="#3b6ee0" />
                </mesh>
            ))}

            {/* 신발 */}
            {[-0.4, 0.4].map((x, i) => (
                <mesh key={i} position={[x, -1.6, 0.1]}>
                    <sphereGeometry args={[0.2, 16, 16]} />
                    <meshStandardMaterial color="#111" />
                </mesh>
            ))}
        </group>
    );
}
