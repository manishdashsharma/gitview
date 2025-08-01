'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Eye, TrendingUp, Calendar, User, BarChart3 } from 'lucide-react';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function ProfileViewTracker({ username }) {
  const [profileData, setProfileData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(7);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const periods = [
    { label: '7 Days', value: 7 },
    { label: '15 Days', value: 15 },
    { label: '30 Days', value: 30 }
  ];

  useEffect(() => {
    if (username) {
      fetchProfileData(selectedPeriod);
      trackProfileView();
    }
  }, [username, selectedPeriod]);

  const fetchProfileData = async (days) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/profile-views/${username}?days=${days}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setProfileData(data);
    } catch (err) {
      console.error('Failed to fetch profile data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const trackProfileView = async () => {
    try {
      await fetch(`/api/profile-views/${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Failed to track profile view:', error);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6"
      >
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="h-16 bg-gray-700 rounded"></div>
            <div className="h-16 bg-gray-700 rounded"></div>
            <div className="h-16 bg-gray-700 rounded"></div>
          </div>
          <div className="h-48 bg-gray-700 rounded"></div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6"
      >
        <div className="text-center py-6">
          <User className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white mb-2">Profile Analytics Unavailable</h3>
          <p className="text-gray-400 text-sm mb-3">Unable to load profile view data</p>
          <p className="text-red-400 text-xs">{error}</p>
          <motion.button
            onClick={() => fetchProfileData(selectedPeriod)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
          >
            Retry
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (!profileData) {
    return null;
  }

  const totalViews = profileData?.totalViews || 0;
  const avgDaily = profileData?.daily ? 
    Math.round(profileData.daily.reduce((sum, d) => sum + d.count, 0) / profileData.daily.length) : 0;
  const todayViews = profileData?.todayViews || 0;

  const chartOptions = {
    chart: {
      type: 'line',
      height: 200,
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
      width: 3
    },
    colors: ['#8B5CF6'],
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
      categories: profileData?.daily?.map(d => {
        const date = new Date(d.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }) || [],
      labels: {
        style: {
          colors: '#9CA3AF',
          fontSize: '10px'
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
          fontSize: '10px'
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
      name: 'Profile Views',
      data: profileData?.daily?.map(d => d.count) || []
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
          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Profile Views</h2>
            <p className="text-sm text-gray-400">@{username} analytics</p>
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
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
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
              <p className="text-gray-400 text-sm">Total Views</p>
              <p className="text-2xl font-bold text-white" suppressHydrationWarning>{totalViews.toLocaleString()}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-400" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Today&apos;s Views</p>
              <p className="text-2xl font-bold text-white">{todayViews}</p>
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
              <p className="text-gray-400 text-sm">Daily Average</p>
              <p className="text-2xl font-bold text-white">{avgDaily}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-400" />
          </div>
        </motion.div>
      </div>

      {/* Chart */}
      <div className="bg-gray-800/30 rounded-xl p-4">
        <h3 className="text-sm font-medium text-gray-300 mb-3">Profile View Trend</h3>
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="line"
          height={200}
          width="100%"
        />
      </div>
    </motion.div>
  );
}