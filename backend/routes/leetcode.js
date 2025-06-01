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
exports.leetcode = (req, res) => {
  let user = req.params.id;
  
  fetch('https://leetcode.com/graphql', {
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
  .then(result => 
    result.json()
  )
  .then(data => {
    if(data.errors){
      res.send(data);
    } else {
      res.send(fetchedData(data.data));
    }
  })
  .catch(err => {
    console.error('Error', err);
    res.send(err);
  });
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