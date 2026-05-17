interface UserTableProps {
    users: any[];
    selectedIds: string[];
    isAllSelected: boolean;
    onToggleSelect: (id: string) => void;
    onToggleAll: () => void;
}

export const UserTable = ({ users, selectedIds, isAllSelected, onToggleSelect, onToggleAll }: UserTableProps) => {
    return (
        <div className="overflow-x-auto -mx-2">
            <table className="w-full text-left border-separate border-spacing-y-2">
                <thead>
                    <tr className="text-[11px] text-gray-400 uppercase tracking-widest">
                        <th className="py-3 px-4 font-semibold border-b border-text-green/30">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">No</span>
                                <input
                                    className="appearance-none h-4 w-4 rounded-full border border-gray-300 checked:bg-primary checked:border-transparent focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 cursor-pointer relative checked:after:content-[''] checked:after:absolute checked:after:left-[5px] checked:after:top-[1px] checked:after:w-[4px] checked:after:h-[8px] checked:after:border-r-2 checked:after:border-b-2 checked:after:border-white checked:after:rotate-45"
                                    type="checkbox"
                                    checked={isAllSelected}
                                    onChange={onToggleAll}
                                />

                            </div>
                        </th>
                        <th className="py-3 px-4 font-semibold border-b border-text-green/30">Nama</th>
                        <th className="py-3 px-4 font-semibold border-b border-text-green/30">NISN</th>
                        <th className="py-3 px-4 font-semibold border-b border-text-green/30">Code</th>
                        <th className="py-3 px-4 font-semibold border-b border-text-green/30">Kelas</th>
                        <th className="py-3 px-4 font-semibold border-b border-text-green/30">Status</th>
                        <th className="py-3 px-4 font-semibold border-b border-text-green/30 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody className="space-y-4">
                    {users.map((user, index) => (
                        <tr key={user.id} className="group bg-white hover:bg-bg2/30 transition-all duration-300">
                            <td className="py-2.5 px-4 rounded-l-2xl border-y border-l border-gray-50 group-hover:border-primary/20">
                                <div className="flex items-center gap-2">
                                    <div className="font-bold text-text-green text-sm">{index + 1}</div>
                                    <input 
                                        className="appearance-none h-4 w-4 rounded-full border border-gray-300 checked:bg-primary checked:border-transparent focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 cursor-pointer relative checked:after:content-[''] checked:after:absolute checked:after:left-[5px] checked:after:top-[1px] checked:after:w-[4px] checked:after:h-[8px] checked:after:border-r-2 checked:after:border-b-2 checked:after:border-white checked:after:rotate-45" 
                                        type="checkbox" 
                                        checked={selectedIds.includes(user.id.toString())}
                                        onChange={() => onToggleSelect(user.id)}
                                    />
                                </div>
                            </td>
                            <td className="py-2.5 px-4 border-y border-gray-50 group-hover:border-primary/20">
                                <div className="font-bold text-text-green text-sm">{user.name}</div>
                            </td>
                            <td className="py-2.5 px-4 border-y border-gray-50 group-hover:border-primary/20">
                                <div className="text-sm text-gray-600 font-mono">{user.nisn}</div>
                            </td>
                            <td className="py-2.5 px-4 border-y border-gray-50 group-hover:border-primary/20">
                                <div className="text-sm text-gray-600 font-mono">{user.code}</div>
                            </td>
                            <td className="py-2.5 px-4 border-y border-gray-50 group-hover:border-primary/20">
                                <span className="px-3 py-1 bg-secondary/5 text-secondary rounded-full text-[11px] font-bold">
                                    {user.kelas}
                                </span>
                            </td>
                            <td className="py-2.5 px-4 border-y border-gray-50 group-hover:border-primary/20">
                                <div className="flex items-center gap-1.5">
                                    <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-success' : 'bg-danger'}`}></div>
                                    <span className={`text-[11px] font-bold uppercase ${user.status === 'active' ? 'text-success' : 'text-danger'
                                        }`}>
                                        {user.status}
                                    </span>
                                </div>
                            </td>
                            <td className="py-2.5 px-4 rounded-r-2xl border-y border-r border-gray-50 group-hover:border-primary/20 text-right">
                                <button className="p-2 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-primary">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
