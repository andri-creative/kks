import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from '@react-pdf/renderer';
import { type BackendVoteLog } from '../../vote/api/voteApi';

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        fontSize: 9,
        color: '#1e293b',
        backgroundColor: '#ffffff',
    },
    // Header
    header: {
        borderBottom: '2pt solid #059669',
        paddingBottom: 12,
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 16,
        fontFamily: 'Helvetica-Bold',
        color: '#059669',
        marginBottom: 3,
    },
    headerSub: {
        fontSize: 8,
        color: '#64748b',
    },
    headerMeta: {
        fontSize: 8,
        color: '#94a3b8',
        marginTop: 2,
    },
    // Stats Row
    statsRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 16,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#f0fdf4',
        borderRadius: 6,
        padding: 10,
        border: '1pt solid #d1fae5',
    },
    statLabel: {
        fontSize: 7,
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 18,
        fontFamily: 'Helvetica-Bold',
        color: '#059669',
    },
    statDesc: {
        fontSize: 7,
        color: '#6b7280',
        marginTop: 2,
    },
    // Standings
    sectionTitle: {
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        color: '#059669',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        borderBottom: '1pt solid #e2e8f0',
        paddingBottom: 5,
        marginBottom: 8,
    },
    standingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        borderBottom: '0.5pt solid #f1f5f9',
    },
    standingRank: {
        width: 20,
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        color: '#94a3b8',
    },
    standingName: {
        flex: 1,
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        color: '#1e293b',
    },
    standingKelas: {
        width: 60,
        fontSize: 8,
        color: '#64748b',
    },
    standingVotes: {
        width: 50,
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        color: '#059669',
        textAlign: 'right',
    },
    standingPct: {
        width: 45,
        fontSize: 8,
        color: '#94a3b8',
        textAlign: 'right',
    },
    // Bar
    barBg: {
        width: 60,
        height: 4,
        backgroundColor: '#e2e8f0',
        borderRadius: 2,
        marginLeft: 8,
    },
    barFill: {
        height: 4,
        backgroundColor: '#059669',
        borderRadius: 2,
    },
    // Table
    tableSection: {
        marginTop: 16,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f8fafc',
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 4,
        marginBottom: 2,
        border: '0.5pt solid #e2e8f0',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 5,
        paddingHorizontal: 8,
        borderBottom: '0.5pt solid #f1f5f9',
    },
    tableRowAlt: {
        backgroundColor: '#fafafa',
    },
    colNo: { width: 24, fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#94a3b8' },
    colName: { flex: 1, fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#1e293b' },
    colNisn: { width: 72, fontSize: 7, color: '#64748b' },
    colKelas: { width: 52, fontSize: 8, color: '#64748b' },
    colCandidate: { width: 90, fontSize: 8, color: '#334155' },
    colTime: { width: 60, fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#059669', textAlign: 'right' },
    colStatus: { width: 36, fontSize: 7, textAlign: 'center', color: '#059669', fontFamily: 'Helvetica-Bold' },
    // Footer
    footer: {
        position: 'absolute',
        bottom: 28,
        left: 40,
        right: 40,
        borderTop: '0.5pt solid #e2e8f0',
        paddingTop: 6,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    footerText: { fontSize: 7, color: '#94a3b8' },
});

const formatDuration = (seconds: number) => {
    if (seconds <= 0) return '0 Detik';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m > 0 && s > 0) return `${m} Menit ${s} Detik`;
    if (m > 0) return `${m} Menit`;
    return `${s} Detik`;
};

interface CandidateStanding {
    id: number;
    no: number;
    name: string;
    kelas: string;
    votesCount: number;
    percentage: number;
}

interface VoteReportPDFProps {
    logs: BackendVoteLog[];
    standings: CandidateStanding[];
    turnoutRate: string;
    votesCount: number;
    totalVotersCount: number;
    generatedAt: string;
}

export const VoteReportPDF = ({
    logs,
    standings,
    turnoutRate,
    votesCount,
    totalVotersCount,
    generatedAt,
}: VoteReportPDFProps) => (
    <Document title="Laporan Hasil Pemungutan Suara" author="Sistem KKS" creator="Admin KKS">
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Laporan Hasil Pemungutan Suara</Text>
                <Text style={styles.headerSub}>Buku Rekapitulasi Suara — Audit Trail Resmi</Text>
                <Text style={styles.headerMeta}>Dicetak: {generatedAt}</Text>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Partisipasi Pemilih</Text>
                    <Text style={styles.statValue}>{turnoutRate}%</Text>
                    <Text style={styles.statDesc}>{votesCount} dari {totalVotersCount} DPT</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Total Suara Masuk</Text>
                    <Text style={styles.statValue}>{votesCount}</Text>
                    <Text style={styles.statDesc}>Surat suara sah tercatat</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Sisa Belum Memilih</Text>
                    <Text style={styles.statValue}>{totalVotersCount - votesCount}</Text>
                    <Text style={styles.statDesc}>Pemilih belum mencoblos</Text>
                </View>
            </View>

            {/* Candidate Standings */}
            <Text style={styles.sectionTitle}>Perolehan Suara Kandidat</Text>
            {standings.map((c, i) => (
                <View key={c.id} style={styles.standingRow}>
                    <Text style={styles.standingRank}>#{i + 1}</Text>
                    <Text style={styles.standingName}>[{c.no}] {c.name}</Text>
                    <Text style={styles.standingKelas}>{c.kelas}</Text>
                    <Text style={styles.standingVotes}>{c.votesCount} Suara</Text>
                    <Text style={styles.standingPct}>{c.percentage.toFixed(1)}%</Text>
                    <View style={styles.barBg}>
                        <View style={{ ...styles.barFill, width: `${Math.min(c.percentage, 100)}%` }} />
                    </View>
                </View>
            ))}

            {/* Audit Trail Table */}
            <View style={styles.tableSection}>
                <Text style={[styles.sectionTitle, { marginTop: 14 }]}>Daftar Log Pencoblosan</Text>

                {/* Table Header */}
                <View style={styles.tableHeader}>
                    <Text style={styles.colNo}>No</Text>
                    <Text style={styles.colName}>Nama Pemilih</Text>
                    <Text style={styles.colNisn}>NISN</Text>
                    <Text style={styles.colKelas}>Kelas</Text>
                    <Text style={styles.colCandidate}>Kandidat Dipilih</Text>
                    <Text style={styles.colTime}>Waktu Coblos</Text>
                    <Text style={styles.colStatus}>Status</Text>
                </View>

                {/* Table Rows */}
                {logs.map((v, index) => (
                    <View key={v.id} style={[styles.tableRow, index % 2 !== 0 ? styles.tableRowAlt : {}]}>
                        <Text style={styles.colNo}>{index + 1}</Text>
                        <Text style={styles.colName}>{v.user?.name || '-'}</Text>
                        <Text style={styles.colNisn}>{v.user?.nisn || '-'}</Text>
                        <Text style={styles.colKelas}>{v.user?.kelas || '-'}</Text>
                        <Text style={styles.colCandidate}>
                            {v.candidate ? `[${v.candidate.no}] ${v.candidate.name}` : 'Terhapus'}
                        </Text>
                        <Text style={styles.colTime}>{formatDuration(v.time_remaining ?? 0)}</Text>
                        <Text style={styles.colStatus}>SAH</Text>
                    </View>
                ))}
            </View>

            {/* Footer */}
            <View style={styles.footer} fixed>
                <Text style={styles.footerText}>Laporan Resmi Pemungutan Suara — Sistem KKS</Text>
                <Text style={styles.footerText} render={({ pageNumber, totalPages }) =>
                    `Halaman ${pageNumber} dari ${totalPages}`
                } />
            </View>
        </Page>
    </Document>
);
