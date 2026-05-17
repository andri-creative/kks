import Header from "@/components/layouts/Header"
import Sidebar from "@/components/layouts/Sidebar"
import { Transition } from "@headlessui/react"
import { useState } from "react"
import { Outlet } from "@tanstack/react-router"
import Breadcrumb from "@/components/layouts/Breadcrumb"

export default function MainLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="fixed inset-0 flex flex-col bg-bg2 font-inter text-[#492828] overflow-hidden">

            {/* Top Header */}
            <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className="flex flex-1 overflow-hidden pt-14 relative">

                {/* Mobile/Tablet Backdrop */}
                <Transition
                    show={isSidebarOpen}
                    enter="transition-opacity duration-300 ease-out"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-300 ease-in"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    ></div>
                </Transition>

                {/* Sidebar */}
                <div
                    className={`fixed inset-y-0 left-0 z-50 lg:relative h-full transition-all duration-500 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                        }`}
                >
                    <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
                </div>


                {/* Main Content Area */}
                <main className="flex-1 flex flex-col min-w-0 pb-4 overflow-hidden">
                    <div className="flex-1 flex flex-col mx-2 lg:mx-4 rounded-3xl! shadow-lg! overflow-hidden bg-white border border-gray-100">
                        {/* Panel Header */}
                        <Breadcrumb />

                        {/* Pane Content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 lg:p-4">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
