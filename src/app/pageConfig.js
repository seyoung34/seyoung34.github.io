// pageConfig.js
import Home from "../pages/Home";
import ForJang from "../pages/ForJang";
import JiGame from "../pages/JiGame";
import SlotMachine from "../pages/SlotMashine";
import MyMachine from "../pages/MyMachine";
import Three from "../pages/three";

export const pages = [
  { path: "/", label: "Home", Component: Home },
  { path: "/ForJang", label: "ForJang", Component: ForJang },
  { path: "/JiGame", label: "지예원게임", Component: JiGame },
  { path: "/SlotMachine", label: "슬롯머신", Component: SlotMachine },
  { path: "/MyMachine", label: "머신연습", Component: MyMachine },
  { path: "/Three", label: "Three", Component: Three },
];
