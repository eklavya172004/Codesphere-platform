// app/dashboard/codeforces/page.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Search, User, Trophy, Calendar, Code, Globe, Building, Users, Star, Clock } from 'lucide-react';

const Codeforces = () => {
  const [handle, setHandle] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUserData = async () => {
    if (!handle.trim()) {
      setError('Please enter a valid handle');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`http://localhost:4000/api/codeforces/${handle}`);
      const result = await response.json();
      
      if (result.success) {
        setUserData(result);
      } else {
        setError(result.error || 'User not found');
        setUserData(null);
      }
    } catch (err) {
      setError('Failed to fetch data. Make sure your backend is running on localhost:4000');
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };



  const getRankColor = (rank) => {
    if (!rank || rank === 'Unrated') return 'text-gray-400';
    if (rank.includes('newbie')) return 'text-gray-400';
    if (rank.includes('pupil')) return 'text-green-400';
    if (rank.includes('specialist')) return 'text-cyan-400';
    if (rank.includes('expert')) return 'text-blue-400';
    if (rank.includes('candidate master')) return 'text-purple-400';
    if (rank.includes('master')) return 'text-orange-400';
    if (rank.includes('grandmaster')) return 'text-red-400';
    return 'text-yellow-400';
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const generateHeatmapData = (heatmap) => {
    const data = [];
    const today = new Date();
    const startDate = new Date(today.getTime() - (365 * 24 * 60 * 60 * 1000));
    
    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      data.push({
        date: dateStr,
        count: heatmap[dateStr] || 0,
        day: d.getDay(),
        week: Math.floor((d - startDate) / (7 * 24 * 60 * 60 * 1000))
      });
    }
    return data;
  };

  const prepareContestData = (contests) => {
    return contests.map(contest => ({
      ...contest,
      date: formatDate(contest.time),
      contestName: contest.contestName.length > 20 
        ? contest.contestName.substring(0, 20) + '...' 
        : contest.contestName
    })).reverse();
  };

  const HeatmapCell = ({ count }) => {
    let intensity = '';
    if (count === 0) intensity = 'bg-gray-800';
    else if (count <= 2) intensity = 'bg-green-900';
    else if (count <= 5) intensity = 'bg-green-700';
    else if (count <= 10) intensity = 'bg-green-500';
    else intensity = 'bg-green-300';

    return (
      <div 
        className={`w-3 h-3 rounded-sm ${intensity} border border-gray-700`}
        title={`${count} submissions`}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-400 mb-4">Codeforces Dashboard</h1>
          
          {/* Search Form */}
          <div className="flex justify-center gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchUserData()}
                placeholder="Enter Codeforces handle"
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 w-64"
              />
            </div>
            <button
              onClick={fetchUserData}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg font-medium transition-colors"
            >
              {loading ? 'Loading...' : 'Search'}
            </button>
          </div>

          {error && (
            <div className="text-red-400 bg-red-900/20 border border-red-600 rounded-lg p-3 max-w-md mx-auto">
              {error}
            </div>
          )}
        </div>

        {userData && (
          <div className="space-y-8">
            {/* User Info */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center gap-6 mb-6">
                {userData.data.profile && (
                  <img 
                    src={userData.data.profile} 
                    alt="Profile" 
                    className="w-20 h-20 rounded-full border-2 border-blue-400"
                  />
                )}
                <div>
                  <h2 className="text-2xl font-bold text-blue-400">{userData.data.name}</h2>
                  <p className="text-gray-300">@{userData.data.username}</p>
                  <div className={`text-lg font-semibold ${getRankColor(userData.data.rank)}`}>
                    {userData.data.rank} ({userData.data.rating})
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm text-gray-300">Max Rating</span>
                  </div>
                  <div className="text-xl font-bold">{userData.data.maxRating}</div>
                  <div className={`text-sm ${getRankColor(userData.data.maxRank)}`}>
                    {userData.data.maxRank}
                  </div>
                </div>

                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-gray-300">Location</span>
                  </div>
                  <div className="text-lg font-semibold">{userData.data.city}</div>
                  <div className="text-sm text-gray-400">{userData.data.country}</div>
                </div>

                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="h-4 w-4 text-purple-400" />
                    <span className="text-sm text-gray-300">Organization</span>
                  </div>
                  <div className="text-lg font-semibold truncate">{userData.data.organization}</div>
                </div>

                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-gray-300">Friends</span>
                  </div>
                  <div className="text-xl font-bold">{userData.data.friendOfCount}</div>
                  <div className="text-sm text-gray-400">Contribution: {userData.data.contribution}</div>
                </div>
              </div>
            </div>

            {/* Recent Problems */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Code className="h-5 w-5 text-green-400" />
                Recent Solved Problems
              </h3>
              <div className="space-y-3">
                {userData.recentsolved.map((problem, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-blue-300">{problem.name}</h4>
                      <span className="text-sm text-gray-400">{formatTime(problem.time)}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {problem.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Rating: {problem.rating}</span>
                      <span className="text-gray-400">{problem.programmingLanguage}</span>
                      <a 
                        href={problem.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        View Problem →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Heatmap */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-400" />
                Activity Heatmap (Last Year)
              </h3>
              <div className="overflow-x-auto">
                <div className="grid grid-cols-53 gap-1 min-w-max">
                  {generateHeatmapData(userData.heatmap).map((day, index) => (
                    <HeatmapCell key={index} count={day.count} />
                  ))}
                </div>
                <div className="flex items-center justify-between mt-4 text-sm text-gray-400">
                  <span>Less</span>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 bg-gray-800 rounded-sm border border-gray-700"></div>
                    <div className="w-3 h-3 bg-green-900 rounded-sm"></div>
                    <div className="w-3 h-3 bg-green-700 rounded-sm"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                    <div className="w-3 h-3 bg-green-300 rounded-sm"></div>
                  </div>
                  <span>More</span>
                </div>
              </div>
            </div>

            {/* Contest Performance */}
            {userData.contests && userData.contests.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Rating Changes Chart */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400" />
                    Rating Progress
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={prepareContestData(userData.contests)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#9CA3AF"
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="newRating" 
                        stroke="#60A5FA" 
                        strokeWidth={2}
                        dot={{ fill: '#60A5FA', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Contest Rankings */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-orange-400" />
                    Contest Rankings
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={prepareContestData(userData.contests).slice(-10)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="contestName" 
                        stroke="#9CA3AF"
                        fontSize={10}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis 
                        stroke="#9CA3AF"
                        reversed={true}
                        domain={['dataMin', 'dataMax']}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                        formatter={(value, name) => [value, 'Rank']}
                      />
                      <Bar dataKey="rank" fill="#F59E0B" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Recent Contests Table */}
            {userData.contests && userData.contests.length > 0 && (
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-400" />
                  Recent Contests
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-600">
                        <th className="text-left py-2 px-3">Contest</th>
                        <th className="text-left py-2 px-3">Rank</th>
                        <th className="text-left py-2 px-3">Rating Change</th>
                        <th className="text-left py-2 px-3">New Rating</th>
                        <th className="text-left py-2 px-3">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userData.contests.slice(0, 10).map((contest, index) => (
                        <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/30">
                          <td className="py-2 px-3 font-medium">{contest.contestName}</td>
                          <td className="py-2 px-3">{contest.rank}</td>
                          <td className={`py-2 px-3 font-bold ${
                            contest.ratingChange > 0 ? 'text-green-400' : 
                            contest.ratingChange < 0 ? 'text-red-400' : 'text-gray-400'
                          }`}>
                            {contest.ratingChange > 0 ? '+' : ''}{contest.ratingChange}
                          </td>
                          <td className="py-2 px-3 font-semibold">{contest.newRating}</td>
                          <td className="py-2 px-3 text-gray-400">{formatDate(contest.time)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Codeforces;