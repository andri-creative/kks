import { Transition } from '@headlessui/react'
import { useState, useRef, useEffect } from "react";
import { FiUser, FiLogOut, FiSettings } from "react-icons/fi";
import { authService } from "@/services/authService";
import { authApi } from "@/features/auth/api/authApi";
import { Link, useNavigate } from "@tanstack/react-router";

export default function UserProfile() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const user = authService.getCurrentUser();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await authApi.logout();
            navigate({ to: "/" });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className="flex items-center gap-2 relative" ref={dropdownRef}>
            <div className="text-right hidden md:block leading-tight select-none">
                <p className="text-[11px] font-bold text-[#492828]">
                    {user.name || "Pengguna"}
                </p>
                <p className="text-[9px] text-[#492828]/50 font-medium capitalize">
                    {user.role || "Guest"}
                </p>
            </div>

            {/* Avatar Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center focus:outline-none p-0! h-9 w-9 relative group cursor-pointer"
            >
                {/* Gradient Border Wrapper */}
                <div
                    className="w-9 h-9 rounded-full bg-linear-to-tr from-[#84934A] to-[#656D3F] p-px shadow-sm transition-transform duration-300 group-hover:scale-105"
                >
                    <div
                        className="bg-white w-full h-full rounded-full p-px flex items-center justify-center overflow-hidden"
                    >
                        <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name || 'Andri'}`}
                            alt="Avatar"
                            className="w-full h-full object-cover rounded-full"
                        />
                    </div>
                </div>
                <span
                    className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-[#84934A] border-2 border-white shadow-sm"
                ></span>
            </button>

            {/* Dropdown Menu */}
            <Transition
                show={isOpen}
                enter="transition duration-300 ease-out"
                enterFrom="transform scale-95 opacity-0 -translate-y-2"
                enterTo="transform scale-100 opacity-100 translate-y-0"
                leave="transition duration-200 ease-in"
                leaveFrom="transform scale-100 opacity-100 translate-y-0"
                leaveTo="transform scale-95 opacity-0 -translate-y-2"
            >
                <div
                    className="absolute right-0 top-11 w-48 bg-white rounded-xl shadow-xl border border-[#ECECEC] z-50 py-1.5 transform origin-top-right overflow-hidden"
                >
                    <div className="px-3 py-2 border-b border-[#ECECEC] mb-1 bg-[#ECECEC]/20">
                        <p className="text-[12px] font-bold text-[#492828] truncate">
                            {user.name || "Pengguna"}
                        </p>
                        <p className="text-[10px] text-[#492828]/50 truncate">
                            {user.username ? `@${user.username}` : "Not logged in"}
                        </p>
                    </div>

                    <div className="px-1.5 space-y-0.5">
                        <Link
                            to="/profile"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2.5 px-2 py-1.5 text-[13px] text-[#492828]/80 rounded-lg hover:bg-[#656D3F]/10 hover:text-[#656D3F] transition-all group/item"
                        >
                            <div
                                className="w-7 h-7 rounded-md bg-[#656D3F]/5 flex items-center justify-center group-hover/item:bg-white transition-colors"
                            >
                                <FiUser className="w-4 h-4 text-[#656D3F]" />
                            </div>
                            <span className="font-medium">Profile</span>
                        </Link>

                        <Link
                            to="/settings"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2.5 px-2 py-1.5 text-[13px] text-[#492828]/80 rounded-lg hover:bg-[#656D3F]/10 hover:text-[#656D3F] transition-all group/item"
                        >
                            <div
                                className="w-7 h-7 rounded-md bg-[#656D3F]/5 flex items-center justify-center group-hover/item:bg-white transition-colors"
                            >
                                <FiSettings className="w-4 h-4 text-[#656D3F]" />
                            </div>
                            <span className="font-medium">Settings</span>
                        </Link>
                    </div>

                    <div className="my-1.5 border-t border-[#ECECEC] mx-2"></div>

                    <div className="px-1.5">
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-2 py-1.5 text-[13px] text-red-500 rounded-lg hover:bg-red-50 transition-all group/item cursor-pointer"
                        >
                            <div
                                className="w-7 h-7 rounded-md bg-red-50 flex items-center justify-center group-hover/item:bg-white transition-colors"
                            >
                                <FiLogOut className="w-4 h-4" />
                            </div>
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </Transition>
        </div>
    );
}

