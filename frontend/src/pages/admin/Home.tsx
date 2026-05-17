import { useMemo } from 'react';
import { candidates, countUsers } from '../../data/User';
import { FiTrendingUp } from 'react-icons/fi';

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
    // 1. Calculate realistic counts from User.ts data
    const activeCandidates = useMemo(() => candidates.filter(c => c.status === 'active'), []);
    const totalVoters = useMemo(() => countUsers.filter(u => u.role === 'siswa').length, []);

    // Simulate turnout (consistent with Votes.tsx's 38 voted students)
    const votedCount = 38;
    const notVotedCount = totalVoters - votedCount;
    const turnoutRate = totalVoters > 0 ? ((votedCount / totalVoters) * 100) : 0;
    const remainingRate = 100 - turnoutRate;

    // 2. Generate recent votes data (first 5 votes for dashboard display)
    const recentVotes = useMemo<VoteRecord[]>(() => {
        const list: VoteRecord[] = [];
        for (let i = 0; i < 5; i++) {
            const student = countUsers[i];
            if (!student || student.role === 'admin') continue;

            const candidateIndex = i % activeCandidates.length;
            const chosenCandidate = activeCandidates[candidateIndex];

            // Map timestamp (consistent with Votes.tsx time range)
            const minute = 10 + (i * 12) % 45;
            const timestampString = `17 Mei 2026, 11:${String(minute).padStart(2, '0')}:14`;

            list.push({
                id: `BALLOT-2026-${String(1000 + i).substring(1)}`,
                voterName: student.name,
                voterNisn: student.nisn,
                voterKelas: student.kelas,
                candidateName: chosenCandidate.name,
                candidateImage: chosenCandidate.image,
                timestamp: timestampString
            });
        }
        return list;
    }, [activeCandidates]);

    // 3. Compute vote distribution per candidate
    const standings = useMemo(() => {
        const counts: Record<number, number> = {};

        // Initialize active candidates
        activeCandidates.forEach(c => {
            counts[c.id] = 0;
        });

        // Seed initial mock distribution of 38 votes
        for (let i = 0; i < votedCount; i++) {
            const candidateIndex = i % activeCandidates.length;
            const chosenCandidate = activeCandidates[candidateIndex];
            if (chosenCandidate) {
                counts[chosenCandidate.id]++;
            }
        }

        return activeCandidates
            .map(c => ({
                id: c.id,
                name: c.name,
                image: c.image,
                kelas: c.kelas,
                votes: counts[c.id] || 0,
                percent: votedCount > 0 ? (((counts[c.id] || 0) / votedCount) * 100).toFixed(1) : '0'
            }))
            .sort((a, b) => b.votes - a.votes);
    }, [activeCandidates, votedCount]);

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
                    size: '65%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Turnout',
                            color: '#64748b',
                            fontSize: '12px',
                            fontWeight: '700',
                            formatter: function () {
                                return turnoutRate.toFixed(0) + "%";
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
        data: standings.map(s => s.votes)
    }], [standings]);

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
            categories: standings.map(s => s.name.split(' ')[0]),
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
                    const candidate = standings[opts.dataPointIndex];
                    return `${val} Suara (${candidate ? candidate.percent : 0}%)`;
                }
            }
        }
    }), [standings]);

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
                activeCandidatesCount={activeCandidates.length}
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