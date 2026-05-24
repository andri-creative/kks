import { useMemo } from 'react';
import { FiTrendingUp } from 'react-icons/fi';
import { useVoteLogs } from '../../features/vote/hooks/useVoteLogs';

// Import Modular Dashboard Components from Features Folder
import KpiStats from '../../features/dashboard/KpiStats';
import AnalyticsCharts from '../../features/dashboard/AnalyticsCharts';
import RecentVotesTable from '../../features/dashboard/RecentVotesTable';

// Structure of simulated Vote Record (consistent with Votes.tsx)
interface VoteRecord {
    id: string;
    voterName: string;
    voterNisn: string;
    voterKelas: string;
    candidateName: string;
    candidateImage: string;
    timestamp: string;
}

export default function AdminHome() {
    const { logs, stats, isLoading, error } = useVoteLogs();

    // 1. Calculate realistic counts from Stats API
    const totalVoters = stats?.summary.totalRegisteredSiswa || 0;
    const votedCount = stats?.summary.totalVotesCast || 0;
    const notVotedCount = stats?.summary.abstainCount || 0;
    const turnoutRate = stats?.summary.participationPercentage || 0;
    const remainingRate = totalVoters > 0 ? 100 - turnoutRate : 0;
    const activeCandidatesCount = stats?.candidates.length || 0;

    // 2. Generate recent votes data (first 5 votes for dashboard display)
    const recentVotes = useMemo<VoteRecord[]>(() => {
        if (!logs) return [];

        // Sort from newest to oldest
        const sortedLogs = [...logs].sort((a, b) => {
            const dateA = new Date(a.createdAt || a.created_at || 0).getTime();
            const dateB = new Date(b.createdAt || b.created_at || 0).getTime();
            return dateB - dateA; // descending
        });

        return sortedLogs.slice(0, 5).map(log => {
            // Gunakan time_remaining dari database
            const timeSec = log.time_remaining || 0;
            const minutes = Math.floor(timeSec / 60);
            const seconds = timeSec % 60;

            let timeDisplay = '';
            if (minutes > 0) {
                timeDisplay = `${minutes} Menit ${seconds} Detik`;
            } else {
                timeDisplay = `${seconds} Detik`;
            }

            return {
                id: `BALLOT-${new Date().getFullYear()}-${String(log.id).padStart(4, '0')}`,
                voterName: log.user.name,
                voterNisn: log.user.nisn,
                voterKelas: log.user.kelas,
                candidateName: log.candidate.name,
                candidateImage: log.candidate.image,
                timestamp: timeDisplay
            };
        });
    }, [logs]);

    // 4. ApexCharts Configurations
    const donutSeries = useMemo(() => [votedCount, notVotedCount], [votedCount, notVotedCount]);
    const donutOptions = useMemo(() => ({
        chart: {
            type: 'donut' as const,
            fontFamily: 'Inter, sans-serif'
        },
        labels: ['Sudah Memilih', 'Belum Memilih'],
        colors: ['#10b981', '#f59e0b'],
        legend: {
            position: 'bottom' as const,
            fontSize: '11px',
            fontWeight: 700,
            labels: {
                colors: '#64748b'
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val: number) {
                return val.toFixed(1) + "%";
            }
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '40%',
                    labels: {
                        show: true,
                        name: {
                            show: false
                        },
                        value: {
                            show: true,
                            fontSize: '22px',
                            fontWeight: 900,
                            color: '#10b981',
                            offsetY: 10
                        },
                        total: {
                            show: true,
                            label: '',
                            formatter: function () {
                                return turnoutRate.toFixed(1) + "%";
                            }
                        }
                    }
                }
            }
        },
        tooltip: {
            y: {
                formatter: function (val: number) {
                    return val + " Pemilih";
                }
            }
        }
    }), [turnoutRate]);

    const barSeries = useMemo(() => [{
        name: 'Perolehan Suara',
        data: stats?.candidates.map(c => c.votesCount) || []
    }], [stats]);

    const barOptions = useMemo(() => ({
        chart: {
            type: 'bar' as const,
            toolbar: {
                show: false
            },
            fontFamily: 'Inter, sans-serif'
        },
        plotOptions: {
            bar: {
                borderRadius: 6,
                columnWidth: '45%',
                distributed: true
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val: number) {
                return val + " Suara";
            },
            style: {
                fontSize: '10px',
                fontWeight: 800,
                colors: ['#fff']
            }
        },
        colors: ['#10b981', '#14b8a6', '#34d399', '#4ade80', '#6ee7b7', '#a7f3d0'],
        xaxis: {
            categories: stats?.candidates.map(c => c.name.split(' ')[0]) || [],
            labels: {
                style: {
                    colors: '#64748b',
                    fontSize: '10px',
                    fontWeight: 700
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#64748b',
                    fontSize: '10px',
                    fontWeight: 600
                }
            }
        },
        legend: {
            show: false
        },
        grid: {
            borderColor: '#f1f5f9'
        },
        tooltip: {
            y: {
                formatter: function (val: number, opts: any) {
                    const candidate = stats?.candidates[opts.dataPointIndex];
                    return `${val} Suara (${candidate ? candidate.percentage : 0}%)`;
                }
            }
        }
    }), [stats]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full text-red-500 font-bold">
                {error}
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-slate-50/30 overflow-y-auto pb-10 pt-6 mx-auto w-full space-y-6">

            {/* Header Title Section */}
            <div className="text-left">
                <h1 className="text-2xl text-text-green font-black tracking-tight flex items-center gap-2">
                    <FiTrendingUp className="size-6 text-emerald-600" />
                    Dashboard E-Voting
                </h1>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                    Selamat datang di panel admin utama. Pantau perolehan suara dan integritas pemilu di sini.
                </p>
            </div>

            {/* 1. KPI Stats Cards Grid (Modular Component) */}
            <KpiStats
                totalVoters={totalVoters}
                votedCount={votedCount}
                notVotedCount={notVotedCount}
                turnoutRate={turnoutRate}
                remainingRate={remainingRate}
                activeCandidatesCount={activeCandidatesCount}
            />

            {/* 2. Charts Section (Modular ApexCharts Component) */}
            <AnalyticsCharts
                donutSeries={donutSeries}
                donutOptions={donutOptions}
                barSeries={barSeries}
                barOptions={barOptions}
            />

            {/* 3. Recent Activity Ballot Table (Modular Component) */}
            <RecentVotesTable
                recentVotes={recentVotes}
            />
        </div>
    );
}