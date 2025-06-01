"use client";
// app/dashboard/codechefs/page.tsx
import React, { useState } from 'react';
import { Search, User, Star, Globe, Calendar, Code, TrendingUp, Activity, ExternalLink, Award, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CodeChefProfileViewer = () => {
  const [username, setUsername] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    if (!username.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`http://localhost:4000/api/codechefs/${username}`);
      const data = await response.json();
      
      if (data.success) {
        setProfileData(data);
      } else {
        setError(data.error || 'Failed to fetch profile');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };



  const getStarColor = (stars) => {
    if (stars.includes('7')) return 'text-red-500';
    if (stars.includes('6')) return 'text-orange-500';
    if (stars.includes('5')) return 'text-yellow-500';
    if (stars.includes('4')) return 'text-green-500';
    if (stars.includes('3')) return 'text-blue-500';
    if (stars.includes('2')) return 'text-purple-500';
    if (stars.includes('1')) return 'text-gray-500';
    return 'text-gray-400';
  };

  const formatRatingData = (ratingData) => {
    return ratingData.map((item, index) => ({
      contest: index + 1,
      rating: parseInt(item.rating) || 0,
      date: new Date(item.end_date).toLocaleDateString(),
      contestName: item.name || `Contest ${index + 1}`
    }));
  };

const generateHeatmapGrid = (heatMapData) => {
    const grid = [];
    const today = new Date();
    const startDate = new Date(today.getTime() - (180 * 24 * 60 * 60 * 1000)); // 6 months = ~180 days
    
    for (let i = 0; i < 180; i++) {
      const currentDate = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000));
      const dateStr = currentDate.toISOString().split('T')[0];
      
      // Try to match date in different formats from heatMapData
      const submissions = heatMapData.find(item => {
        const itemDate = new Date(item.date).toISOString().split('T')[0];
        return itemDate === dateStr;
      })?.value || 0;
      
      grid.push({
        date: dateStr,
        count: submissions,
        intensity: submissions === 0 ? 0 : submissions <= 2 ? 1 : submissions <= 5 ? 2 : submissions <= 10 ? 3 : 4
      });
    }
    return grid;
  };

  const getResultIcon = (result) => {
    if (result && result.includes('tick-icon')) return '✅';
    if (result && result.includes('cross-icon')) return '❌';
    if (result && result.includes('partial')) return '🟡';
    if (result && result.includes('clock')) return '⏱️';
    return '⚪';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            CodeChef Profile Viewer
          </h1>
          <p className="text-gray-300">Analyze your competitive programming journey</p>
        </div>

        {/* Search Form */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  fetchProfile();
                }
              }}
              placeholder="Enter CodeChef username"
              className="w-full px-4 py-3 pl-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <button
              onClick={fetchProfile}
              disabled={loading}
              className="absolute right-2 top-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 transition-all duration-200"
            >
              {loading ? 'Loading...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-md mx-auto mb-8 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-center">
            {error}
          </div>
        )}

        {/* Profile Data */}
        {profileData && (
          <div className="max-w-7xl mx-auto space-y-8">
            {/* User Info Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <img
                    src={profileData.profile || '/api/placeholder/120/120'}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-purple-500"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-purple-500 rounded-full p-2">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-white mb-2">{profileData.name}</h2>
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start text-gray-300">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <span>{profileData.countryName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className={`w-4 h-4 ${getStarColor(profileData.stars)}`} />
                      <span>{profileData.stars}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl p-4">
                    <div className="text-2xl font-bold text-blue-400">{profileData.currentrating}</div>
                    <div className="text-sm text-gray-300">Current Rating</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-4">
                    <div className="text-2xl font-bold text-green-400">{profileData.highestRating}</div>
                    <div className="text-sm text-gray-300">Highest Rating</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl p-4">
                    <div className="text-2xl font-bold text-purple-400">{profileData.globalRank}</div>
                    <div className="text-sm text-gray-300">Global Rank</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl p-4">
                    <div className="text-2xl font-bold text-orange-400">{profileData.countryRank}</div>
                    <div className="text-sm text-gray-300">Country Rank</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rating Graph */}
            {profileData.ratingData && profileData.ratingData.length > 0 && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Rating Progress
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={formatRatingData(profileData.ratingData)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="contest" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F9FAFB'
                        }}
                        formatter={(value, name) => [`Rating: ${value}`, 'Contest Performance']}
                        labelFormatter={(label, payload) => {
                          if (payload && payload[0]) {
                            return `Contest: ${payload[0].payload.contestName}`;
                          }
                          return `Contest ${label}`;
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="rating"
                        stroke="#8B5CF6"
                        strokeWidth={3}
                        dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8, fill: '#A855F7' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

                 {/* Activity Heatmap */}
            {profileData.heatMap && profileData.heatMap.length > 0 && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Activity Heatmap (Last 6 Months)
                </h3>
                <div className="overflow-x-auto">
                  {/* Month Labels */}
                  <div className="grid gap-1 mb-2" style={{gridTemplateColumns: 'repeat(26, minmax(0, 1fr))'}}>
                    {Array.from({length: 26}, (_, weekIndex) => {
                      const today = new Date();
                      const startDate = new Date(today.getTime() - (180 * 24 * 60 * 60 * 1000));
                      const weekDate = new Date(startDate.getTime() + (weekIndex * 7 * 24 * 60 * 60 * 1000));
                      const monthName = weekDate.toLocaleString('default', { month: 'short' });
                      const isFirstWeekOfMonth = weekDate.getDate() <= 7;
                      
                      return (
                        <div key={weekIndex} className="text-xs text-gray-400 text-center h-4">
                          {isFirstWeekOfMonth ? monthName : ''}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Heatmap Grid */}
                  <div className="grid gap-1" style={{gridTemplateColumns: 'repeat(26, minmax(0, 1fr))'}}>
                    {(() => {
                      const heatmapData = generateHeatmapGrid(profileData.heatMap);
                      const weeks = [];
                      
                      // Group days into weeks (7 days each)
                      for (let i = 0; i < heatmapData.length; i += 7) {
                        const week = heatmapData.slice(i, i + 7);
                        weeks.push(week);
                      }
                      
                      return weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-1">
                          {week.map((day, dayIndex) => (
                            <div
                              key={`${weekIndex}-${dayIndex}`}
                              className={`w-4 h-4 rounded-md ${
                                day.intensity === 0 ? 'bg-gray-700' :
                                day.intensity === 1 ? 'bg-green-900' :
                                day.intensity === 2 ? 'bg-green-700' :
                                day.intensity === 3 ? 'bg-green-500' :
                                'bg-green-300'
                              }`}
                              title={`${new Date(day.date).toLocaleDateString()}: ${day.count} submissions`}
                            />
                          ))}
                        </div>
                      ));
                    })()}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 text-sm text-gray-400">
                  <span>Less</span>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 bg-gray-700 rounded-sm"></div>
                    <div className="w-3 h-3 bg-green-900 rounded-sm"></div>
                    <div className="w-3 h-3 bg-green-700 rounded-sm"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                    <div className="w-3 h-3 bg-green-300 rounded-sm"></div>
                  </div>
                  <span>More</span>
                </div>
              </div>
            )}

            {/* Recent Problems */}
            {profileData.recentProblems && profileData.recentProblems.length > 0 && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Recent Submissions
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {profileData.recentProblems.map((problem, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">{getResultIcon(problem.result)}</div>
                        <div>
                          <a
                            href={problem.problemLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-purple-400 font-medium flex items-center gap-2"
                          >
                            {problem.problemName}
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <div className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                            <Calendar className="w-3 h-3" />
                            {problem.time}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-300 bg-white/10 px-3 py-1 rounded-full">
                        {problem.language}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Last Updated */}
            <div className="text-center text-gray-400 text-sm">
              Last updated: {new Date(profileData.lastUpdated).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeChefProfileViewer;