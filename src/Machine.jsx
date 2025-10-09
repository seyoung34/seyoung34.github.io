// React 훅 구조 분해
const {
    useState,
    useEffect,
    useRef,
    useCallback,
    forwardRef,
    useImperativeHandle,
} = React;

// 각 슬롯 아이콘 높이(px)
const ICON_HEIGHT = 188;

// 패배 시 출력되는 랜덤 문구
const LOSER_MESSAGES = [
    "Not quite",
    "Stop gambling",
    "Hey, you lost!",
    "Ouch! I felt that",
    "Don't beat yourself up",
    "There goes the college fund",
    "I have a cat. You have a loss",
    "You're awesome at losing",
    "Coding is hard",
    "Don't hate the coder",
];

// ==========================
// 🎮 재시작 버튼
// ==========================
const RepeatButton = ({ onClick }) => (
    <button aria-label="Play again" id="repeatButton" onClick={onClick} />
);

// ==========================
// 🔊 당첨 시 재생되는 효과음
// ==========================
const WinningSound = () => (
    <audio autoPlay className="player" preload="none">
        <source src="https://andyhoffman.codes/random-assets/img/slots/winning_slot.wav" />
    </audio>
);

// ==========================
// 🎞 Spinner 컴포넌트 (릴 1개 담당)
// ==========================
// forwardRef를 사용해 부모가 내부 함수(reset 등)에 접근 가능하게 함
const Spinner = forwardRef(({ onFinish, timer }, ref) => {
    // 회전 애니메이션용 상태
    const [position, setPosition] = useState(0); // 배경의 Y좌표 위치 (아이콘 위치)
    const [timeRemaining, setTimeRemaining] = useState(timer); // 남은 회전 시간(ms)

    // 내부 제어용 ref들
    const timerRef = useRef(); // setInterval 핸들
    const multiplierRef = useRef(Math.floor(Math.random() * (4 - 1) + 1)); // 회전 속도 배수 (1~3)
    const startPositionRef = useRef(
        Math.floor(Math.random() * 9) * ICON_HEIGHT * -1 // 시작 위치를 랜덤하게 설정
    );
    const speedRef = useRef(ICON_HEIGHT * multiplierRef.current); // 한 tick당 이동량(px)

    // ======================================
    // 🔁 reset(): 새 회전 시작 (부모에서 호출 가능)
    // ======================================
    const reset = useCallback(() => {
        // 기존 interval 제거
        if (timerRef.current) clearInterval(timerRef.current);

        // 랜덤 초기값 재설정
        startPositionRef.current = Math.floor(Math.random() * 9) * ICON_HEIGHT * -1;
        multiplierRef.current = Math.floor(Math.random() * (4 - 1) + 1);
        speedRef.current = ICON_HEIGHT * multiplierRef.current;

        setPosition(startPositionRef.current);
        setTimeRemaining(timer);

        // 0.1초마다 tick() 실행
        timerRef.current = setInterval(() => {
            tick();
        }, 100);
    }, [timer]);

    // ======================================
    // 🎯 getSymbolFromPosition()
    // 회전이 끝났을 때 현재 위치의 심볼을 계산
    // ======================================
    const getSymbolFromPosition = useCallback(() => {
        const totalSymbols = 9;
        const maxPosition = ICON_HEIGHT * (totalSymbols - 1) * -1; // 최하단 위치
        const moved = (timer / 100) * multiplierRef.current; // 총 이동 tick 수
        let currentPosition = startPositionRef.current;

        // 이동한 만큼 아이콘 높이만큼 계속 아래로 이동
        for (let i = 0; i < moved; i++) {
            currentPosition -= ICON_HEIGHT;
            if (currentPosition < maxPosition) currentPosition = 0; // 순환
        }

        // 부모에게 최종 위치값 전달 (비동기로 처리)
        setTimeout(() => {
            onFinish(currentPosition);
        }, 0);
    }, [timer, onFinish]);

    // ======================================
    // ⏰ tick(): 한 번의 interval 호출마다 실행
    // ======================================
    const tick = useCallback(() => {
        setTimeRemaining((prev) => {
            // 남은 시간이 0 이하라면 멈춤
            if (prev <= 0) {
                if (timerRef.current) clearInterval(timerRef.current);
                getSymbolFromPosition(); // 최종 결과 계산
                return 0;
            }

            // 아이콘 위치 갱신
            setPosition((prevPosition) => prevPosition - speedRef.current);
            return prev - 100;
        });
    }, [getSymbolFromPosition]);

    // ======================================
    // 🧩 컴포넌트 마운트 시 초기화
    // ======================================
    useEffect(() => {
        reset();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [reset]);

    // ======================================
    // 📡 부모에게 reset 함수를 노출
    // ======================================
    useImperativeHandle(
        ref,
        () => ({
            reset,
        }),
        [reset]
    );

    // ======================================
    // 🎨 렌더링
    // position 값을 backgroundPosition으로 적용해서 “회전” 효과 연출
    // ======================================
    return (
        <div
            style={{ backgroundPosition: `0px ${position}px` }}
            className="icons"
        />
    );
});

Spinner.displayName = "Spinner"; // forwardRef 이름 명시 (React DevTools 디버깅용)

// ==========================
// 🎰 SlotMachine 본체
// ==========================
const SlotMachine = () => {
    const [winner, setWinner] = useState(null); // true=당첨, false=패배, null=대기중
    const [matches, setMatches] = useState([]); // 각 스피너의 최종 위치값 저장
    const [loserMessage, setLoserMessage] = useState(""); // 패배 문구
    const spinnerRefs = useRef([null, null, null]); // 스피너 3개의 ref 저장

    // ▶️ Play 버튼 클릭 → 모든 스피너 reset()
    const handleClick = () => {
        setWinner(null);
        setMatches([]);
        setLoserMessage("");
        spinnerRefs.current.forEach((spinner) => spinner?.reset());
    };

    // 🔚 개별 스피너 종료 시 실행
    const handleFinish = (value) => {
        setMatches((prev) => {
            const updated = [...prev, value];

            // 3개 다 멈추면 결과 판정
            if (updated.length === 3) {
                const allSame = updated.every((v) => v === updated[0]);

                // 즉시 setState를 하면 경고가 나기 때문에 defer 처리
                setTimeout(() => {
                    setWinner(allSame);
                    if (!allSame) {
                        setLoserMessage(
                            LOSER_MESSAGES[Math.floor(Math.random() * LOSER_MESSAGES.length)]
                        );
                    }
                }, 0);
            }

            return updated;
        });
    };

    return (
        <div>
            {/* 당첨 시 효과음 */}
            {winner && <WinningSound />}

            {/* 상태 표시 영역 */}
            <h1 style={{ color: "white" }}>
                <span>
                    {winner === null
                        ? "Waiting…" // 대기중
                        : winner
                            ? "🤑 Pure skill! 🤑" // 당첨
                            : loserMessage} // 패배 메시지
                </span>
            </h1>

            {/* 스피너 3개 */}
            <div className="spinner-container">
                {[1000, 1400, 2200].map((timer, index) => (
                    <Spinner
                        key={index}
                        onFinish={handleFinish}
                        timer={timer}
                        ref={(el) => (spinnerRefs.current[index] = el)}
                    />
                ))}
                <div className="gradient-fade" /> {/* 시각적 하단 fade 효과 */}
            </div>

            {/* 반복 버튼 */}
            {winner !== null && <RepeatButton onClick={handleClick} />}
        </div>
    );
};

// ==========================
// 🎬 DOM에 렌더링 (CodePen 환경)
// ==========================
const rootElement = document.getElementById("root");
if (rootElement) {
    ReactDOM.render(<SlotMachine />, rootElement);
}
