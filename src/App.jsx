import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [pos, setPos] = useState({ x: 100, y: 100 });
  const [vel, setVel] = useState({ dx: 2, dy: 3 }); // 속도
  const textRef = useRef(null);

  useEffect(() => {
    const move = () => {
      setPos((prev) => {
        const newX = prev.x + vel.dx;
        const newY = prev.y + vel.dy;

        const el = textRef.current;
        const rect = el.getBoundingClientRect();
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;

        let { dx, dy } = vel;

        // 벽 충돌 시 반사
        if (newX <= 0 || newX + rect.width >= screenW) {
          dx = -dx;
        }
        if (newY <= 0 || newY + rect.height >= screenH) {
          dy = -dy;
        }

        setVel({ dx, dy });

        return {
          x: newX <= 0 ? 0 : newX + rect.width >= screenW ? screenW - rect.width : newX,
          y: newY <= 0 ? 0 : newY + rect.height >= screenH ? screenH - rect.height : newY,
        };
      });
      requestAnimationFrame(move);
    };

    requestAnimationFrame(move);
  }, [vel]);

  return (
    <div className="App">
      <h1
        ref={textRef}
        style={{
          position: "absolute",
          left: pos.x,
          top: pos.y,
          userSelect: "none",
          color: "#ff6f61",
        }}
      >
        짜파게티 냠
      </h1>
      <img src="/짜파게티파김치.jpg" alt="짜파게티" />
    </div>
  );
}

export default App;
