const e = require("express");

const query = `
  query getUserProfile($username: String!) {
    allQuestionsCount {
      difficulty
      count
    }
    matchedUser(username: $username) {
      contributions {
        points
      }
      profile {
        reputation
        ranking
      }
      submissionCalendar
      submitStats {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
        totalSubmissionNum {
          difficulty
          count
          submissions
        }
      }
    }
    recentSubmissionList(username: $username) {
      title
      titleSlug
      timestamp
      statusDisplay
      lang
      __typename
    }
    matchedUserStats: matchedUser(username: $username) {
      submitStats: submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
          submissions
          __typename
        }
        totalSubmissionNum {
          difficulty
          count
          submissions
          __typename
        }
        __typename
      }
    }
  }
`;

const contestQuery = `
  query {
    upcomingContests {
      title
      titleSlug
      startTime
      duration
      originStartTime
    }
  }
`;

const contestData = (data) => {
  return data.upcomingContests.map(contest => (
    {
      title: contest.title,
      titleSlug: contest.titleSlug,
      startTime: contest.startTime,
      duration: contest.duration,
      originStartTime: contest.originStartTime
    }
  ))
}

//fetching user contests if he participated
// const fetchUserContest = async (username) => {
//   try {
//     const res = await fetch(`https://leetcode.com/contest/api/user-rank/${username}/`,{
//           headers: {
//       'Referer': `https://leetcode.com/${username}/`,
//       'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36'
//     }
//     });

//     if (!res.ok) {
//       console.warn(`User contest data not available for: ${username}`);
//       return null;
//     }

//     const data = await res.json();
//     console.log(data)
//     return {
//       attended: data.attended,
//       ranking: data.ranking,
//       score: data.score,
//       finishTimeSeconds: data.finish_time_in_seconds,
//       contestTitle: data.contest?.title,
//       contestSlug: data.contest?.contest_slug,
//       startTime: data.contest?.start_time
//     };
//   } catch (err) {
//     console.error("Error fetching user contest data:", err.message);
//     return null; // Return null instead of throwing
//   }
// };

const fetchedData = (data) =>  {
    const senddata = {
        totalSolved: data.matchedUser.submitStats.acSubmissionNum[0].count,
        totalSubmissions:  data.matchedUser.submitStats.totalSubmissionNum,
        totalQuestions: data.allQuestionsCount[0].count,
        easySolved: data.matchedUser.submitStats.acSubmissionNum[1].count,
        totalEasy: data.allQuestionsCount[1].count,
        mediumSolved: data.matchedUser.submitStats.acSubmissionNum[2].count,
        totalMedium: data.allQuestionsCount[2].count,
        hardSolved: data.matchedUser.submitStats.acSubmissionNum[3].count,
        totalHard: data.allQuestionsCount[3].count,
        ranking: data.matchedUser.profile.ranking,
        contributionPoint: data.matchedUser.contributions.points,
        reputation: data.matchedUser.profile.reputation,
        submissionCalendar: JSON.parse(data.matchedUser.submissionCalendar),
        recentSubmissions: data.recentSubmissionList,
        matchedUserStats: data.matchedUser.submitStats
    }
    return senddata;
}

// Export the API endpoint handler function
exports.leetcode = async (req, res) => {
  let user = req.params.id;

  try {
      const graphqlRes =  await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Referer': 'https://leetcode.com'
    },
    body: JSON.stringify({
      query: query, 
      variables: {username: user}
    }),
  })

      
    const graphqlData = await graphqlRes.json();

    
    if (graphqlData.errors) {
      return res.status(400).send(graphqlData);
    }

        const userData = await fetchedData(graphqlData.data);

          //  let contestInfo = null;

          //  try {
            
          //   contestInfo = fetchUserContest(user);

          //  } catch (error) {
          //     console.warn("Could not fetch contest info for user:", user);
          //  }
        const scoreDetails  = await calculateGamification(userData);


        // console.log(userData,scoreDetails);
               res.send({
              ...userData,
              gamificationScore: scoreDetails
                  });
  } catch (error) {
        console.error('LeetCode API Error:', err);
         res.status(500).send({ error: 'Failed to fetch LeetCode user data.' });
  }
};

exports.contest = (req,res) => {
    // console.log("Received request for contest data"); 
  fetch("https://leetcode.com/graphql",{
    method:'POST',
    headers:{
      'Content-Type': 'application/json',
      'Referer': 'https://leetcode.com'
    },
      body: JSON.stringify({
      query: contestQuery, 
    }),
  })
  .then(result => result.json())
  .then(data => {

      // console.log("Raw contest data from LeetCode:", JSON.stringify(data, null, 2)); // Raw data


    if(data.errors){
      res.send(data)
    }else{
      res.send(contestData(data.data))
    }
  }).catch(err => {
    console.error('Error', err);
    res.send(err);
  })
}

//checking if the user has recently solved problem
const getProblemSolvedToday = (recentSubmissions) => {
  const now = Date.now()/1000;
  const OneDayAgo = now - 24*60*60;
  //converts the current time from milliseconds to seconds, so you can accurately compare it with sub.timestamp, which is already in seconds.
  return recentSubmissions.filter(sub => parseInt(sub.timestamp) >= OneDayAgo && sub.statusDisplay === 'Accepted');
}

//streak maintained 
const dailyStreak = (submissionCalendar) => {
  const submissionDates = new Set(
    Object.keys(submissionCalendar).map(ts =>
      new Date(parseInt(ts) * 1000).toISOString().slice(0, 10) // 'YYYY-MM-DD'
    )
  );

  const now = new Date();
  now.setUTCHours(0, 0, 0, 0); // Normalize to UTC midnight

  let streak = 0;

  // Check for yesterday, day before, and 3 days ago (excluding today)
  for (let i = 1; i <= 2; i++) {
    const day = new Date(now);
    day.setUTCDate(now.getUTCDate() - i);

    const dateStr = day.toISOString().slice(0, 10);

    if (submissionDates.has(dateStr)) {
      streak++;
    } else {
      return false; // streak broken
    }
  }

  return true;
};

const calculateGamification = (userData) => {
  const recentAccepted = getProblemSolvedToday(userData.recentSubmissions);
  const streak = dailyStreak(userData.submissionCalendar);
  let totalpoints = 0 ;
  // for( let sub of recentAccepted){
  //   if(sub.difficulty === "Hard"){
  //     totalpoints += 20;
  //   }else if(sub.difficulty === "Medium") totalpoints += 15;
  //   else if (sub.difficulty === "Easy") totalpoints += 10;
  // }

  if(streak){
    totalpoints += 10;
  }

  return {
    Totalpoints:totalpoints + recentAccepted.length * 10,
    dailyProblemPoints: recentAccepted.length * 10,
    streak: streak ? "Yes" : "No",
  }
}