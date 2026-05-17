interface PaginationProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export const Pagination = ({ 
    totalItems, 
    itemsPerPage, 
    currentPage, 
    onPageChange 
}: PaginationProps) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Jangan tampilkan jika total data <= 14 (sesuai permintaan user)
    if (totalItems <= 14) return null;

    return (
        <div className="flex items-center justify-between px-4 py-6 border-t border-gray-50 mt-4">
            <div className="text-xs text-gray-400 font-medium">
                Showing <span className="text-gray-700">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-gray-700">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="text-gray-700">{totalItems}</span> results
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl border border-gray-100 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => onPageChange(i + 1)}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                            currentPage === i + 1 
                                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                                : 'hover:bg-gray-50 text-gray-500'
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button 
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl border border-gray-100 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
            </div>
        </div>
    );
};
