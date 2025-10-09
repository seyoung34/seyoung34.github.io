import { useState } from "react";

const symbols = [
    { id: 1, img: "/images/ji1.jpg" },
    { id: 2, img: "/images/ji2.jpg" },
    { id: 3, img: "/images/ji3.jpg" },
    { id: 4, img: "/images/ji4.jpg" },
];

export default function SlotMachine() {
    const [reels, setReels] = useState([0, 1, 2]);
    const [isSpinning, setIsSpinning] = useState(false);
    const [leverDown, setLeverDown] = useState(false);
    const [isWinning, setIsWinning] = useState(false);
    const [fallingSymbols, setFallingSymbols] = useState([]);
    const [count, setCount] = useState(0);

    // 🎰 회전 함수
    const spin = () => {
        if (isSpinning) return;

        setIsSpinning(true);
        setIsWinning(false);
        setLeverDown(true);

        // 클릭 시 count 증가
        setCount((prev) => {
            if (prev >= 3) return 0; // 다음 라운드를 위해 5회 후 0으로 리셋
            return prev + 1;
        });

        setTimeout(() => setLeverDown(false), 400); // 손잡이 원위치

        const spinDuration = 2000;
        const interval = setInterval(() => {
            setReels([
                Math.floor(Math.random() * symbols.length),
                Math.floor(Math.random() * symbols.length),
                Math.floor(Math.random() * symbols.length),
            ]);
        }, 100);

        setTimeout(() => {
            clearInterval(interval);

            let final;
            // ✅ 3번째 회전일 때는 무조건 당첨!
            if (count === 3) {
                const luckyIndex = Math.floor(Math.random() * symbols.length);
                final = [luckyIndex, luckyIndex, luckyIndex];
            } else {
                final = [
                    Math.floor(Math.random() * symbols.length),
                    Math.floor(Math.random() * symbols.length),
                    Math.floor(Math.random() * symbols.length),
                ];
            }

            setReels(final);
            setIsSpinning(false);

            if (final.every((v) => v === final[0])) {
                triggerWin(final[0]);
            }
        }, spinDuration);
    };

    // 🎲 당첨 시 주사위 떨어지는 효과
    // 🎲 당첨 시 주사위 떨어지는 효과
    const triggerWin = (symbolIndex) => {
        setIsWinning(true);
        const selected = symbols[symbolIndex].img;

        // 5초 동안 일정 간격으로 파티클 생성
        const duration = 5000; // 5초
        const intervalTime = 100; // 0.2초 간격
        const start = Date.now();

        const interval = setInterval(() => {
            const now = Date.now();
            if (now - start > duration) {
                clearInterval(interval);
                setTimeout(() => setFallingSymbols([]), 3000); // 잔여 파티클 제거
                return;
            }

            // 새 파티클 추가
            setFallingSymbols((prev) => [
                ...prev,
                {
                    id: Math.random().toString(36).substr(2, 9),
                    left: Math.random() * 100,
                    delay: Math.random() * 0.2,
                    img: selected,
                },
            ]);
        }, intervalTime);
    };


    return (
        <div className="relative flex flex-col w-screen h-[90vh] items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
            <div className="flex text-white text-4xl justify-center items-center w-1/2 h-1/6 border-8 rounded-2xl border-red-200 top-10 m-10">
                {count}/3
            </div>

            {/* 슬롯 기계 본체 */}
            <div className="relative bg-gray-700 border-8 border-yellow-400 rounded-3xl p-8 shadow-2xl">
                {/* 릴 */}
                <div className="flex gap-4 bg-black rounded-xl p-4 shadow-inner overflow-hidden">
                    {reels.map((idx, i) => (
                        <div
                            key={i}
                            className={`w-24 h-24 bg-white rounded-lg flex items-center justify-center overflow-hidden ${isSpinning ? "animate-spinReel" : ""
                                }`}
                        >
                            <img
                                src={symbols[idx].img}
                                alt="symbol"
                                className="w-16 h-16 object-contain"
                            />
                        </div>
                    ))}
                </div>

                {/* 손잡이 */}
                <div
                    onClick={spin}
                    className={`absolute top-1/2 right-[-80px] transform -translate-y-1/2 cursor-pointer`}
                >
                    <div
                        className={`w-8 h-40 bg-gray-600 rounded-full transition-transform duration-300 origin-top ${leverDown ? "rotate-30 translate-y-4" : ""
                            }`}
                    ></div>
                    <div
                        className={`w-12 h-12 bg-red-500 rounded-full mx-auto mt-[-10px] border-4 border-yellow-300 ${leverDown ? "translate-y-4" : ""
                            }`}
                    ></div>
                </div>
            </div>

            {/* 당첨 시 이펙트 */}
            {isWinning && (
                <div className="absolute bottom-0 left-0 w-full h-full pointer-events-none">
                    {fallingSymbols.map((s) => (
                        <img
                            key={s.id}
                            src={s.img}
                            alt="symbol"
                            className="absolute w-8 h-8 animate-fall"
                            style={{
                                left: `${s.left}%`,
                                animationDelay: `${s.delay}s`,
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
