'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { GitCommit, TrendingUp, TrendingDown, Calendar } from 'lucide-react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function CommitActivityChart({ userData }) {
  if (!userData?.monthlyActivity) return null;

  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;
  
  const thisYearCommits = userData.thisYearCommits || 0;
  const lastYearCommits = userData.lastYearCommits || 0;
  const commitGrowth = userData.commitGrowth || 0;

  const chartOptions = {
    chart: {
      type: 'area',
      height: 300,
      toolbar: { show: false },
      background: 'transparent',
      fontFamily: 'Inter, sans-serif'
    },
    theme: { mode: 'dark' },
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    colors: ['#10b981'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 100]
      }
    },
    grid: {
      borderColor: '#374151',
      strokeDashArray: 3
    },
    xaxis: {
      categories: userData.monthlyActivity.map(d => d.month),
      labels: {
        style: {
          colors: '#9CA3AF',
          fontSize: '11px'
        }
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#9CA3AF',
          fontSize: '11px'
        }
      }
    },
    tooltip: {
      theme: 'dark',
      style: { fontSize: '12px' }
    },
    legend: { show: false }
  };

  const chartSeries = [
    {
      name: 'Commits',
      data: userData.monthlyActivity.map(d => d.commits)
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
            <GitCommit className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Commit Activity</h2>
            <p className="text-sm text-gray-400">12-month contribution history</p>
          </div>
        </div>
      </div>

      {/* Year Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">{currentYear} Commits</p>
              <p className="text-2xl font-bold text-white" suppressHydrationWarning>{thisYearCommits.toLocaleString()}</p>
            </div>
            <Calendar className="w-8 h-8 text-green-400" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">{previousYear} Commits</p>
              <p className="text-2xl font-bold text-white" suppressHydrationWarning>{lastYearCommits.toLocaleString()}</p>
            </div>
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">YoY Growth</p>
              <div className="flex items-center space-x-2">
                <p className={`text-2xl font-bold ${commitGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {commitGrowth >= 0 ? '+' : ''}{commitGrowth}%
                </p>
                {commitGrowth >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-green-400" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-400" />
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Activity Chart */}
      <div className="bg-gray-800 rounded-xl p-4">
        <h3 className="text-sm font-medium text-gray-300 mb-3">Monthly Commit Activity</h3>
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="area"
          height={300}
          width="100%"
        />
      </div>

      {/* Most Active Month */}
      {userData.mostActiveMonth && (
        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-green-500/20">
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-400">Most Active Month</p>
              <p className="text-white">
                <span className="font-semibold">{userData.mostActiveMonth.month}</span> with{' '}
                <span className="font-semibold">{userData.mostActiveMonth.commits}</span> commits
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}