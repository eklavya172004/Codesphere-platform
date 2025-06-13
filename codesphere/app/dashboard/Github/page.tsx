'use client';
import React, { useState, useEffect } from 'react';
import { User, MapPin, Building, Link, Twitter, Star, GitFork, Calendar, Github, ExternalLink, Activity, GitCommit, GitPullRequest, AlertCircle, Pin } from 'lucide-react';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is coming from GitHub callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isCallback = urlParams.get('github') === '1';
    
    if (isCallback) {
      // Clear URL parameters and fetch profile
      window.history.replaceState({}, document.title, window.location.pathname);
      fetchProfile();
    }
  }, []);

  const handleLogin = () => {
    // Redirect to your backend login endpoint
    window.location.href = 'http://localhost:4000/auth/github/login';
  };

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    
    try {
         const cachedProfile = localStorage.getItem('githubProfile');

        if (cachedProfile) {
            const parsedProfile = JSON.parse(cachedProfile);
            setUser(parsedProfile);
            setIsAuthenticated(true);
            setLoading(false); // ✅ Stop loading early if cached
            return; // ✅ Exit early, no need to fetch again
        }

      const response = await fetch('http://localhost:4000/auth/github/profile', {
        method: 'GET',
        credentials: 'include', // Important for session cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });

      

      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem('githubProfile', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        throw new Error('Failed to fetch profile');
      }
    } catch (err) {
      setError(err.message);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

 
  const ContributionCalendar = ({ contributionsCollection }) => {
    const { contributionCalendar, totalCommitContributions, totalIssueContributions, totalPullRequestContributions } = contributionsCollection;
    
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-3">
            <Calendar className="w-6 h-6 text-green-400" />
            Contribution Activity
          </h3>
          <div className="text-sm text-gray-400">
            {contributionCalendar.totalContributions} contributions this year
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
            <div className="flex items-center gap-2 mb-1">
              <GitCommit className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-400">Commits</span>
            </div>
            <div className="text-2xl font-bold text-white">{totalCommitContributions}</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-400">Issues</span>
            </div>
            <div className="text-2xl font-bold text-white">{totalIssueContributions}</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
            <div className="flex items-center gap-2 mb-1">
              <GitPullRequest className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-400">Pull Requests</span>
            </div>
            <div className="text-2xl font-bold text-white">{totalPullRequestContributions}</div>
          </div>
        </div>

         {/* Calendar Grid */}
        <div className="overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {/* Month labels */}
            <div className="flex flex-col gap-1 mr-2">
              <div className="h-3 text-xs text-gray-500"></div>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                <div key={index} className="h-3 text-xs text-gray-500 flex items-center">
                  {index % 2 === 0 ? day : ''}
                </div>
              ))}
            </div>
            
            {contributionCalendar.weeks.map((week, weekIndex) => {
              // Show month label for first week of each month
              const firstDay = week.contributionDays[0];
              const date = new Date(firstDay.date);
              const isFirstWeekOfMonth = date.getDate() <= 7;
              const monthLabel = isFirstWeekOfMonth ? date.toLocaleDateString('en-US', { month: 'short' }) : '';
              
              return (
                <div key={weekIndex} className="flex flex-col gap-1">
                  <div className="h-3 text-xs text-gray-500 flex items-center justify-center">
                    {monthLabel}
                  </div>
                  {week.contributionDays.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className="w-3 h-3 rounded-sm border border-gray-700/30 hover:border-gray-500 transition-all duration-200 cursor-pointer transform hover:scale-125"
                      style={{ backgroundColor: day.color || '#161b22' }}
                      title={`${day.date}: ${day.contributionCount} contributions`}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const RepositoryCard = ({ repo, isPinned = false }) => (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:transform hover:scale-105 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          {isPinned && <Pin className="w-4 h-4 text-yellow-400" />}
          <h3 className="font-semibold text-lg text-white group-hover:text-blue-400 transition-colors">
            <a href={repo.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              {repo.name}
              <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </h3>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1 hover:text-yellow-400 transition-colors">
            <Star className="w-4 h-4" />
            {repo.stargazerCount}
          </span>
          <span className="flex items-center gap-1 hover:text-blue-400 transition-colors">
            <GitFork className="w-4 h-4" />
            {repo.forkCount}
          </span>
        </div>
      </div>
      
      {repo.description && (
        <p className="text-gray-300 mb-4 leading-relaxed">{repo.description}</p>
      )}
      
      <div className="flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center gap-4">
          {repo.primaryLanguage && (
            <span className="flex items-center gap-2 px-3 py-1 bg-gray-800/50 rounded-full border border-gray-700/30">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: repo.primaryLanguage.color }}
              />
              {repo.primaryLanguage.name}
            </span>
          )}
          <span className="text-xs">Updated {formatDate(repo.updatedAt)}</span>
        </div>
      </div>

      {repo.defaultBranchRef?.target?.history?.edges?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700/30">
          <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Recent Commits
          </h4>
          <div className="space-y-3">
            {repo.defaultBranchRef.target.history.edges.slice(0, 2).map((commit, index) => (
              <div key={index} className="text-sm bg-gray-800/30 rounded-lg p-3 border border-gray-700/20 hover:border-gray-600/30 transition-colors">
                <a 
                  href={commit.node.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-medium block mb-1 truncate"
                >
                  {commit.node.message.split('\n')[0]}
                </a>
                <p className="text-gray-500 text-xs">
                  {formatDate(commit.node.committedDate)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:transform hover:scale-105 group">
      <div className="flex items-center gap-3 mb-2">
        <Icon className={`w-6 h-6 ${color} group-hover:scale-110 transition-transform`} />
        <span className="text-sm text-gray-400 font-medium">{label}</span>
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-gray-700 border-t-blue-400 mx-auto"></div>
            <Github className="w-12 h-12 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="mt-6 text-gray-300 text-lg animate-pulse">Loading your GitHub universe...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="bg-gray-900/70 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border border-gray-700/50">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
              <Github className="w-20 h-20 mx-auto text-white relative z-10" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              GitHub OAuth
            </h1>
            <p className="text-gray-300 mb-8 leading-relaxed">
              Connect your GitHub account to explore your coding universe with beautiful visualizations
            </p>
            
            {error && (
              <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4 mb-6 backdrop-blur-sm">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}
            
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 border border-gray-700/50 hover:border-gray-600/50 hover:shadow-lg hover:shadow-blue-500/20 group"
            >
              <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Sign in with GitHub
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="bg-gray-900/70 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border border-red-700/50">
          <div className="text-center">
            <div className="text-red-400 mb-6">
              <AlertCircle className="w-20 h-20 mx-auto" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-3">Authentication Error</h2>
            <p className="text-gray-300 mb-8">{error}</p>
            <button
              onClick={handleLogin}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl border border-gray-700/50 p-8 mb-8 hover:border-gray-600/50 transition-all duration-300">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <img
                src={user.avatarUrl}
                alt={user.name || user.login}
                className="relative w-32 h-32 rounded-full border-4 border-white/20 shadow-2xl group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {user.name || user.login}
                  </h1>
                  <p className="text-gray-300 text-xl mb-2">@{user.login}</p>
                  {user.status?.message && (
                    <div className="inline-flex items-center gap-2 bg-gray-800/50 rounded-full px-4 py-2 text-sm text-gray-300 border border-gray-700/30">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      {user.status.message}
                    </div>
                  )}
                </div>
              </div>

              {user.bio && (
                <p className="text-gray-300 mb-6 text-lg leading-relaxed">{user.bio}</p>
              )}
              
              <div className="flex flex-wrap gap-4 text-gray-300">
                {user.company && (
                  <span className="flex items-center gap-2 bg-gray-800/30 rounded-full px-4 py-2 border border-gray-700/30">
                    <Building className="w-4 h-4 text-blue-400" />
                    {user.company}
                  </span>
                )}
                {user.location && (
                  <span className="flex items-center gap-2 bg-gray-800/30 rounded-full px-4 py-2 border border-gray-700/30">
                    <MapPin className="w-4 h-4 text-green-400" />
                    {user.location}
                  </span>
                )}
                {user.websiteUrl && (
                  <a 
                    href={user.websiteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gray-800/30 rounded-full px-4 py-2 border border-gray-700/30 hover:border-blue-500/50 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <Link className="w-4 h-4" />
                    Website
                  </a>
                )}
                {user.twitterUsername && (
                  <a 
                    href={`https://twitter.com/${user.twitterUsername}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gray-800/30 rounded-full px-4 py-2 border border-gray-700/30 hover:border-blue-500/50 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                    @{user.twitterUsername}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            icon={User} 
            label="Followers" 
            value={user.followers.totalCount} 
            color="text-blue-400"
          />
          <StatCard 
            icon={User} 
            label="Following" 
            value={user.following.totalCount} 
            color="text-purple-400"
          />
          <StatCard 
            icon={Github} 
            label="Repositories" 
            value={user.repositories.totalCount} 
            color="text-green-400"
          />
        </div>

        {/* Contribution Calendar */}
        {user.contributionsCollection && (
          <div className="mb-8">
            <ContributionCalendar contributionsCollection={user.contributionsCollection} />
          </div>
        )}

        {/* Pinned Repositories */}
        {user.pinnedItems?.nodes?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <Pin className="w-8 h-8 text-yellow-400" />
              Pinned Repositories
            </h2>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {user.pinnedItems.nodes.map((repo, index) => (
                <RepositoryCard key={index} repo={repo} isPinned={true} />
              ))}
            </div>
          </div>
        )}

        {/* Recent Repositories */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <Activity className="w-8 h-8 text-green-400" />
            Recent Repositories ({user.repositories.totalCount})
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {user.repositories.nodes.map((repo, index) => (
              <RepositoryCard key={index} repo={repo} />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        {user.itemsWithRecentActivity?.nodes?.length > 0 && (
          <div className="mt-8">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <Activity className="w-8 h-8 text-orange-400" />
              Recent Activity
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {user.itemsWithRecentActivity.nodes.map((item, index) => (
                <div key={index} className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/30 hover:border-gray-600/30 transition-all duration-300">
                  <h3 className="font-semibold text-white mb-2">
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                      {item.name}
                    </a>
                  </h3>
                  {item.description && (
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;