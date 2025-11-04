// src/config/pages.js
import Home from "../pages/Home";
import ForJang from "../pages/ForJang";
import JiGame from "../pages/JiGame";
import SlotMachine from "../pages/SlotMachine";
import MyMachine from "../pages/MyMachine";
import Three from "../pages/Three";

export const pages = [
  {
    path: "/",
    label: "Home",
    description: "프로젝트의 모든 인터랙티브 페이지로 이동하는 허브",
    accent: "from-sky-500/30 via-emerald-400/20 to-transparent",
    Component: Home,
  },
  {
    path: "/ForJang",
    label: "ForJang",
    description: "클릭에 따라 전개되는 애니메이션 스토리를 감상해보세요.",
    accent: "from-pink-500/30 via-purple-500/20 to-transparent",
    Component: ForJang,
  },
  {
    path: "/JiGame",
    label: "지예원게임",
    description: "카드를 뒤집어 짝을 찾는 매칭 게임에 도전해보세요.",
    accent: "from-amber-400/30 via-orange-500/20 to-transparent",
    Component: JiGame,
  },
  {
    path: "/SlotMachine",
    label: "슬롯머신",
    description: "파티클 효과와 함께하는 행운의 슬롯머신을 돌려보세요.",
    accent: "from-blue-500/30 via-indigo-500/20 to-transparent",
    Component: SlotMachine,
  },
  {
    path: "/MyMachine",
    label: "머신연습",
    description: "React Three Fiber로 구현한 3D 카드 플립 장면을 탐험하세요.",
    accent: "from-teal-400/30 via-cyan-500/20 to-transparent",
    Component: MyMachine,
  },
  {
    path: "/Three",
    label: "Three",
    description: "GLTF 모델과 음악이 어우러진 3D 미니언 월드를 만나보세요.",
    accent: "from-lime-400/30 via-green-500/20 to-transparent",
    Component: Three,
  },
];
