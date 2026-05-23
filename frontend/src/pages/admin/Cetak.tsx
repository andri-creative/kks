import React from 'react';
import {
    Document,
    Page,
    View,
    Text,
    StyleSheet,
    PDFViewer,
    PDFDownloadLink,
} from '@react-pdf/renderer';
import { Link, useRouterState } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Image } from '@react-pdf/renderer';
import { useSettings } from '../../features/settings/hooks/useSettings';
import type { SchoolSettings } from '../../features/settings/types';


interface BusinessCardData {
    image: string;
    title: string;
    class: string;
    name: string;
    nis: number;
    code: number;
}

interface BusinessCardProps {
    data: BusinessCardData;
    cardStyles: ReturnType<typeof createStyles>;
}

interface PDFDocumentProps {
    cardsData: BusinessCardData[];
    cols?: 2 | 3;
    rows?: number;
}

// Dimensi A4 dalam poin (satuan react-pdf)
const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;


const createStyles = () => {
    return StyleSheet.create({
        page: {
            backgroundColor: '#FFFFFF',
            // Tidak ada padding — garis potong membentang penuh dari tepi ke tepi
        },
        // Container grid yang mengisi seluruh halaman
        pageGrid: {
            flex: 1,
        },
        // Satu baris kartu
        row: {
            flex: 1,
            flexDirection: 'row' as const,
        },
        // Sel kartu — konten ada di dalam padding, tidak menyentuh garis potong
        cardCell: {
            flex: 1,
            padding: 8,
        },
        // Garis potong horizontal — absolute, membentang penuh ke kiri & kanan halaman
        cutLineH: {
            position: 'absolute' as const,
            left: 0,
            right: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#555555',
            borderBottomStyle: 'dashed' as const,
        },
        // Garis potong vertikal — absolute, membentang dari atas hingga batas baris aktif
        cutLineV: {
            position: 'absolute' as const,
            top: 0,
            borderLeftWidth: 1,
            borderLeftColor: '#555555',
            borderLeftStyle: 'dashed' as const,
        },
        header: {
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            marginBottom: 2,
        },
        logo: {
            width: 20,
            height: 20,
            marginRight: 4,
        },
        name: {
            fontSize: 10,
            fontWeight: 'bold' as const,
            marginBottom: 1,
        },
        title: {
            fontSize: 8,
            color: '#666666',
            marginBottom: 4,
        },
        divider: {
            borderBottomWidth: 1,
            borderBottomColor: '#E0E0E0',
            marginVertical: 4,
        },
        detailsContainer: {
            marginTop: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
        },
        rowName: {
            display: 'flex',
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            justifyContent: 'space-between' as const,
            width: '100%',
            gap: 6
        },
        studentName: {
            fontSize: 9,
            fontWeight: 'bold' as const,
            color: '#000000',
            marginBottom: 8,
            textAlign: 'center' as const,
        },
        detailText: {
            fontSize: 9,
            fontWeight: 'medium' as const,
            color: '#000000',
            marginBottom: 5,
            textAlign: 'center' as const,
        },
    });
};

const BusinessCard: React.FC<BusinessCardProps> = ({ data, cardStyles }) => (
    <View>
        <View style={cardStyles.header}>
            {data.image ? <Image src={data.image} style={cardStyles.logo} /> : null}
            <View style={{ flex: 1 }}>
                <Text style={cardStyles.name}>{data.title || ''}</Text>
                <Text style={cardStyles.title}>{data.class || ''}</Text>
            </View>
        </View>
        <View style={cardStyles.divider} />
        <View style={cardStyles.detailsContainer}>
            <Text style={cardStyles.studentName}>{data.name || ''}</Text>
            <View style={cardStyles.rowName}>
                <Text style={cardStyles.detailText}>NISN</Text>
                <Text style={[cardStyles.detailText, { letterSpacing: 1 }]}>
                    {data.nis ? String(data.nis) : ''}
                </Text>
            </View>
            <View style={cardStyles.rowName}>
                <Text style={cardStyles.detailText}>Kode Akses</Text>
                <Text style={[cardStyles.detailText, { letterSpacing: 1, fontWeight: 'bold' }]}>
                    {data.code ? String(data.code) : ''}
                </Text>
            </View>
        </View>
    </View>
);

