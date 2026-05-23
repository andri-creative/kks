import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { FiX, FiDownload, FiFileText } from 'react-icons/fi';
import { VoteReportPDF } from './VoteReportPDF';
import { type BackendVoteLog } from '../../vote/api/voteApi';

interface CandidateStanding {
    id: number;
    no: number;
    name: string;
    kelas: string;
    votesCount: number;
    percentage: number;
}

interface VoteReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    logs: BackendVoteLog[];
    standings: CandidateStanding[];
    turnoutRate: string;
    votesCount: number;
    totalVotersCount: number;
}

export const VoteReportModal = ({
    isOpen,
    onClose,
    logs,
    standings,
    turnoutRate,
    votesCount,
    totalVotersCount,
}: VoteReportModalProps) => {
    if (!isOpen) return null;

    const now = new Date().toLocaleString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });

    const fileName = `laporan-voting-${new Date().toISOString().slice(0, 10)}.pdf`;

    const pdfProps = {
        logs,
        standings,
        turnoutRate,
        votesCount,
        totalVotersCount,
        generatedAt: now,
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-5xl h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 rounded-lg">
                            <FiFileText className="size-5 text-emerald-600" />
                        </div>
                        <div>
                            <h2 className="text-sm font-black text-slate-800 tracking-tight">Pratinjau Laporan PDF</h2>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                                {logs.length} data pencoblosan · Dicetak: {now}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Download Button */}
                        <PDFDownloadLink
                            document={<VoteReportPDF {...pdfProps} />}
                            fileName={fileName}
                        >
                            {({ loading }) => (
                                <button
                                    type="button"
                                    disabled={loading}
                                    className="px-4 py-2 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all cursor-pointer uppercase tracking-wider inline-flex items-center gap-1.5 active:scale-95 disabled:opacity-60 disabled:cursor-wait"
                                >
                                    <FiDownload className="size-3.5" />
                                    {loading ? 'Menyiapkan...' : 'Unduh PDF'}
                                </button>
                            )}
                        </PDFDownloadLink>

                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all cursor-pointer"
                        >
                            <FiX className="size-5" />
                        </button>
                    </div>
                </div>

                {/* PDF Viewer */}
                <div className="flex-1 overflow-hidden bg-gray-100">
                    <PDFViewer width="100%" height="100%" showToolbar={false}>
                        <VoteReportPDF {...pdfProps} />
                    </PDFViewer>
                </div>
            </div>
        </div>
    );
};
