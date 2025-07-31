'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { TrendingUp, Users, Calendar, BarChart3, Globe, Activity } from 'lucide-react';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function ApplicationAnalytics() {
  const [visitorData, setVisitorData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(7);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const periods = [
    { label: '7 Days', value: 7 },
    { label: '15 Days', value: 15 },
    { label: '30 Days', value: 30 }
  ];

  useEffect(() => {
    fetchVisitorData(selectedPeriod);
  }, [selectedPeriod]);

  const fetchVisitorData = async (days) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/visitors?days=${days}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setVisitorData(data);
    } catch (err) {
      console.error('Failed to fetch visitor data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6 mb-8"
      >
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="h-20 bg-gray-700 rounded"></div>
            <div className="h-20 bg-gray-700 rounded"></div>
            <div className="h-20 bg-gray-700 rounded"></div>
          </div>
          <div className="h-64 bg-gray-700 rounded"></div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6 mb-8"
      >
        <div className="text-center py-8">
          <Globe className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Platform Analytics Unavailable</h3>
          <p className="text-gray-400 text-sm mb-4">Unable to load application analytics</p>
          <p className="text-red-400 text-xs">{error}</p>
          <motion.button
            onClick={() => fetchVisitorData(selectedPeriod)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
          >
            Retry
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (!visitorData) {
    return null;
  }

  const totalVisitors = visitorData?.count || 0;
  const avgDaily = visitorData?.daily ? 
    Math.round(visitorData.daily.reduce((sum, d) => sum + d.count, 0) / visitorData.daily.length) : 0;
  const todayVisitors = visitorData?.todayCount || 0;

  const chartOptions = {
    chart: {
      type: 'area',
      height: 280,
      toolbar: {
        show: false
      },
      background: 'transparent',
      fontFamily: 'Inter, sans-serif'
    },
    theme: {
      mode: 'dark'
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    colors: ['#3B82F6'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0.05,
        stops: [0, 100]
      }
    },
    grid: {
      borderColor: '#374151',
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    xaxis: {
      categories: visitorData?.daily?.map(d => {
        const date = new Date(d.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }) || [],
      labels: {
        style: {
          colors: '#9CA3AF',
          fontSize: '11px'
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
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
      style: {
        fontSize: '12px'
      }
    },
    legend: {
      show: false
    }
  };

  const chartSeries = [
    {
      name: 'Platform Visitors',
      data: visitorData?.daily?.map(d => d.count) || []
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6 mb-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center space-x-3 mb-4 sm:mb-0">
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Platform Analytics</h2>
            <p className="text-sm text-gray-400">GitView application usage metrics</p>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex bg-gray-800/50 rounded-lg p-1">
          {periods.map((period) => (
            <motion.button
              key={period.value}
              onClick={() => setSelectedPeriod(period.value)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                selectedPeriod === period.value
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              {period.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white" suppressHydrationWarning>{totalVisitors.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Today</p>
              <p className="text-2xl font-bold text-white">{todayVisitors}</p>
            </div>
            <Calendar className="w-8 h-8 text-green-400" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Daily Avg</p>
              <p className="text-2xl font-bold text-white">{avgDaily}</p>
            </div>
            <Activity className="w-8 h-8 text-purple-400" />
          </div>
        </motion.div>
      </div>

      {/* Chart */}
      <div className="bg-gray-800/30 rounded-xl p-4">
        <h3 className="text-sm font-medium text-gray-300 mb-3">Platform Traffic Trend</h3>
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="area"
          height={280}
          width="100%"
        />
      </div>
    </motion.div>
  );
}