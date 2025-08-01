'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Code2, Zap } from 'lucide-react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function LanguageChart({ userData }) {
  if (!userData?.topLanguages || userData.topLanguages.length === 0) {
    return null;
  }

  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: '#f7df1e',
      TypeScript: '#3178c6',
      Python: '#3776ab',
      Java: '#007396',
      'C++': '#00599c',
      C: '#a8b9cc',
      Go: '#00add8',
      Rust: '#000000',
      PHP: '#777bb4',
      Ruby: '#cc342d',
      Swift: '#fa7343',
      Kotlin: '#7f52ff',
      Dart: '#00b4ab',
      HTML: '#e34f26',
      CSS: '#1572b6',
      Vue: '#4fc08d',
      React: '#61dafb',
    };
    return colors[language] || '#6b7280';
  };

  const chartOptions = {
    chart: {
      type: 'donut',
      height: 300,
      toolbar: { show: false },
      background: 'transparent',
      fontFamily: 'Inter, sans-serif'
    },
    theme: { mode: 'dark' },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
        colors: ['#ffffff']
      }
    },
    colors: userData.topLanguages.map(lang => getLanguageColor(lang.language)),
    labels: userData.topLanguages.map(lang => lang.language),
    legend: {
      show: false
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Languages',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#ffffff',
              formatter: () => userData.topLanguages.length
            }
          }
        }
      }
    },
    stroke: {
      width: 2,
      colors: ['#1f2937']
    },
    tooltip: {
      theme: 'dark',
      style: { fontSize: '12px' },
      y: {
        formatter: (value) => `${value} repositories`
      }
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 250
          }
        }
      }
    ]
  };

  const chartSeries = userData.topLanguages.map(lang => lang.count);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
          <Code2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Programming Languages</h2>
          <p className="text-sm text-gray-400">Most used technologies</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-gray-800 rounded-xl p-4">
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="donut"
            height={300}
            width="100%"
          />
        </div>

        {/* Language List */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white mb-4">Language Breakdown</h3>
          {userData.topLanguages.map((lang, index) => (
            <motion.div
              key={lang.language}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: getLanguageColor(lang.language) }}
                />
                <span className="text-white font-medium">{lang.language}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-sm">{lang.count} repos</span>
                <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${(lang.count / userData.topLanguages[0].count) * 100}%`,
                      backgroundColor: getLanguageColor(lang.language)
                    }}
                  />
                </div>
              </div>
            </motion.div>
          ))}

          {/* Additional Stats */}
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Zap className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-400">Most Used Language</p>
                <p className="text-white">
                  <span className="font-semibold">{userData.topLanguages[0].language}</span> in{' '}
                  <span className="font-semibold">{userData.topLanguages[0].count}</span> repositories
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}