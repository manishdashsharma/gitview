'use client';

import { motion } from 'framer-motion';
import { Star, GitFork, Code2, ExternalLink, Pin } from 'lucide-react';

export default function PinnedRepositories({ userData }) {
  if (!userData?.pinnedRepositories || userData.pinnedRepositories.length === 0) {
    return null;
  }

  const formatNumber = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500">
          <Pin className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Pinned Repositories</h2>
          <p className="text-sm text-gray-400">Most starred repositories</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {userData.pinnedRepositories.map((repo, index) => (
          <motion.div
            key={repo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-gray-800 border border-gray-700 rounded-xl p-4 group hover:border-gray-600 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {repo.name}
                </h3>
                {repo.description && (
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                    {repo.description}
                  </p>
                )}
              </div>
              <motion.a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-400 hover:text-white transition-colors ml-2"
              >
                <ExternalLink className="w-4 h-4" />
              </motion.a>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm">
                {repo.language && (
                  <div className="flex items-center space-x-1">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getLanguageColor(repo.language) }}
                    />
                    <span className="text-gray-300">{repo.language}</span>
                  </div>
                )}
                
                {repo.stargazers_count > 0 && (
                  <div className="flex items-center space-x-1 text-gray-400">
                    <Star className="w-3 h-3" />
                    <span>{formatNumber(repo.stargazers_count)}</span>
                  </div>
                )}
                
                {repo.forks_count > 0 && (
                  <div className="flex items-center space-x-1 text-gray-400">
                    <GitFork className="w-3 h-3" />
                    <span>{formatNumber(repo.forks_count)}</span>
                  </div>
                )}
              </div>

              {repo.fork && (
                <div className="flex items-center space-x-1 text-xs text-yellow-400">
                  <GitFork className="w-3 h-3" />
                  <span>Fork</span>
                </div>
              )}
            </div>

            {repo.topics && repo.topics.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {repo.topics.slice(0, 3).map((topic) => (
                  <span
                    key={topic}
                    className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20"
                  >
                    {topic}
                  </span>
                ))}
                {repo.topics.length > 3 && (
                  <span className="px-2 py-1 bg-gray-500/10 text-gray-400 text-xs rounded-full border border-gray-500/20">
                    +{repo.topics.length - 3}
                  </span>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}