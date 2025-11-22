// JiGame.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const images = ["../images/ji1.jpg", "../images/ji2.jpg", "../images/ji3.jpg", "../images/ji4.jpg"];

// 카드 데이터 초기화 (8장: 4종 × 2장)
const shuffleCards = () => {
    const cards = [];
    images.forEach((img, idx) => {
        for (let i = 0; i < 2; i++) {
            cards.push({ id: idx * 2 + i, img, matched: false });
        }
    });
    return cards.sort(() => Math.random() - 0.5);
};

export default function JiGame() {
    const [cards, setCards] = useState(shuffleCards());
    const [flipped, setFlipped] = useState([]);
    const [disableClick, setDisableClick] = useState(false);

    const handleFlip = (card) => {
        if (disableClick || card.matched || flipped.includes(card.id)) return;
        setFlipped((prev) => [...prev, card.id]);
    };

    useEffect(() => {
        if (flipped.length === 2) {
            setDisableClick(true);
            const [first, second] = flipped.map((id) =>
                cards.find((c) => c.id === id)
            );
            if (first.img === second.img) {
                setCards((prev) =>
                    prev.map((c) =>
                        c.id === first.id || c.id === second.id
                            ? { ...c, matched: true }
                            : c
                    )
                );
            }
            setTimeout(() => {
                setFlipped([]);
                setDisableClick(false);
            }, 700);
        }
    }, [flipped, cards]);

    const isCleared = cards.every((c) => c.matched);

    function makeClear() {
        setCards((prev) =>
            prev.map((c) => ({
                ...c,          // 기존 속성 유지
                matched: true, // matched만 true로 변경
            }))
        );
    }


    return (
        <div className="h-[90vh] w-full flex flex-col justify-center items-center bg-gradient-to-br from-blue-200 to-indigo-300 p-4">
            <h1 className="text-3xl font-bold mb-6" onClick={makeClear}>초미녀를 찾아라</h1>

            {/* PC: 4x2 / 모바일: 2x4 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-4xl">
                {cards.map((card) => {
                    const isFlipped = flipped.includes(card.id) || card.matched;
                    return (
                        <motion.div
                            key={card.id}
                            className="relative w-full aspect-square cursor-pointer"
                            onClick={() => handleFlip(card)}
                        >
                            <motion.div
                                className="absolute inset-0 flex items-center justify-center bg-white rounded-lg shadow-lg"
                                animate={{ rotateY: isFlipped ? 180 : 0 }}
                                transition={{ duration: 0.6 }}
                                style={{
                                    transformStyle: "preserve-3d",
                                }}
                            >
                                {/* 앞면 */}
                                <div
                                    className="absolute inset-0 flex items-center justify-center text-xl sm:text-2xl bg-white rounded-lg shadow-lg"
                                    style={{ backfaceVisibility: "hidden" }}
                                >
                                    초미녀
                                </div>

                                {/* 뒷면 */}
                                <div
                                    className="absolute inset-0 flex items-center justify-center bg-yellow-200 rounded-lg shadow-lg"
                                    style={{
                                        transform: "rotateY(180deg)",
                                        backfaceVisibility: "hidden",
                                    }}
                                >
                                    <img
                                        src={card.img}
                                        alt="card"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>
                            </motion.div>
                        </motion.div>
                    );
                })}
            </div>

            {/* ✅ 클리어 다이어그램 */}
            {isCleared && (
                <motion.div
                    className="absolute inset-0 flex flex-col justify-center items-center bg-black/60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        className="flex flex-col items-center"
                    >
                        {/* ✅ 클리어 이미지 */}
                        <img
                            src="/images/clear.jpg"
                            alt="clear"
                            className="w-40 h-40 object-cover rounded-full shadow-xl"
                        />
                        <div className="text-white text-3xl font-bold mt-4">다 맞췄띠</div>
                    </motion.div>

                    <button
                        onClick={() => setCards(shuffleCards())}
                        className="mt-6 px-6 py-2 bg-white rounded-lg shadow hover:bg-gray-200"
                    >
                        다시하기
                    </button>
                </motion.div>
            )}
        </div>


    );
}
