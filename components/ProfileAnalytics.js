'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  Github, 
  Star, 
  GitFork, 
  Users, 
  Code2, 
  Calendar,
  MapPin,
  Link2,
  Building,
  BookOpen,
  Activity,
  Award,
  Share2,
  Copy,
  Twitter,
  Linkedin,
  Check
} from 'lucide-react';
import ProfileViewTracker from '@/components/ProfileViewTracker';
import CommitActivityChart from '@/components/CommitActivityChart';
import PinnedRepositories from '@/components/PinnedRepositories';
import LanguageChart from '@/components/LanguageChart';

export default function ProfileAnalytics({ userData, onBack }) {
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
  const shareText = `Check out ${userData.name || userData.login}'s GitHub analytics on GitView! 📊\\n\\n• ${userData.public_repos} repositories\\n• ${userData.followers} followers\\n• ${userData.totalStars || 0} total stars${userData.thisYearCommits ? `\\n• ${userData.thisYearCommits} commits this year` : ''}`;

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
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white hover:bg-gray-800 hover:border-gray-600 transition-all"
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
                  className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50"
                >
                  <div className="p-2">
                    <motion.button
                      onClick={handleCopyLink}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
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
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
                    >
                      <Twitter className="w-4 h-4 text-blue-400" />
                      <span>Share on Twitter</span>
                    </motion.button>

                    <motion.button
                      onClick={handleShareLinkedIn}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
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
          className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <Image
                src={userData.avatar_url}
                alt={userData.name || userData.login}
                width={128}
                height={128}
                className="w-32 h-32 rounded-2xl border-4 border-gray-700/50 shadow-2xl"
                priority
              />
            </motion.div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {userData.name || userData.login}
                  </h1>
                  <p className="text-xl text-blue-400">@{userData.login}</p>
                </div>
                
                <motion.a
                  href={userData.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 md:mt-0 inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl text-white font-semibold transition-all shadow-lg"
                >
                  <Github className="w-5 h-5" />
                  <span>View Profile</span>
                </motion.a>
              </div>

              {userData.bio && (
                <p className="text-gray-300 mb-4 text-lg leading-relaxed">
                  {userData.bio}
                </p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
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
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8"
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
              className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.gradient}`}>
                  <div className="text-white">
                    {stat.icon}
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-2xl font-bold text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-gray-400 text-xs">
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
            className="bg-gray-900 border border-gray-800 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Award className="w-6 h-6 mr-3 text-yellow-400" />
              Most Starred Repository
            </h2>
            
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-blue-400 mb-2">
                  {userData.mostStarredRepo.name}
                </h3>
                
                {userData.mostStarredRepo.description && (
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {userData.mostStarredRepo.description}
                  </p>
                )}
                
                <div className="flex items-center space-x-6 text-sm text-gray-400">
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
                className="ml-6 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-gray-300 hover:text-white transition-all flex items-center space-x-2"
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