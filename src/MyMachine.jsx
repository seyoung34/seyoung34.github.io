import React, { useState, useEffect } from "react";

const symbols = [
    { id: 1, img: "/images/ji1.jpg" },
    { id: 2, img: "/images/ji2.jpg" },
    { id: 3, img: "/images/ji3.jpg" },
    { id: 4, img: "/images/ji4.jpg" },
];

const ITEM_HEIGHT = 200;

function Reel({ spinning, stopIndex }) {
    const [position, setPosition] = useState(0);
    const [noTransition, setNoTransition] = useState(false);

    useEffect(() => {
        if (spinning) {
            const interval = setInterval(() => {
                setPosition((prev) => {
                    const next = prev + 10;
                    const limit = symbols.length * ITEM_HEIGHT;

                    // 🔥 부드러운 무한 루프 핵심 로직
                    if (next >= limit) {
                        // 순간적으로 transition 제거 후 위치 리셋
                        setNoTransition(true);
                        return next - limit;
                    }
                    return next;
                });
            }, 20);

            return () => clearInterval(interval);
        } else {
            // 멈출 때는 해당 이미지 위치에 맞게 부드럽게 정렬
            setNoTransition(false);
            setPosition(stopIndex * ITEM_HEIGHT);
        }
    }, [spinning, stopIndex]);

    // transition 동적으로 토글
    const transitionClass = noTransition
        ? ""
        : "transition-transform duration-100 ease-linear";

    return (
        <div className="relative w-48 h-[300px] overflow-hidden bg-black rounded-xl border-4 border-yellow-400">
            <div
                className={`${transitionClass}`}
                style={{
                    transform: `translateY(-${position}px)`,
                }}
                onTransitionEnd={() => {
                    // transition 복귀
                    if (noTransition) setNoTransition(false);
                }}
            >
                {/* 이미지 세트 2배 렌더링 */}
                {[...symbols, ...symbols].map((s, i) => (
                    <div
                        key={i}
                        className="h-[200px] flex justify-center items-center"
                    >
                        <img
                            src={s.img}
                            alt="symbol"
                            className="w-32 h-32 object-cover"
                        />
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

        setTimeout(() => {
            const results = [
                Math.floor(Math.random() * symbols.length),
                Math.floor(Math.random() * symbols.length),
                Math.floor(Math.random() * symbols.length),
            ];
            setStopIndexes(results);
            setSpinning(false);
            setWinner(results.every((v) => v === results[0]));
        }, 5000);
    };

    return (
        <div className="flex flex-col justify-center items-center h-[90vh] bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
            <h1 className="">예원슬롯</h1>
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
