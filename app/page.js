'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Github, 
  Search, 
  Star, 
  GitFork, 
  Users, 
  Code2, 
  TrendingUp,
  Calendar,
  MapPin,
  Link2,
  Building,
  Mail,
  Eye,
  BookOpen,
  Activity,
  Award,
  Zap,
  Target,
  Sparkles,
  Share2,
  Copy,
  Twitter,
  Linkedin,
  Check,
  BarChart3
} from 'lucide-react';
import Image from 'next/image';
import VisitorAnalytics from '@/components/VisitorAnalytics';
import ApplicationAnalytics from '@/components/ApplicationAnalytics';
import ProfileViewTracker from '@/components/ProfileViewTracker';
import CommitActivityChart from '@/components/CommitActivityChart';
import PinnedRepositories from '@/components/PinnedRepositories';
import LanguageChart from '@/components/LanguageChart';

export default function GitView() {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [visitors, setVisitors] = useState(0);
  const [mounted, setMounted] = useState(false);

  const handleSearch = useCallback(async (e, searchUser = null) => {
    e?.preventDefault();
    const userToSearch = searchUser || username.trim();
    if (!userToSearch) return;

    setLoading(true);
    setError('');
    setUserData(null);

    try {
      const response = await fetch(`/api/github/${userToSearch}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch user data');
      }

      setUserData(data.userData);
      
      // Update URL with user parameter for sharing
      if (typeof window !== 'undefined') {
        const newUrl = new URL(window.location);
        newUrl.searchParams.set('user', userToSearch);
        window.history.replaceState({}, '', newUrl);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    setMounted(true);
    
    // Fetch visitor count only once
    const fetchVisitorCount = async () => {
      try {
        const response = await fetch('/api/visitors');
        const data = await response.json();
        setVisitors(data.count || 0);
      } catch (error) {
        console.error('Error fetching visitor count:', error);
      }
    };
    
    fetchVisitorCount();

    // Check for shared user in URL
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const sharedUser = urlParams.get('user');
      if (sharedUser) {
        setUsername(sharedUser);
        // Auto-search for shared user
        const fakeEvent = { preventDefault: () => {} };
        handleSearch(fakeEvent, sharedUser);
      }
    }
  }, [handleSearch]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const pulseVariants = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 50, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute -top-1/2 -right-1/2 w-full h-full opacity-5"
        >
          <div className="w-full h-full bg-gradient-conic from-blue-500 via-purple-500 to-blue-500 rounded-full blur-3xl" />
        </motion.div>
        
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1, 0.9, 1]
          }}
          transition={{ 
            rotate: { duration: 40, repeat: Infinity, ease: "linear" },
            scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full opacity-5"
        >
          <div className="w-full h-full bg-gradient-conic from-green-500 via-blue-500 to-green-500 rounded-full blur-3xl" />
        </motion.div>
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="relative z-10 border-b border-gray-800/50 backdrop-blur-xl bg-gray-950/80"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.div
                animate={pulseVariants}
                className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500"
              >
                <Github className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  GitView
                </h1>
                <p className="text-xs text-gray-400">Analytics Platform</p>
              </div>
            </motion.div>

            <div className="flex items-center space-x-2 sm:space-x-6">
              <motion.div 
                className="flex items-center space-x-2 sm:space-x-4 text-sm text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Eye className="w-4 h-4" />
                  <span suppressHydrationWarning className="text-xs sm:text-sm">{mounted ? visitors.toLocaleString() : '—'} views</span>
                </div>
                <div className="hidden md:flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-blue-400" />
                  <span className="hidden lg:inline">Analytics</span>
                </div>
              </motion.div>

              <motion.div
                className="hidden md:flex items-center space-x-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <a href="#features" className="text-gray-300 hover:text-white transition-colors text-sm hidden lg:block">
                  Features
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {!userData ? (
            /* Hero Section */
            <motion.section
              key="hero"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={containerVariants}
              className="py-20 px-4 sm:px-6 lg:px-8"
            >
              <div className="max-w-4xl mx-auto text-center">
                <motion.div variants={itemVariants} className="mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 200, 
                      damping: 15,
                      delay: 0.2 
                    }}
                    className="inline-flex items-center px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700/50 text-sm text-gray-300 mb-6"
                  >
                    <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
                    World-class GitHub Analytics
                  </motion.div>

                  <motion.h1
                    variants={itemVariants}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
                  >
                    <span className="text-white">Unlock GitHub</span>
                    <br />
                    <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Insights
                    </span>
                  </motion.h1>

                  <motion.p
                    variants={itemVariants}
                    className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed px-4"
                  >
                    Dive deep into any GitHub profile with beautiful visualizations, 
                    comprehensive statistics, and actionable insights.
                  </motion.p>
                </motion.div>

                {/* Search Section */}
                <motion.div variants={itemVariants} className="max-w-2xl mx-auto mb-16">
                  <form onSubmit={handleSearch}>
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      className="relative group"
                    >
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300" />
                      
                      <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-2 shadow-2xl gap-2 sm:gap-0">
                        <div className="flex items-center flex-1 px-4 min-h-[56px] sm:min-h-0">
                          <Github className="w-5 h-5 text-gray-400 mr-3" />
                          <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter GitHub username (e.g., octocat)"
                            className="flex-1 py-3 sm:py-4 bg-transparent text-white placeholder-gray-500 focus:outline-none text-base sm:text-lg"
                            disabled={loading}
                          />
                        </div>
                        
                        <motion.button
                          type="submit"
                          disabled={loading || !username.trim()}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 min-h-[48px] sm:min-h-0"
                        >
                          {loading ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            />
                          ) : (
                            <>
                              <Search className="w-5 h-5" />
                              <span>Analyze</span>
                            </>
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  </form>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
                    >
                      {error}
                    </motion.div>
                  )}

                  {/* Quick Examples */}
                  <motion.div
                    variants={itemVariants}
                    className="mt-6 flex flex-wrap justify-center gap-2 text-xs sm:text-sm px-4"
                  >
                    <span className="text-gray-500">Try:</span>
                    {['octocat', 'torvalds', 'gaearon', 'addyosmani'].map((example) => (
                      <motion.button
                        key={example}
                        onClick={() => setUsername(example)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1 rounded-full bg-gray-800/50 border border-gray-700/50 text-blue-400 hover:bg-gray-800 hover:border-blue-500/50 transition-all"
                      >
                        {example}
                      </motion.button>
                    ))}
                  </motion.div>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                  id="features"
                  variants={containerVariants}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto px-4"
                >
                  {[
                    {
                      icon: <TrendingUp className="w-8 h-8" />,
                      title: "Advanced Analytics",
                      description: "Deep insights into repositories, contributions, and coding patterns with beautiful visualizations.",
                      gradient: "from-blue-500 to-cyan-500"
                    },
                    {
                      icon: <Activity className="w-8 h-8" />,
                      title: "Real-time Data",
                      description: "Live GitHub data with smart caching for instant results and up-to-date information.",
                      gradient: "from-purple-500 to-pink-500"
                    },
                    {
                      icon: <Zap className="w-8 h-8" />,
                      title: "Lightning Fast",
                      description: "Optimized performance with intelligent data processing and modern web technologies.",
                      gradient: "from-green-500 to-emerald-500"
                    }
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      whileHover={{ 
                        scale: 1.05,
                        rotateY: 5,
                        z: 50
                      }}
                      className="group relative"
                    >
                      <div className="absolute -inset-1 bg-gradient-to-r opacity-20 group-hover:opacity-40 transition-opacity duration-300 rounded-2xl blur" 
                           style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }} />
                      
                      <div className="relative h-full p-6 sm:p-8 bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 rounded-2xl hover:border-gray-700/50 transition-all duration-300">
                        <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} mb-6`}>
                          <div className="text-white">
                            {feature.icon}
                          </div>
                        </div>
                        
                        <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">
                          {feature.title}
                        </h3>
                        
                        <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Application Analytics */}
                <motion.div variants={containerVariants} className="mt-16">
                  <ApplicationAnalytics />
                </motion.div>
              </div>
            </motion.section>
          ) : (
            /* Results Section */
            <ProfileAnalytics 
              userData={userData} 
              onBack={() => {
                setUserData(null);
                // Clear URL parameters
                if (typeof window !== 'undefined') {
                  const newUrl = new URL(window.location);
                  newUrl.searchParams.delete('user');
                  window.history.replaceState({}, '', newUrl);
                }
              }} 
            />
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="relative z-10 border-t border-gray-800/50 backdrop-blur-xl bg-gray-950/80 mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                <Github className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">GitView</h3>
                <p className="text-xs text-gray-400">Powered by GitHub API</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 sm:space-x-6 text-xs sm:text-sm text-gray-400">
              <span className="hidden sm:inline">Made with ❤️ by Manish</span>
              <motion.a
                href="https://github.com/manishdashsharma"
                whileHover={{ scale: 1.1 }}
                className="hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </motion.a>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}

// Profile Analytics Component
function ProfileAnalytics({ userData, onBack }) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showShareMenu && !event.target.closest('.share-menu-container')) {
        setShowShareMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showShareMenu]);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/profile/${userData.login}`;
  const shareText = `Check out ${userData.name || userData.login}'s GitHub analytics on GitView! 📊\n\n• ${userData.public_repos} repositories\n• ${userData.followers} followers\n• ${userData.totalStars || 0} total stars${userData.thisYearCommits ? `\n• ${userData.thisYearCommits} commits this year` : ''}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link');
    }
  };

  const handleShareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const handleShareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Back Button & Share */}
        <div className="flex items-center justify-between mb-8">
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-300 hover:bg-gray-800 hover:border-gray-600 transition-all"
          >
            <span>←</span>
            <span>Back to search</span>
          </motion.button>

          {/* Share Button */}
          <div className="relative share-menu-container">
            <motion.button
              onClick={() => setShowShareMenu(!showShareMenu)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all shadow-lg"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </motion.button>

            {/* Share Menu */}
            <AnimatePresence>
              {showShareMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl z-50"
                >
                  <div className="p-2">
                    <motion.button
                      onClick={handleCopyLink}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-800/50 text-gray-300 hover:text-white transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-green-400" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </motion.button>

                    <motion.button
                      onClick={handleShareTwitter}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-800/50 text-gray-300 hover:text-white transition-colors"
                    >
                      <Twitter className="w-4 h-4 text-blue-400" />
                      <span>Share on Twitter</span>
                    </motion.button>

                    <motion.button
                      onClick={handleShareLinkedIn}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-800/50 text-gray-300 hover:text-white transition-colors"
                    >
                      <Linkedin className="w-4 h-4 text-blue-600" />
                      <span>Share on LinkedIn</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-4 sm:p-6 lg:p-8 mb-8"
        >
          <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <Image
                src={userData.avatar_url}
                alt={userData.name || userData.login}
                width={128}
                height={128}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 border-gray-700/50 shadow-2xl"
                priority
              />
            </motion.div>

            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    {userData.name || userData.login}
                  </h1>
                  <p className="text-lg sm:text-xl text-blue-400">@{userData.login}</p>
                </div>
                
                <motion.a
                  href={userData.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 lg:mt-0 inline-flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl text-white font-semibold transition-all shadow-lg text-sm sm:text-base"
                >
                  <Github className="w-5 h-5" />
                  <span>View Profile</span>
                </motion.a>
              </div>

              {userData.bio && (
                <p className="text-gray-300 mb-4 text-base sm:text-lg leading-relaxed">
                  {userData.bio}
                </p>
              )}

              <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400">
                {userData.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{userData.location}</span>
                  </div>
                )}
                
                {userData.company && (
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4" />
                    <span>{userData.company}</span>
                  </div>
                )}
                
                {userData.blog && (
                  <div className="flex items-center space-x-2">
                    <Link2 className="w-4 h-4" />
                    <a href={userData.blog} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                      {userData.blog}
                    </a>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formatDate(userData.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 mb-8"
        >
          {[
            {
              label: "Repositories",
              value: formatNumber(userData.public_repos),
              icon: <BookOpen className="w-5 h-5" />,
              gradient: "from-blue-500 to-cyan-500"
            },
            {
              label: "Followers",
              value: formatNumber(userData.followers),
              icon: <Users className="w-5 h-5" />,
              gradient: "from-purple-500 to-pink-500"
            },
            {
              label: "Following",
              value: formatNumber(userData.following),
              icon: <Users className="w-5 h-5" />,
              gradient: "from-green-500 to-emerald-500"
            },
            {
              label: "Total Stars",
              value: formatNumber(userData.totalStars || 0),
              icon: <Star className="w-5 h-5" />,
              gradient: "from-yellow-500 to-orange-500"
            },
            {
              label: "Total Forks", 
              value: formatNumber(userData.totalForks || 0),
              icon: <GitFork className="w-5 h-5" />,
              gradient: "from-indigo-500 to-purple-500"
            },
            {
              label: userData.thisYearCommits ? `${userData.currentYear || new Date().getFullYear()} Commits` : "Commits",
              value: formatNumber(userData.thisYearCommits || 0),
              icon: <Activity className="w-5 h-5" />,
              gradient: "from-green-500 to-teal-500"
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 rounded-xl p-3 sm:p-4 hover:border-gray-700/50 transition-all"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.gradient}`}>
                  <div className="text-white">
                    {stat.icon}
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-lg sm:text-2xl font-bold text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-gray-400 text-xs leading-tight">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Profile View Analytics */}
        <ProfileViewTracker username={userData.login} />

        {/* Commit Activity Chart */}
        <CommitActivityChart userData={userData} />

        {/* Programming Languages */}
        <LanguageChart userData={userData} />

        {/* Pinned Repositories */}
        <PinnedRepositories userData={userData} />

        {/* Additional Info */}
        {userData.mostStarredRepo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-4 sm:p-6 lg:p-8"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center justify-center lg:justify-start">
              <Award className="w-6 h-6 mr-3 text-yellow-400" />
              Most Starred Repository
            </h2>
            
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-lg sm:text-xl font-semibold text-blue-400 mb-2">
                  {userData.mostStarredRepo.name}
                </h3>
                
                {userData.mostStarredRepo.description && (
                  <p className="text-sm sm:text-base text-gray-300 mb-4 leading-relaxed">
                    {userData.mostStarredRepo.description}
                  </p>
                )}
                
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-6 text-xs sm:text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>{formatNumber(userData.mostStarredRepo.stargazers_count)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <GitFork className="w-4 h-4 text-green-400" />
                    <span>{formatNumber(userData.mostStarredRepo.forks_count)}</span>
                  </div>
                  
                  {userData.mostStarredRepo.language && (
                    <div className="flex items-center space-x-2">
                      <Code2 className="w-4 h-4 text-blue-400" />
                      <span>{userData.mostStarredRepo.language}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <motion.a
                href={userData.mostStarredRepo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="lg:ml-6 px-3 sm:px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-gray-300 hover:text-white transition-all flex items-center space-x-2 text-sm"
              >
                <Github className="w-4 h-4" />
                <span>View</span>
              </motion.a>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}