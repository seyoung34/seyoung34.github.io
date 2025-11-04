// src/components/layout/Navbar.jsx
import { NavLink } from "react-router-dom";
import { pages } from "../../config/pages";

const navigationPages = pages.filter((page) => page.path !== "/");

export default function Navbar() {
  return (
    <nav className="fixed left-0 top-0 z-50 w-full bg-slate-950/80 backdrop-blur shadow-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
        <span className="text-lg font-semibold tracking-tight text-white sm:text-xl">하이용</span>
        <ul className="flex items-center gap-3 text-sm sm:gap-6 sm:text-base">
          {navigationPages.map(({ path, label }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `rounded-full px-3 py-1 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                    isActive
                      ? "bg-sky-500/20 text-sky-200"
                      : "text-slate-200 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
