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

               res.send({
              ...userData
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