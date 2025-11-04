// Navbar.jsx
import { Link } from "react-router-dom";
import { pages } from "./pageConfig";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full h-[10vh] bg-gray-900 text-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-full">
        <div className="text-xl font-bold">하이용</div>
        <ul className="flex space-x-6">
          {pages.map(({ path, label }) => (
            <li key={path}>
              <Link to={path} className="hover:text-blue-400">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
