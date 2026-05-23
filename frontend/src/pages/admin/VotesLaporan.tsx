import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { FiArrowLeft } from 'react-icons/fi';
import { Link } from '@tanstack/react-router';
import { VoteReportPDF } from '../../features/resultVote/components/VoteReportPDF';
import { useVoteLogs } from '../../features/vote/hooks/useVoteLogs';
import { useMemo, useState } from 'react';

const LIMIT_OPTIONS = [
    { label: '50 Terbaru', value: 50 },
    { label: '100 Terbaru', value: 100 },
    { label: '200 Terbaru', value: 200 },
    { label: '500 Terbaru', value: 500 },
];

export default function VotesLaporan() {
    const { logs, stats, isLoading } = useVoteLogs();
    const [logLimit, setLogLimit] = useState(50);

    const standings = useMemo(() => stats?.candidates ?? [], [stats]);
    const votesCount = stats?.summary.totalVotesCast ?? 0;
    const totalVotersCount = stats?.summary.totalRegisteredSiswa ?? 0;
    const turnoutRate = stats?.summary.participationPercentage !== undefined
        ? stats.summary.participationPercentage.toFixed(1)
        : '0.0';

    // Ambil N log terbaru (dibalik karena biasanya data terbaru di akhir array)
    const limitedLogs = useMemo(() => {
        return [...logs].reverse().slice(0, logLimit);
    }, [logs, logLimit]);

    const now = new Date().toLocaleString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    });

    const fileName = `laporan-voting-${logLimit}-terbaru-${new Date().toISOString().slice(0, 10)}.pdf`;

    const pdfProps = { logs: limitedLogs, standings, turnoutRate, votesCount, totalVotersCount, generatedAt: now };

    return (
        <div className="flex flex-col h-screen -m-4 lg:-m-6 overflow-hidden">
            {/* Header */}
            <div className="z-30 px-6 py-4 border-b">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl text-text-green font-black tracking-tight">Laporan Hasil Pemungutan Suara</h1>
                        <p className="text-[10px] text-text-green mt-1 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                            Mode Pratinjau Cetak Presisi
                        </p>
                    </div>

                    <div className="flex flex-col items-center bg-gray-50 px-6 py-1.5 rounded-xl border border-gray-100">
                        <span className="text-sm text-text-green font-black tracking-widest uppercase leading-tight">
                            {isLoading ? '...' : `${votesCount} Suara`}
                        </span>
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">
                            dari {totalVotersCount} DPT · {turnoutRate}%
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Pilih jumlah log */}
                        {!isLoading && logs.length > 0 && (
                            <div className="flex flex-col items-start gap-0.5">
                                <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                                    Log di PDF
                                </label>
                                <select
                                    value={logLimit}
                                    onChange={e => setLogLimit(Number(e.target.value))}
                                    className="text-xs font-black text-text-green bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 cursor-pointer outline-none focus:border-text-green"
                                >
                                    {LIMIT_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label} {logs.length < opt.value ? `(maks ${logs.length})` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <Link
                            to="/votes"
                            className="text-text-green hover:text-text-green/50 text-xs font-bold px-4 py-2 transition-colors cursor-pointer hover:bg-button/10 rounded-lg flex items-center gap-1.5"
                        >
                            <FiArrowLeft className="size-3.5" />
                            Kembali
                        </Link>

                        {!isLoading && (
                            <PDFDownloadLink
                                document={<VoteReportPDF {...pdfProps} />}
                                fileName={fileName}
                            >
                                {({ loading }: { loading: boolean }) => (
                                    <button
                                        className={`flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20 active:scale-95 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary/90 cursor-pointer'}`}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                                        </svg>
                                        {loading ? 'Proses...' : 'Download PDF'}
                                    </button>
                                )}
                            </PDFDownloadLink>
                        )}
                    </div>
                </div>
            </div>

            {/* Full Screen PDF Area */}
            <div className="flex-1 relative bg-slate-900">
                {isLoading ? (
                    <div className="h-full flex flex-col items-center justify-center gap-3 text-slate-400">
                        <div className="w-10 h-10 border-4 border-slate-600 border-t-emerald-500 rounded-full animate-spin" />
                        <p className="text-sm font-medium">Memuat data laporan...</p>
                    </div>
                ) : (
                    <PDFViewer
                        width="100%"
                        height="100%"
                        className="border-none"
                        showToolbar={true}
                    >
                        <VoteReportPDF {...pdfProps} />
                    </PDFViewer>
                )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 flex justify-between items-center text-[10px] text-text-green font-medium border-t">
                <div className="flex items-center gap-4">
                    <span>
                        Menampilkan: <strong className="text-text-green">{Math.min(logLimit, logs.length)} log terbaru</strong>
                        {logs.length > logLimit && (
                            <span className="text-gray-400 ml-1">(dari total {logs.length} data)</span>
                        )}
                    </span>
                    <span>Format: <strong className="text-text-green">A4 Portrait</strong></span>
                </div>
                <span>SIMPREIL &bull; Sistem Laporan Otomatis</span>
            </div>
        </div>
    );
}
