// pageConfig.js
import Home from "./Home";
import ForJang from "./ForJang";
import JiGame from "./JiGame";
import SlotMachine from "./SlotMashine";
import MyMachine from "./MyMachine";
import Three from "./three";

export const pages = [
  { path: "/", label: "Home", Component: Home },
  { path: "/ForJang", label: "ForJang", Component: ForJang },
  { path: "/JiGame", label: "지예원게임", Component: JiGame },
  { path: "/SlotMachine", label: "슬롯머신", Component: SlotMachine },
  { path: "/MyMachine", label: "머신연습", Component: MyMachine },
  { path: "/Three", label: "Three", Component: Three },
];
