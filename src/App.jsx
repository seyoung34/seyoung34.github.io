// src/App.jsx
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { pages } from "./config/pages";
import Navbar from "./components/layout/Navbar";

const HOME_PATH = "/";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <Routes>
          {pages.map(({ path, Component }) => (
            <Route
              key={path}
              path={path}
              element={
                path === HOME_PATH ? (
                  <Component />
                ) : (
                  <div className="flex min-h-screen flex-col">
                    <Navbar />
                    <div className="flex-1 pt-20 sm:pt-24">
                      <Component />
                    </div>
                  </div>
                )
              }
            />
          ))}
        </Routes>
      </div>
    </Router>
  );
}
