//App.jsx
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./Navbar";
import ForJang from "./ForJang";
import JiGame from "./JiGame";
import SlotMachine from "./SlotMashine";
import MyMachine from "./MyMachine";
import Three from "./three";




export default function App() {

  return (
    <Router>
      <Navbar />
      <div className="pt-[10vh] justify-center items-center flex">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/ForJang" element={<ForJang />}></Route>
          <Route path="/JiGame" element={<JiGame />}></Route>
          <Route path="/SlotMachine" element={<SlotMachine />}></Route>
          <Route path="/MyMachine" element={<MyMachine />}></Route>
          <Route path="/Three" element={<Three />}></Route>
        </Routes>
      </div>
    </Router>
  );
} 3

function Home() {
  return (
    <div className="flex flex-col h-full w-full justify-center items-center">
      <h1 className="">기본값 안녕하세요</h1>
      <h1 className="font-title ">title 안녕하세요</h1>
      <h1 className="font-sans ">sans 안녕하세요</h1>
      <h1 className="font-jua ">jua 안녕하세요.</h1>
      <h1 className="">기본 글꼴</h1>
    </div>
  )
}