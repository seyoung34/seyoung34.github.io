import React, { useState, useEffect } from "react";

const symbols = [
    { id: 1, img: "/images/ji1.jpg" },
    { id: 2, img: "/images/ji2.jpg" },
    { id: 3, img: "/images/ji3.jpg" },
    { id: 4, img: "/images/ji4.jpg" },
];

function Reel({ spinning, stopIndex }) {
    const [position, setPosition] = useState(0);

    useEffect(() => {
        if (spinning) {
            // 회전 중엔 translateY를 계속 증가시켜 무한 스크롤처럼 보이게
            const interval = setInterval(() => {
                setPosition((prev) => (prev + 10) % (symbols.length * 200));
            }, 20);
            return () => clearInterval(interval);
        } else {
            // 멈출 때는 특정 이미지 위치로 정렬
            setPosition(stopIndex * 200);
        }
    }, [spinning, stopIndex]);

    return (
        <div className="relative w-48 h-[200px] overflow-hidden bg-black rounded-xl border-4 border-yellow-400">
            <div
                className="transition-transform duration-700 ease-out"
                style={{
                    transform: `translateY(-${position}px)`,
                }}
            >
                {/* 위아래로 반복되게 2배 배열 */}
                {[...symbols, ...symbols].map((s, i) => (
                    <div key={i} className="h-[200px] flex justify-center items-center">
                        <img src={s.img} alt="symbol" className="w-32 h-32 object-cover" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function SlotMachine() {
    const [spinning, setSpinning] = useState(false);
    const [stopIndexes, setStopIndexes] = useState([0, 0, 0]);
    const [winner, setWinner] = useState(false);

    const spin = () => {
        if (spinning) return;
        setSpinning(true);
        setWinner(false);

        // 3개의 릴 각각 다른 타이밍으로 멈추기
        setTimeout(() => {
            const results = [
                Math.floor(Math.random() * symbols.length),
                Math.floor(Math.random() * symbols.length),
                Math.floor(Math.random() * symbols.length),
            ];
            setStopIndexes(results);
            setSpinning(false);
            setWinner(results.every((v) => v === results[0]));
        }, 2500);
    };

    return (
        <div className="flex flex-col justify-center items-center h-[90vh] bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
            <div className="flex gap-4 mb-8">
                {stopIndexes.map((idx, i) => (
                    <Reel key={i} spinning={spinning} stopIndex={idx} />
                ))}
            </div>

            <button
                onClick={spin}
                className="px-8 py-3 rounded-lg bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition"
            >
                🎰 SPIN 🎰
            </button>

            {winner && <p className="mt-4 text-green-400 text-2xl">WINNER!! 🎉</p>}
        </div>
    );
}
