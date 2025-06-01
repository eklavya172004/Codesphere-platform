
'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 
  CalendarHeatmap  from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

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
}

interface RecentSubmission {
  title: string;
  titleSlug: string;
  timestamp: number;
  statusDisplay: string;
  lang: string;
  __typename: string;
}

interface CalendarData {
  date: string;
  count: number;
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
  const [calendarData, setCalendarData] = useState<CalendarData[]>([]);
    const [contests, setContests] = useState<Contest[]>([]);
//   const [error, setError] = useState<string | null>(null);

  // Function to fetch user data from our backend
  const fetchUserData = async (username: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`http://localhost:4000/api/leetcode/${username}`);
      setUserData(response.data);
      
      // Process calendar data for heatmap
      if (response.data.submissionCalendar) {
        const formattedData = Object.entries(response.data.submissionCalendar).map(
          ([date, count]) => ({
            date: new Date(parseInt(date) * 1000).toISOString().split('T')[0],
            count: count as number
          })
        );
        setCalendarData(formattedData);
      }
    } catch (err) {
      setError('Failed to fetch user data. Please check the username and try again.');
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch contests data from our backend
 useEffect(() => {
  const fetchContest = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/leetcode/contest');
      const data = await response.json();

      if(data?.data?.upcomingContests){
        setContests(data.data.upcomingContests);
        // console.log('Contests:', data.data.upcomingContests);
      }
      setContests(data);
    } catch (error) {
      console.error('Failed to load contests:', error);
    }
  };

  fetchContest();
}, []);

const formatDate = (unixSeconds: number) => {
     console.log('formatDate called with:', unixSeconds);
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

  // Calculate time remaining until contest start
 

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      fetchUserData(username);
    }
  };

  // Prepare data for problem difficulty pie chart
  const getProblemDifficultyData = () => {
    if (!userData) return [];
    
    return [
      { name: 'Easy', value: userData.easySolved, fill: '#00af9b' },
      { name: 'Medium', value: userData.mediumSolved, fill: '#ffb800' },
      { name: 'Hard', value: userData.hardSolved, fill: '#ff2d55' }
    ];
  };

  // Calculate solve rates

  const lastSubmissionDate = userData?.recentSubmissions.length
  ? new Date(userData.recentSubmissions[0].timestamp * 1000).toLocaleString()
  : "No submissions yet";


 

  return (
    <div className="container mx-auto px-4 py-8">

      <h1 className="text-3xl font-bold mb-6 text-center">LeetCode Profile Viewer</h1>
        {/* contest details */}
          {error && <p className="text-red-600">{error}</p>}

      {contests.map((contest) => (
        <div key={contest.titleSlug} className="p-4 mb-4 border rounded shadow-sm">
          <a
            href={`https://leetcode.com/contest/${contest.titleSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 text-lg font-medium hover:underline"
          >
            {contest.title}
          </a>
           <p>
      <strong>Starts:</strong> {formatDate(contest.startTime)}
    </p>
          <p><strong>Duration:</strong> {formatDuration(contest.duration)}</p>
        </div>
      ))}
        
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="mb-8 flex justify-center">
        <div className="flex w-full max-w-md">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter LeetCode username"
            className="flex-grow px-4 py-2 border rounded-l"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-r"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Search'}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {userData && (
        <div className="rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Profile: {username}</h2>
          
          {/* Stats Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className=" p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Ranking</h3>
              <p className="text-3xl font-bold">{userData.ranking.toLocaleString()}</p>
            </div>
            <div className=" p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Problems Solved</h3>
              <p className="text-3xl font-bold">
                {userData.totalSolved} / {userData.totalQuestions}
              </p>
            </div>
            <div className=" p-4 rounded-lg">
             <p className="text-gray-600 mb-4">
                Last Problem Solved On: <strong>{lastSubmissionDate}</strong>
                </p>
            </div>
          </div>
          
          {/* Problem Difficulty Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Problem Difficulty Breakdown</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="p-3 bg-green-700 rounded">
                  <p className="text-xs font-medium">Easy</p>
                  <p className="text-lg font-bold">
                    {userData.easySolved} / {userData.totalEasy}
                  </p>
                </div>
                <div className="p-3 bg-yellow-600 rounded">
                  <p className="text-xs font-medium">Medium</p>
                  <p className="text-lg font-bold">
                    {userData.mediumSolved} / {userData.totalMedium}
                  </p>
                </div>
                <div className="p-3 bg-red-600 rounded">
                  <p className="text-xs font-medium">Hard</p>
                  <p className="text-lg font-bold">
                    {userData.hardSolved} / {userData.totalHard}
                  </p>
                </div>
              </div>
            </div>
            
            <div className=''>
              {/* <h3 className="text-xl font-semibold ">Problem Distribution</h3> */}
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
                    <Tooltip formatter={(value) => [`${value} problems`, 'Solved']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Submission Calendar Heatmap */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Submission Activity</h3>
            <div className=" p-4 rounded-lg">
              <CalendarHeatmap
                startDate={new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)}
                endDate={new Date()}
                values={calendarData}
                classForValue={(value) => {
                  if (!value || value.count === 0) return 'color-empty';
                  if (value.count < 3) return 'color-scale-1';
                  if (value.count < 6) return 'color-scale-2';
                  if (value.count < 9) return 'color-scale-3';
                  return 'color-scale-4';
                }}
                tooltipDataAttrs={(value: any) => {
                  if (!value || !value.date) {
                    return null;
                  }
                  return {
                    'data-tip': `${value.date}: ${value.count} submissions`
                  };
                }}
              />
              <style jsx>{`
                :global(.color-empty) { fill: #ebedf0; }
                :global(.color-scale-1) { fill: #9be9a8; }
                :global(.color-scale-2) { fill: #40c463; }
                :global(.color-scale-3) { fill: #30a14e; }
                :global(.color-scale-4) { fill: #216e39; }
              `}</style>
            </div>
          </div>
          
          {/* Recent Submissions */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Recent Submissions</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-800">
                    <th className="px-4 py-2 text-left">Problem</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Language</th>
                    <th className="px-4 py-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {userData.recentSubmissions.slice(0,5).map((submission, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-600' : 'bg-gray-500'}>
                      <td className="px-4 py-2">
                        <a
                          href={`http://leetcode.com/problems/${submission.titleSlug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-200 hover:underline"
                        >
                          {submission.title}
                        </a>
                      </td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          submission.statusDisplay === 'Accepted' 
                            ? 'bg-green-600 text-black' 
                            : 'bg-red-500 text-red-800'
                        }`}>
                          {submission.statusDisplay}
                        </span>
                      </td>
                      <td className="px-4 py-2">{submission.lang}</td>
                      <td className="px-4 py-2">
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
  );
};

export default Profile;