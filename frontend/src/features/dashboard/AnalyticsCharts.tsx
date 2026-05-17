import { FiPieChart, FiTrendingUp } from 'react-icons/fi';
import Chart from 'react-apexcharts';

interface AnalyticsChartsProps {
    donutSeries: number[];
    donutOptions: any;
    barSeries: any[];
    barOptions: any;
}

export default function AnalyticsCharts({
    donutSeries,
    donutOptions,
    barSeries,
    barOptions
}: AnalyticsChartsProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* Left Panel: Donut Chart (Turnout Distribution) */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-md p-5 text-left flex flex-col justify-between">
                <h2 className="text-xs font-black text-text-green uppercase tracking-wider border-b border-gray-100 pb-2.5 flex items-center gap-1.5 mb-4">
                    <FiPieChart className="size-4 text-emerald-600" />
                    Persentase Partisipasi
                </h2>

                <div className="flex-1 flex items-center justify-center min-h-[220px]">
                    <div className="w-full">
                        <Chart 
                            options={donutOptions} 
                            series={donutSeries} 
                            type="donut" 
                            height={240} 
                        />
                    </div>
                </div>
            </div>

            {/* Right Panel: Standings Bar Charts */}
            <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 shadow-md p-5 text-left flex flex-col justify-between">
                <h2 className="text-xs font-black text-text-green uppercase tracking-wider border-b border-gray-100 pb-2.5 flex items-center gap-1.5 mb-4">
                    <FiTrendingUp className="size-4 text-emerald-600" />
                    Klasemen Perolehan Suara
                </h2>

                <div className="flex-1 flex items-center justify-center min-h-[220px]">
                    <div className="w-full">
                        <Chart 
                            options={barOptions} 
                            series={barSeries} 
                            type="bar" 
                            height={240} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
