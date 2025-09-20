import { useEffect, useRef, useState } from "react";
import "./App.css";

// 랜덤한 속도 생성 함수
const randomVelocity = () => {
  const dx = (Math.random() * 4 + 1) * (Math.random() > 0.5 ? 1 : -1);
  const dy = (Math.random() * 4 + 1) * (Math.random() > 0.5 ? 1 : -1);
  return { dx, dy };
};

function App() {
  const [texts, setTexts] = useState([
    { id: 1, text: "경민아 안녕", x: 100, y: 100, vel: randomVelocity() },
    { id: 2, text: "선우야 안녕", x: 200, y: 150, vel: randomVelocity() },
    { id: 3, text: "근영이 십자인대", x: 50, y: 200, vel: randomVelocity() },
  ]);

  const refs = useRef([]);

  useEffect(() => {
    const move = () => {
      setTexts((prevTexts) =>
        prevTexts.map((item, idx) => {
          const el = refs.current[idx];
          if (!el) return item;

          const rect = el.getBoundingClientRect();
          const screenW = window.innerWidth;
          const screenH = window.innerHeight;

          let { dx, dy } = item.vel;

          let newX = item.x + dx;
          let newY = item.y + dy;

          // 벽 충돌 처리
          if (newX <= 0 || newX + rect.width >= screenW) {
            dx = -dx;
          }
          if (newY <= 0 || newY + rect.height >= screenH) {
            dy = -dy;
          }

          return {
            ...item,
            x:
              newX <= 0
                ? 0
                : newX + rect.width >= screenW
                  ? screenW - rect.width
                  : newX,
            y:
              newY <= 0
                ? 0
                : newY + rect.height >= screenH
                  ? screenH - rect.height
                  : newY,
            vel: { dx, dy },
          };
        })
      );
      requestAnimationFrame(move);
    };

    requestAnimationFrame(move);
  }, []);

  return (
    <div className="App">
      {texts.map((item, idx) => (
        <h1
          key={item.id}
          ref={(el) => (refs.current[idx] = el)}
          style={{
            position: "absolute",
            left: item.x,
            top: item.y,
            userSelect: "none",
            color: "#ff6f61",
          }}
        >
          {item.text}
        </h1>
      ))}
    </div>
  );
}

export default App;
