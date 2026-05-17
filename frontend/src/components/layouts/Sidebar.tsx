import { Link, useRouterState } from "@tanstack/react-router";
import { FiChevronLeft, FiChevronRight, FiLayers } from "react-icons/fi";
import { menuOptionsAdmin } from "@/config/menu";

interface SidebarProps {
    collapsed: boolean;
    setCollapsed: (val: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
    const router = useRouterState();
    const currentPath = router.location.pathname;

    const isActive = (path: string) => {
        return currentPath === path;
    };

    return (
        <aside
            className={`bg-bg2 transition-all duration-500 flex flex-col justify-between py-4 h-full z-20 overflow-hidden lg:rounded-none rounded-r-3xl ${collapsed ? 'w-16' : 'w-[240px]'
                }`}
            style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}
        >
            <div className="flex flex-col gap-1 w-full">
                {/* Sidebar Brand */}
                <div className="flex items-center h-10 mb-6 px-3 w-full overflow-hidden">
                    <div
                        className={`bg-primary p-1.5 rounded-full shrink-0 flex items-center justify-center w-10 h-10 transition-transform duration-300 ${collapsed ? 'scale-90' : 'scale-100'
                            }`}
                    >
                        <FiLayers className="text-white w-5 h-5" />
                    </div>

                    <span
                        className={`font-bold text-text-green text-base whitespace-nowrap ml-3 transition-all duration-500 ease-in-out ${collapsed ? 'opacity-0 -translate-x-4 pointer-events-none' : 'opacity-100 translate-x-0'
                            }`}
                    >
                        Andri Dev
                    </span>
                </div>

                {/* Menu Items */}
                <nav className="flex flex-col gap-1.5 px-3">
                    {menuOptionsAdmin.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);

                        if (item.disabled) {
                            return (
                                <div
                                    key={item.key}
                                    className="flex items-center rounded-full opacity-30 cursor-not-allowed text-gray-400 h-10 w-full"
                                >
                                    <div className="shrink-0 flex items-center justify-center w-10 h-10">
                                        <Icon className="w-[20px] h-[20px]" />
                                    </div>
                                    <span
                                        className={`font-medium text-[14px] whitespace-nowrap ml-3 transition-all duration-500 ease-in-out ${collapsed ? 'opacity-0 -translate-x-4 pointer-events-none' : 'opacity-100 translate-x-0'
                                            }`}
                                    >
                                        {item.label}
                                    </span>
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={item.key}
                                to={item.path}
                                className={`flex items-center transition-all duration-300 group relative rounded-full overflow-hidden h-10 w-full ${active
                                    ? 'bg-secondary/10 text-text-green'
                                    : 'text-gray-500 hover:bg-secondary/5 hover:text-secondary'
                                    }`}
                            >
                                <div className="shrink-0 flex items-center justify-center w-10 h-10">
                                    <Icon className="w-[20px] h-[20px]" />
                                </div>

                                <span
                                    className={`font-medium text-[14px] whitespace-nowrap ml-3 transition-all duration-500 ease-in-out ${collapsed ? 'opacity-0 -translate-x-4 pointer-events-none' : 'opacity-100 translate-x-0'
                                        }`}
                                >
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Collapse Button (Hidden on Mobile/Tablet) */}
            <div className="border-t border-gray-200 pt-3 px-3 w-full hidden lg:flex">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="flex items-center rounded-full hover:bg-secondary/5 transition-all duration-300 group text-left outline-none h-10 w-full"
                >
                    <div className="shrink-0 flex items-center justify-center w-10 h-10">
                        {collapsed ? (
                            <FiChevronRight className="w-5 h-5 text-text-green group-hover:text-secondary transition-all duration-300" />
                        ) : (
                            <FiChevronLeft className="w-5 h-5 text-text-green group-hover:text-secondary transition-all duration-300" />
                        )}
                    </div>
                    <span
                        className={`font-medium text-[14px] text-text-green group-hover:text-secondary whitespace-nowrap ml-3 transition-all duration-500 ease-in-out ${collapsed ? 'opacity-0 -translate-x-4 pointer-events-none' : 'opacity-100 translate-x-0'
                            }`}
                    >
                        Collapse Sidebar
                    </span>
                </button>
            </div>
        </aside>
    );
}
