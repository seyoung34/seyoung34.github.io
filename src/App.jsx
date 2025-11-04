// App.jsx
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { pages } from "./pageConfig";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <Routes>
          {pages.map(({ path, Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
        </Routes>
      </div>
    </Router>
  );
}
