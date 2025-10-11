// Navbar.jsx
import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 w-full h-[10vh] bg-gray-900 text-white shadow-md z-50">
            <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-full">
                <div className="text-xl font-bold">하이용</div>
                <ul className="flex space-x-6">
                    <li><Link to="/" className="hover:text-blue-400">Home</Link></li>
                    <li><Link to="/ForJang" className="hover:text-blue-400">ForJang</Link></li>
                    <li><Link to="/JiGame" className="hover:text-blue-400">지예원게임</Link></li>
                    <li><Link to="/SlotMachine" className="hover:text-blue-400">슬롯머신</Link></li>
                    <li><Link to="/MyMachine" className="hover:text-blue-400">머신연습</Link></li>
                    <li><Link to="/Machine" className="hover:text-blue-400">머신</Link></li>
                </ul>
            </div>
        </nav>
    );
}
