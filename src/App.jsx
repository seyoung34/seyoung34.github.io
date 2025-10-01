//App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./Navbar";
import ForJang from "./ForJang";

export default function App() {

  return (
    <Router>
      <Navbar />
      <div className="pt-[10vh] justify-center items-center flex">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/ForJang" element={<ForJang />}></Route>
          {/* <Route path="/JiGame" element={<Sub2 />}></Route> */}
        </Routes>
      </div>

    </Router>
  );
}

function Home() {
  return (
    <div className="flex h-full w-full justify-center items-center">
      <div className="text-[10vh]">안녕하세용</div>
    </div>
  )
}