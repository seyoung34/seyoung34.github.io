// App.jsx
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import { pages } from "./pageConfig";

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-[10vh] justify-center items-center flex">
        <Routes>
          {pages.map(({ path, Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
        </Routes>
      </div>
    </Router>
  );
}