const BusinessCardsPDF: React.FC<PDFDocumentProps> = ({
    cardsData,
    cols = 2,
    rows = 5
}) => {
    const styles = createStyles();

    // Kelompokkan kartu menjadi array per halaman
    const cardsPerPage = cols * rows;
    const pagesData: BusinessCardData[][] = [];

    if (cardsData.length === 0) {
        pagesData.push([]);
    } else {
        for (let i = 0; i < cardsData.length; i += cardsPerPage) {
            pagesData.push(cardsData.slice(i, i + cardsPerPage));
        }
    }

    // Hitung posisi garis potong vertikal
    const verticalCutPositions = [
        1,                        // garis tepi KIRI
        ...Array.from(
            { length: cols - 1 },
            (_, i) => A4_WIDTH * ((i + 1) / cols)  // garis antar kolom
        ),
        A4_WIDTH - 1,             // garis tepi KANAN
    ];

    return (
        <Document>
            {pagesData.map((pageCards, pageIndex) => {
                // Tentukan jumlah baris aktif pada halaman ini
                const activeRowsCount = pageCards.length > 0 ? Math.ceil(pageCards.length / cols) : 0;
                const activeHeight = A4_HEIGHT * (activeRowsCount / rows);

                // Hitung posisi garis potong horizontal (antar baris aktif)
                const horizontalCutPositions = Array.from(
                    { length: activeRowsCount },
                    (_, i) => A4_HEIGHT * ((i + 1) / rows)
                ).filter(y => y < A4_HEIGHT - 1);

                // Buat struktur baris & kolom yang lengkap agar ukuran sel tetap konsisten
                const gridRows: (BusinessCardData | null)[][] = [];
                for (let r = 0; r < rows; r++) {
                    const rowCells: (BusinessCardData | null)[] = [];
                    for (let c = 0; c < cols; c++) {
                        const cardIndex = r * cols + c;
                        if (cardIndex < pageCards.length) {
                            rowCells.push(pageCards[cardIndex]);
                        } else {
                            rowCells.push(null);
                        }
                    }
                    gridRows.push(rowCells);
                }

                return (
                    <Page key={pageIndex} size="A4" style={styles.page}>
                        {/* ===== GARIS POTONG VERTIKAL — Hanya digambar sepanjang baris aktif ===== */}
                        {activeRowsCount > 0 && verticalCutPositions.map((x, i) => (
                            <React.Fragment key={`v${i}`}>
                                <View style={[styles.cutLineV, { left: x - 2, height: activeHeight }]} />
                                <View style={[styles.cutLineV, { left: x + 2, height: activeHeight }]} />
                            </React.Fragment>
                        ))}

                        {/* ===== GARIS POTONG HORIZONTAL — Hanya digambar di antara baris aktif ===== */}
                        {activeRowsCount > 0 && horizontalCutPositions.map((y, i) => (
                            <React.Fragment key={`h${i}`}>
                                <View style={[styles.cutLineH, { top: y - 2 }]} />
                                <View style={[styles.cutLineH, { top: y + 2 }]} />
                            </React.Fragment>
                        ))}

                        {/* ===== GRID KARTU ===== */}
                        <View style={styles.pageGrid}>
                            {gridRows.map((rowCards, rowIndex) => (
                                <View key={rowIndex} style={styles.row}>
                                    {rowCards.map((card, colIndex) => (
                                        <View key={colIndex} style={styles.cardCell}>
                                            {card && card.name ? (
                                                <BusinessCard data={card} cardStyles={styles} />
                                            ) : null}
                                        </View>
                                    ))}
                                </View>
                            ))}
                        </View>
                    </Page>
                );
            })}
        </Document>
    );
};

// Generate data sample berdasarkan data riil yang ada
const generateSampleData = (count: number, users: any[], settings: SchoolSettings): BusinessCardData[] => {
    const actualCount = Math.min(count, users.length);
    
    // Proxy external image URLs through our backend to bypass CORS
    let logoUrl = settings.schoolLogo || 'https://placehold.co/100';
    if (logoUrl.startsWith('http')) {
        logoUrl = `http://localhost:37900/v1/api/proxy-image?url=${encodeURIComponent(logoUrl)}`;
    }

    return Array(actualCount).fill(null).map((_, index): BusinessCardData => ({
        image: logoUrl,
        title: `KARTU AKSES PEMILIH ${settings.organizationName.toUpperCase()}`,
        class: `${users[index]?.kelas || ''} | ${settings.schoolAcronym}`,
        name: users[index]?.name || '',
        nis: users[index]?.nisn || 0,
        code: users[index]?.code || 0,
    }));
};

