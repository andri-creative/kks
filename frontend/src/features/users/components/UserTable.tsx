interface UserTableProps {
    users: any[];
    selectedIds: string[];
    isAllSelected: boolean;
    onToggleSelect: (id: string) => void;
    onToggleAll: () => void;
    onEdit: (user: any) => void;
    onDelete: (id: number, name: string) => void;
}

export const UserTable = ({ users, selectedIds, isAllSelected, onToggleSelect, onToggleAll, onEdit, onDelete }: UserTableProps) => {
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
                        <th className="py-3 px-4 font-semibold border-b border-text-green/30">Status Akun</th>
                        <th className="py-3 px-4 font-semibold border-b border-text-green/30">Status Memilih</th>
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
                                    <div className={`w-1.5 h-1.5 rounded-full ${user.status?.toLowerCase() === 'active' ? 'bg-success' : 'bg-danger'}`}></div>
                                    <span className={`text-[11px] font-bold uppercase ${user.status?.toLowerCase() === 'active' ? 'text-success' : 'text-danger'
                                        }`}>
                                        {user.status}
                                    </span>
                                </div>
                            </td>
                            <td className="py-2.5 px-4 border-y border-gray-50 group-hover:border-primary/20">
                                {(() => {
                                    const vs = user.voting_status || 'belum_memilih';
                                    let badgeColor = "bg-amber-50 text-amber-700 border-amber-200";
                                    let label = "Belum Memilih";
                                    let dotColor = "bg-amber-500";
                                    
                                    if (vs === 'sudah_memilih') {
                                        badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
                                        label = "Sudah Memilih";
                                        dotColor = "bg-emerald-500";
                                    } else if (vs === 'waktu_habis') {
                                        badgeColor = "bg-rose-50 text-rose-700 border-rose-200";
                                        label = "Waktu Habis";
                                        dotColor = "bg-rose-500";
                                    }
                                    
                                    return (
                                        <div className="flex items-center gap-1.5">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${badgeColor}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
                                                {label}
                                            </span>
                                        </div>
                                    );
                                })()}
                            </td>
                            <td className="py-2.5 px-4 rounded-r-2xl border-y border-r border-gray-50 group-hover:border-primary/20 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button onClick={() => onEdit(user)} className="p-1.5 hover:bg-sky-50 rounded-lg transition-colors text-gray-400 hover:text-sky-500" title="Edit Data">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                    </button>
                                    <button onClick={() => onDelete(user.id, user.name)} className="p-1.5 hover:bg-rose-50 rounded-lg transition-colors text-gray-400 hover:text-rose-500" title="Hapus Data">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
