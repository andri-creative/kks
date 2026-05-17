import { FiMenu, FiSearch } from "react-icons/fi";
import UserProfile from "./UserProfile";

interface HeaderProps {
    onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
    return (
        <header className="fixed top-0 left-0 right-0 h-14 flex items-center px-3 justify-between bg-bg2 z-40 border-b border-gray-200/50">
            <div className="flex items-center">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-10 shrink-0">
                        <img src="/logo.webp" alt="logo" className="h-10 w-auto object-contain" />
                    </div>
                </div>

                <button
                    onClick={onMenuClick}
                    className="p-2 mr-1 hover:bg-gray-200 rounded-lg transition-colors lg:hidden text-text-green"
                >
                    <FiMenu className="w-6 h-6" />
                </button>
            </div>


            {/* <!-- Search Bar Area --> */}

            <div className="flex-1 max-w-md mx-4 hidden sm:block">
                <div className="relative flex items-center group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FiSearch className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Cari sesuatu..."
                        className="block w-full pl-10 pr-3 py-1.5 bg-white! border-none! text-sm rounded-full! transition-all outline-none focus:ring-2 focus:ring-primary/20 text-gray-700 shadow-sm"
                    />
                </div>
            </div>

            {/* <!-- Right Section --> */}
            <div className="flex items-center gap-2">
                <button
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors sm:hidden text-[#492828]"
                >
                    <FiSearch className="w-5 h-5" />
                </button>
                <UserProfile />
            </div>
        </header>
    );
}