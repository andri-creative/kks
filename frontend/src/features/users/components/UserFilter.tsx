import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { FiSearch, FiClock, FiChevronDown } from 'react-icons/fi';

interface UserFilterProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    sortBy: string;
    onSortChange: (value: string) => void;
    sortOrder: "asc" | "desc";
    onSortOrderToggle: () => void;
    onClear: () => void;
}

export const UserFilter = ({
    searchQuery,
    onSearchChange,
    sortBy,
    onSortChange,
    sortOrder,
    onSortOrderToggle,
    onClear
}: UserFilterProps) => {
    return (
        <div className="flex items-center gap-4 w-full mb-4">
            {/* Group Search (Main Bar) */}
            <div className="flex flex-1 items-center bg-white border border-gray-200 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-primary/10 focus-within:border-primary/50 transition-all">

                {/* History/Clock Dropdown */}
                <Menu as="div" className="relative">
                    <Menu.Button className="flex items-center gap-1.5 px-3 py-2 text-gray-500 hover:bg-gray-50 border-r border-gray-200 transition-colors outline-none rounded-l-lg">
                        <FiClock className="w-4 h-4" />
                        <FiChevronDown className="w-3 h-3" />
                    </Menu.Button>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute left-0 mt-2 w-72 origin-top-left bg-white rounded-xl shadow-xl ring-1 ring-black/5 focus:outline-none z-50 overflow-hidden">
                            <div className="absolute -top-1 left-4 w-2 h-2 bg-white rotate-45 border-l border-t border-black/5"></div>
                            <div className="px-4 py-3 border-b border-gray-50">
                                <h3 className="text-sm font-bold text-gray-700">Recent searches</h3>
                            </div>
                            <div className="p-6 text-center">
                                <p className="text-sm text-gray-400">You don't have any recent searches</p>
                            </div>
                            <div className="bg-gray-50 p-2 text-right">
                                <button onClick={onClear} className="text-[10px] font-bold text-primary hover:underline px-2 py-1">
                                    CLEAR ALL
                                </button>
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>

                {/* Input Field */}
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Filter or search (3 character minimum)"
                    className="flex-1 px-4 py-2 text-sm outline-none bg-transparent placeholder:text-gray-400"
                />

                {/* Search Icon (Separated by line) */}
                <div className="px-3 py-2 border-l border-gray-200 text-gray-400 bg-gray-50/30">
                    <FiSearch className="w-4 h-4" />
                </div>
            </div>

            {/* Group Sort (Name Bar) */}
            <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="relative">
                    <select
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value)}
                        className="appearance-none bg-transparent pl-4 pr-10 py-2 text-sm font-medium text-gray-600 outline-none cursor-pointer hover:bg-gray-50 transition-colors border-r border-gray-200"
                    >
                        <option value="name">Name</option>
                        <option value="nisn">NISN</option>
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                </div>

                <button
                    onClick={onSortOrderToggle}
                    className={`px-3 py-2 hover:bg-gray-50 transition-all text-gray-500 active:scale-95 ${sortOrder === 'desc' ? 'text-primary' : ''}`}
                >
                    <svg className={`w-4 h-4 transition-transform duration-300 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path>
                    </svg>
                </button>
            </div>
        </div>
    );
};
