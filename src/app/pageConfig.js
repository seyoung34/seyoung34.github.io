// pageConfig.js
import Home from "../pages/Home";
import ForJang from "../pages/ForJang";
import JiGame from "../pages/JiGame";
import SlotMachine from "../pages/SlotMashine";
import CardGame from "../pages/CardGame";
import LionMap from "../pages/LionMap";

export const pages = [
  { path: "/", label: "Home", Component: Home },
  { path: "/ForJang", label: "ForJang", Component: ForJang },
  { path: "/JiGame", label: "지예원게임", Component: JiGame },
  { path: "/SlotMachine", label: "슬롯머신", Component: SlotMachine },
  { path: "/CardGame", label: "카드 게임", Component: CardGame },
  { path: "/LionMap", label: "사자 장난감", Component: LionMap },
];
