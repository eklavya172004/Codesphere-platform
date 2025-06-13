'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Trophy, Target, Zap, Calendar, Clock, Star, Award, TrendingUp, Flame, Activity } from 'lucide-react';

interface LeetCodeData {
  totalSolved: number;
  totalSubmissions: any;
  totalQuestions: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  ranking: number;
  contributionPoint: number;
  reputation: number;
  submissionCalendar: Record<string, number>;
  recentSubmissions: RecentSubmission[];
  matchedUserStats: any;
  gamificationScore?: {
    Totalpoints: number;
    dailyProblemPoints: number;
    streak: string;
  };
}

interface RecentSubmission {
  title: string;
  titleSlug: string;
  timestamp: number;
  statusDisplay: string;
  lang: string;
  __typename: string;
}

interface Contest {
  title: string;
  titleSlug: string;
  startTime: number;
  duration: number;
  originStartTime: number;
}

const Profile = () => {
  const [username, setUsername] = useState<string>('');
  const [userData, setUserData] = useState<LeetCodeData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [contests, setContests] = useState<Contest[]>([]);
  const [currentContestIndex, setCurrentContestIndex] = useState(0);
const [submissionData, setSubmissionData] = useState({});


  // Auto-rotate contests every 5 seconds
  useEffect(() => {
    if (contests.length > 1) {
      const interval = setInterval(() => {
        setCurrentContestIndex((prev) => (prev + 1) % contests.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [contests.length]);

//fetching the userleetcode profile if he already enterd 
useEffect(() => {
  const storedData = localStorage.getItem('user');
  if(storedData){
    try {
      const parseData = JSON.parse(storedData);

      if(parseData.leetcode_username){
        setUsername(parseData.leetcode_username);
        fetchUserData(parseData.leetcode_username);
      }
    } catch (err) {
      console.error('Error parsing stored user:', err);
    }
  }
},[]);

  // Function to fetch user data from backend
  const fetchUserData = async (username: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:4000/api/leetcode/${username}`);
      const data = await response.json();
      setUserData(data);

      // Fix: Parse the submission calendar properly
    const heatmapData = typeof data.submissionCalendar === 'string' 
      ? JSON.parse(data.submissionCalendar) 
      : data.submissionCalendar;

    setSubmissionData(heatmapData);

      // setsubmissionData(heatmap);
      console.log(submissionData);
      
    } catch (err) {
      setError('Failed to fetch user data. Please check the username and try again.');
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };
const getColorIntensity = (count: number) => {
  if (count === 0) return 'bg-gray-700';
  if (count <= 1) return 'bg-green-200'
  if (count <= 3) return 'bg-green-300';
  if (count <= 6) return 'bg-green-400';
  if (count <= 10) return 'bg-green-500';
  return 'bg-green-600';
};
const processedData = useMemo(() => {
  if (!submissionData || Object.keys(submissionData).length === 0) {
    return { entries: [], minDate: new Date(), maxDate: new Date(), dataMap: new Map(), maxCount: 0 };
  }

  // Convert timestamps to dates and find min/max
  const entries = Object.entries(submissionData).map(([timestamp, count]) => ({
    date: new Date(parseInt(timestamp) * 1000),
    count: count as number
  })).sort((a, b) => a.date.getTime() - b.date.getTime());

  if (entries.length === 0) {
    return { entries: [], minDate: new Date(), maxDate: new Date(), dataMap: new Map(), maxCount: 0 };
  }

  const minDate = entries[0].date;
  const maxDate = entries[entries.length - 1].date;
  
  // Create a map for quick lookup
  const dataMap = new Map();
  entries.forEach(({ date, count }) => {
    const dateStr = date.toDateString();
    dataMap.set(dateStr, count);
  });

  // Find max count for color scaling
  const maxCount = Math.max(...entries.map(e => e.count));

  return { entries, minDate, maxDate, dataMap, maxCount };
}, [submissionData]);

const generateCalendarGrid = () => {
  if (processedData.entries.length === 0) return [];
  
  const weeks = [];
  const startDate = new Date(processedData.minDate);
  const endDate = new Date(processedData.maxDate);
  
  // Start from the beginning of the week containing the first date
  const currentDate = new Date(startDate);
  currentDate.setDate(currentDate.getDate() - currentDate.getDay());

  while (currentDate <= endDate) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      const dateStr = currentDate.toDateString();
      const count = processedData.dataMap.get(dateStr) || 0;
      const isInRange = currentDate >= startDate && currentDate <= endDate;
      
      week.push({
        date: new Date(currentDate),
        count: isInRange ? count : 0,
        isInRange,
        dateStr: currentDate.toLocaleDateString()
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    weeks.push(week);
  }
  
  return weeks;
};

  const weeks = generateCalendarGrid();
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const stats = useMemo(() => {
  if (processedData.entries.length === 0) {
    return { total: 0, avgPerDay: '0.0', maxDay: { count: 0, date: new Date() } };
  }

  const total = processedData.entries.reduce((sum, entry) => sum + entry.count, 0);
  const avgPerDay = (total / processedData.entries.length).toFixed(1);
  const maxDay = processedData.entries.reduce((max, entry) => 
    entry.count > max.count ? entry : max, processedData.entries[0]);
  
  return { total, avgPerDay, maxDay };
}, [processedData]);

  // Fetch contests data
  useEffect(() => {
    const fetchContest = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/leetcode/contest');
        const data = await response.json();
        setContests(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load contests:', error);
      }
    };

    fetchContest();
  }, []);

  const formatDate = (unixSeconds: number) => {
    if (!unixSeconds) return 'Invalid date';
    const date = new Date(unixSeconds * 1000);
    if (isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  const handleSubmit = () => {
    if (username.trim()) {
      fetchUserData(username);
    }
  };

  const getProblemDifficultyData = () => {
    if (!userData) return [];
    
    return [
      { name: 'Easy', value: userData.easySolved, fill: '#00af9b' },
      { name: 'Medium', value: userData.mediumSolved, fill: '#ffb800' },
      { name: 'Hard', value: userData.hardSolved, fill: '#ff2d55' }
    ];
  };

  const lastSubmissionDate = userData?.recentSubmissions.length
    ? new Date(userData.recentSubmissions[0].timestamp * 1000).toLocaleString()
    : "No submissions yet";

  const getGamificationLevel = (points: number) => {
    if (points >= 100) return { level: "Expert", color: "text-purple-400", bgColor: "bg-purple-900" };
    if (points >= 50) return { level: "Advanced", color: "text-blue-400", bgColor: "bg-blue-900" };
    if (points >= 20) return { level: "Intermediate", color: "text-green-400", bgColor: "bg-green-900" };
    return { level: "Beginner", color: "text-gray-400", bgColor: "bg-gray-700" };
  };




  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
            LeetCode Profile Viewer
          </h1>
          <p className="text-gray-400 text-lg">Track your coding journey with style</p>
        </div>

        {/* Animated Contest Announcements */}
        {contests.length > 0 && (
          <div className="mb-8 relative overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 shadow-2xl border border-orange-400/20">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="text-yellow-300 animate-pulse" size={28} />
                <h2 className="text-2xl font-bold text-white">🔥 Upcoming Contests</h2>
                <div className="flex gap-1 ml-auto">
                  {contests.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentContestIndex ? 'bg-white' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="relative h-20 overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentContestIndex * 100}%)` }}
                >
                  {contests.map((contest, index) => (
                    <div key={contest.titleSlug} className="w-full flex-shrink-0">
                      <a
                        href={`https://leetcode.com/contest/${contest.titleSlug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block hover:scale-105 transition-transform duration-200"
                      >
                        <h3 className="text-xl font-bold text-white mb-2 hover:text-yellow-200">
                          {contest.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-orange-100">
                          <span className="flex items-center gap-1">
                            <Clock size={16} />
                            {formatDate(contest.startTime)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Target size={16} />
                            {formatDuration(contest.duration)}
                          </span>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Form */}
        <div className="mb-8 flex justify-center">
          <div className="w-full max-w-md" onSubmit={handleSubmit}>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter LeetCode username"
                className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                required
              />
              <button
                type="button"
                onClick={handleSubmit}
                className="absolute right-2 top-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 font-medium"
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-6 py-4 rounded-xl mb-6 backdrop-blur-sm">
            {error}
          </div>
        )}

        {userData && (
          <div className="space-y-8">
            {/* Profile Header */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-700">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold">{username.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">@{username}</h2>
                  <p className="text-gray-400">LeetCode Profile</p>
                </div>
              </div>

              {/* Gamification Section */}
              {userData.gamificationScore && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Zap className="text-yellow-400" />
                    Gamification Stats
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 p-6 rounded-xl border border-yellow-500/20">
                      <div className="flex items-center gap-3 mb-2">
                        <Star className="text-yellow-400" size={24} />
                        <h4 className="text-lg font-semibold">Total Points</h4>
                      </div>
                      <p className="text-3xl font-bold text-yellow-400">{userData.gamificationScore.Totalpoints}</p>
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${getGamificationLevel(userData.gamificationScore.Totalpoints).bgColor} ${getGamificationLevel(userData.gamificationScore.Totalpoints).color}`}>
                        {getGamificationLevel(userData.gamificationScore.Totalpoints).level}
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 p-6 rounded-xl border border-green-500/20">
                      <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="text-green-400" size={24} />
                        <h4 className="text-lg font-semibold">Daily Points</h4>
                      </div>
                      <p className="text-3xl font-bold text-green-400">{userData.gamificationScore.dailyProblemPoints}</p>
                      <p className="text-sm text-gray-400 mt-1">Today's Progress</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-red-900/50 to-pink-900/50 p-6 rounded-xl border border-red-500/20">
                      <div className="flex items-center gap-3 mb-2">
                        <Flame className="text-red-400" size={24} />
                        <h4 className="text-lg font-semibold">Streak Status</h4>
                      </div>
                      <p className={`text-3xl font-bold ${userData.gamificationScore.streak === 'Yes' ? 'text-red-400' : 'text-gray-400'}`}>
                        {userData.gamificationScore.streak === 'Yes' ? '🔥 Active' : '❄️ Inactive'}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        {userData.gamificationScore.streak === 'Yes' ? 'Keep it up!' : 'Start solving!'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-900/50 to-indigo-900/50 p-6 rounded-xl border border-blue-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Trophy className="text-blue-400" size={24} />
                    <h3 className="text-lg font-semibold">Global Ranking</h3>
                  </div>
                  <p className="text-3xl font-bold text-blue-400">#{userData.ranking.toLocaleString()}</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 p-6 rounded-xl border border-purple-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="text-purple-400" size={24} />
                    <h3 className="text-lg font-semibold">Problems Solved</h3>
                  </div>
                  <p className="text-3xl font-bold text-purple-400">
                    {userData.totalSolved} / {userData.totalQuestions}
                  </p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${(userData.totalSolved / userData.totalQuestions) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-900/50 to-teal-900/50 p-6 rounded-xl border border-green-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="text-green-400" size={24} />
                    <h3 className="text-lg font-semibold">Last Activity</h3>
                  </div>
                  <p className="text-sm text-green-400 font-medium">{lastSubmissionDate}</p>
                </div>
              </div>
            </div>

            {/* Problem Difficulty Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-700">
                <h3 className="text-2xl font-bold mb-6">Difficulty Breakdown</h3>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-green-900/30 to-green-800/30 p-4 rounded-xl border border-green-500/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-green-400 font-semibold">Easy</span>
                      <span className="text-white font-bold">{userData.easySolved} / {userData.totalEasy}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${(userData.easySolved / userData.totalEasy) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-yellow-900/30 to-orange-800/30 p-4 rounded-xl border border-yellow-500/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-yellow-400 font-semibold">Medium</span>
                      <span className="text-white font-bold">{userData.mediumSolved} / {userData.totalMedium}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-yellow-500 to-orange-400 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${(userData.mediumSolved / userData.totalMedium) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-red-900/30 to-pink-800/30 p-4 rounded-xl border border-red-500/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-red-400 font-semibold">Hard</span>
                      <span className="text-white font-bold">{userData.hardSolved} / {userData.totalHard}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-red-500 to-pink-400 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${(userData.hardSolved / userData.totalHard) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-700">
                <h3 className="text-2xl font-bold mb-6">Problem Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getProblemDifficultyData()}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {getProblemDifficultyData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value} problems`, 'Solved']}
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#ffffff'
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
   {processedData.entries.length > 0 && (
  <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl  shadow-xl p-8 border border-gray-700 mb-8">
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-white mb-2">Submission Calendar</h2>
      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
        <span>Total submissions: <strong className="text-white">{stats.total}</strong></span>
        <span>Average per day: <strong className="text-white">{stats.avgPerDay}</strong></span>
        <span>Peak day: <strong className="text-white">{stats.maxDay.count} submissions</strong> on {stats.maxDay.date.toLocaleDateString()}</span>
      </div>
    </div>

    <div className="">
      <div className="relative w-full">
        {/* Month labels */}
    <div className="flex mb-8 ">
  {(() => {
    const monthLabels = [];
    const weeks = generateCalendarGrid();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Calculate total available width for spreading
    const totalWeeks = weeks.length;
    const dayLabelWidth = 48; // ml-12 = 48px
    
    // Track which months we've already placed to avoid duplicates
    const placedMonths = new Set();
    
    weeks.forEach((week, weekIndex) => {
      // Check the first day of the week that's in our data range
      const validDay = week.find(day => day.isInRange);
      
      if (validDay) {
        const month = validDay.date.getMonth();
        const year = validDay.date.getFullYear();
        const monthYear = `${month}-${year}`;
        
        // Place month label if:
        // 1. We haven't placed this month-year combination yet
        // 2. It's the first week of the month (date <= 7) OR it's the first week we encounter this month
        const dayOfMonth = validDay.date.getDate();
        const isFirstWeekOfMonth = dayOfMonth <= 7;
        const isFirstOccurrence = !placedMonths.has(monthYear);
        
        if (isFirstOccurrence && (isFirstWeekOfMonth || weekIndex % 2 === 0))
 {
          placedMonths.add(monthYear);
          
          // Calculate position based on spread across full width
          const positionPercent = (weekIndex / Math.max(totalWeeks - 1, 1)) * 100;
          
          monthLabels.push(
            <div 
              key={`month-${monthYear}-${weekIndex}`}
              className="text-xs text-gray-400 font-medium absolute"
              style={{ 
                 left: `${positionPercent}%`,
                  width: '40px',
                  textAlign: 'left',
                  transform: 'translateX(-50%)'
                
              }}
            >
              {monthNames[month]}
            </div>
          );
        }
      }
    });
    
    // Ensure we have labels for all months in the range
    if (processedData.entries.length > 0) {
      const startDate = new Date(processedData.minDate);
      const endDate = new Date(processedData.maxDate);
      
      // Fill in any missing months
      for (let d = new Date(startDate); d <= endDate; d.setMonth(d.getMonth() + 1)) {
        const month = d.getMonth();
        const year = d.getFullYear();
        const monthYear = `${month}-${year}`;
        
        if (!placedMonths.has(monthYear)) {
          // Find the appropriate week index for this month
          const weekIndex = weeks.findIndex(week => {
            const validDay = week.find(day => day.isInRange);
            return validDay && validDay.date.getMonth() === month && validDay.date.getFullYear() === year;
          });
          
          if (weekIndex !== -1) {
            placedMonths.add(monthYear);
            const positionPercent = (weekIndex / Math.max(totalWeeks - 1, 1)) * 100;
            
            monthLabels.push(
              <div 
                key={`month-missing-${monthYear}`}
                className="text-xs text-gray-400 font-medium absolute"
                style={{ 
                  left: `${positionPercent}%`,
                  width: '60px',
                  textAlign: 'left',
                  transform: 'translateX(-50%)'
                }}
              >
                {monthNames[month]}
              </div>
            );
          }
        }
      }
    }
    
    return (
       <div className="absolute top-0 left-16 right-0 h-6">
        {monthLabels.sort((a, b) => {
          // Sort by left position to ensure proper order
          const leftA = parseFloat(a.props.style.left);
          const leftB = parseFloat(b.props.style.left);
          return leftA - leftB;
        })}
      </div>
    );
  })()}
</div>

        {/* Calendar grid */}
        <div className="flex w-full">
          {/* Day labels */}
          <div className="flex flex-col mr-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
              <div key={day} className="h-5 mb-2 text-xs text-gray-400 w-10 flex items-center justify-end pr-2">
                {index % 2 === 1 ? day : ''}
              </div>
            ))}
          </div>

          {/* Week columns - spread across full width */}
          <div className="flex-1">
            <div className="flex justify-between w-full">
              {generateCalendarGrid().map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col">
                  {week.map((day, dayIndex) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`w-5 h-5 mb-2 rounded-sm border border-gray-600 ${
                        day.isInRange ? getColorIntensity(day.count) : 'bg-gray-700'
                      } hover:ring-2 hover:ring-blue-300 hover:scale-110 cursor-pointer transition-all duration-200`}
                      title={`${day.dateStr}: ${day.count} submissions`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Legend */}
    <div className="mt-6 flex items-center justify-between">
      <div className="flex items-center space-x-3 text-sm text-gray-400">
        <span>Less</span>
        <div className="flex space-x-1">
          <div className="w-5 h-5 bg-gray-700 rounded-sm border border-gray-600"></div>
          <div className="w-5 h-5 bg-green-200 rounded-sm border border-gray-600"></div>
          <div className="w-5 h-5 bg-green-300 rounded-sm border border-gray-600"></div>
          <div className="w-5 h-5 bg-green-400 rounded-sm border border-gray-600"></div>
          <div className="w-5 h-5 bg-green-500 rounded-sm border border-gray-600"></div>
          <div className="w-5 h-5 bg-green-600 rounded-sm border border-gray-600"></div>
        </div>
        <span>More</span>
      </div>
      <div className="text-sm text-gray-400 font-medium">
        {processedData.minDate.toLocaleDateString()} - {processedData.maxDate.toLocaleDateString()}
      </div>
    </div>
  </div>
)}

            {/* Recent Submissions */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-700">
              <h3 className="text-2xl font-bold mb-6">Recent Submissions</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="px-6 py-4 text-left text-gray-300 font-semibold">Problem</th>
                      <th className="px-6 py-4 text-left text-gray-300 font-semibold">Status</th>
                      <th className="px-6 py-4 text-left text-gray-300 font-semibold">Language</th>
                      <th className="px-6 py-4 text-left text-gray-300 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData.recentSubmissions.slice(0, 5).map((submission, index) => (
                      <tr 
                        key={index} 
                        className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors duration-200"
                      >
                        <td className="px-6 py-4">
                          <a
                            href={`https://leetcode.com/problems/${submission.titleSlug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 hover:underline font-medium"
                          >
                            {submission.title}
                          </a>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            submission.statusDisplay === 'Accepted' 
                              ? 'bg-green-900/50 text-green-300 border border-green-500/30' 
                              : 'bg-red-900/50 text-red-300 border border-red-500/30'
                          }`}>
                            {submission.statusDisplay}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-300">{submission.lang}</td>
                        <td className="px-6 py-4 text-gray-400">
                          {new Date(submission.timestamp * 1000).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;