export default function Cetak() {
    const { settings, isLoading } = useSettings();
    const search = useRouterState().location.search as { names?: string; count?: number; kelas?: string };
    const [usersData, setUsersData] = useState<any[]>([]);

    useEffect(() => {
        const storedUsers = localStorage.getItem('cetakUsers');
        if (storedUsers) {
            try {
                const parsedUsers = JSON.parse(storedUsers);
                setUsersData(parsedUsers);
            } catch (error) {
                console.error("Gagal memparsing JSON data siswa:", error);
            }
        }
    }, []);

    const layout = { cols: 3 as 3, rows: 8 };
    const totalCards = layout.cols * layout.rows;
    const cardsData = generateSampleData(usersData.length, usersData, settings);

    // Fungsi untuk mendeteksi apakah kelas campuran
    const getKelasLabel = () => {
        if (!usersData || usersData.length === 0) return 'Belum Ada Kelas';
        const classes = [...new Set(usersData.map(u => u.kelas?.trim()).filter(Boolean))];
        if (classes.length === 0) return 'Belum Ada Kelas';
        if (classes.length === 1) return classes[0];

        // Cek apakah tingkatannya sama (misal sama-sama kelas X, XI, atau XII)
        const levels = [...new Set(classes.map(c => c.split(' ')[0]))];
        if (levels.length === 1) {
            return `${levels[0]} (Campuran)`;
        }

        return 'Campuran';
    };

    console.log(usersData);

    // Gunakan tanda tanya (?.) agar tidak error jika array kosong
    console.log('Nama :', usersData[0]?.name);
    console.log('Kelas :', usersData[0]?.kelas);
    console.log('NISN :', usersData[0]?.nisn);
    console.log('Code :', usersData[0]?.code);

    return (
        <div className="flex flex-col h-screen -m-4 lg:-m-6 overflow-hidden ">
            {/* Title Section (Sticky & Dark Mode Style) */}
            <div className="z-30  px-6 py-4 border-b">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl text-text-green font-black tracking-tight">Cetak Kartu Pemilih</h1>
                        <p className="text-[10px] text-text-green mt-1 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                            Mode Pratinjau Cetak Presisi
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center bg-gray-50 px-6 py-1.5 rounded-xl border border-gray-100">
                            <span className="text-sm text-text-green font-black tracking-widest uppercase leading-tight">
                                {getKelasLabel()}
                            </span>
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">
                                Total: {usersData.length || totalCards} Pemilih
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            to="/users"
                            className="text-text-green hover:text-text-green/50 text-xs font-bold px-4 py-2 transition-colors cursor-pointer hover:bg-button/10 rounded-lg"
                        >
                            Kembali
                        </Link>
                        {!isLoading && (
                            <PDFDownloadLink
                                document={
                                    <BusinessCardsPDF
                                        cardsData={cardsData}
                                        cols={layout.cols}
                                        rows={layout.rows}
                                    />
                                }
                                fileName={`kartu-pemilih-${search.kelas || 'cetak'}.pdf`}
                            >
                                {({ loading }: { loading: boolean }) => (
                                    <button className={`flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20 active:scale-95 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary/90 cursor-pointer'}`}>
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
                        <p className="text-sm font-medium">Memuat data dan logo sekolah...</p>
                    </div>
                ) : (
                    <PDFViewer
                        width="100%"
                        height="100%"
                        className="border-none"
                        showToolbar={true}
                    >
                        <BusinessCardsPDF
                            cardsData={cardsData}
                            cols={layout.cols}
                            rows={layout.rows}
                        />
                    </PDFViewer>
                )}
            </div>

            {/* Dark Footer */}
            <div className=" px-6 py-3 flex justify-between items-center text-[10px] text-text-green font-medium border-t">
                <div className="flex items-center gap-4">
                    <span>Layout: <strong className="text-text-green">{layout.cols}x{layout.rows}</strong></span>
                    <span>Format: <strong className="text-text-green">A4 Portrait</strong></span>
                </div>
                <span>SIMPREIL &bull; Sistem Cetak Otomatis</span>
            </div>
        </div>
    );
}
