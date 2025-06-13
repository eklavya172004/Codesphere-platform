exports.codeforces = async (req,res) => {
  try {
    
    const handle = req.params.handle;

    if(!handle){
      res.status(400).json({
        success:false,
        error:"Please provide a username"
      })
    }

    const response = await fetch(`https://codeforces.com/api/user.info?handles=${handle}&checkHistoricHandles=false`,{
      method:'GET',
      headers:{
        'Content-type':"application/json",
        'Referer' : 'https://codeforces.com'
      }
    })

        const data = await response.json();

        if(data.status === "OK" && data.result.length > 0){
          const result  = data.result[0];
            const userinfo = {
        name: (result.firstName || result.lastName) ? `${result.firstName || ""} ${result.lastName || ""}`.trim() : "Not Available",
        username: result.handle || "Not Available",
        profile: result.titlePhoto || "",
        city: result.city || "Not Available",
        country: result.country || "Not Available",
        rating: result.rating || 0,
        rank: result.rank || "Unrated",
        maxRating: result.maxRating || 0,
        maxRank: result.maxRank || "Unknown",
        organization: result.organization || "Not Available",
        contribution: result.contribution || 0,
        friendOfCount: result.friendOfCount || 0,
        lastOnline: result.lastOnlineTimeSeconds || 0,
      };

      const recentsubmission = await fetch(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10`);
      const submissionData = await recentsubmission.json();
 
      let recentsolved = [];
      let heatmap = {};
      let contests = [];

      if(submissionData.status === 'OK'){
        const problems = new Set();

        recentsolved = submissionData.result.filter((sub) => sub.verdict === 'OK')
                                            .filter((sub) =>{
                                              const key = `${sub.problem.contestId}-${sub.problem.index}`;
                                              if(problems.has(key)) return false;
                                              problems.add(key);
                                              return true;
                                            }).map((sub) =>( {
                                            name: sub.problem.name,
                                            contestId: sub.problem.contestId,
                                            index: sub.problem.index,
                                            tags: sub.problem.tags || [],
                                            rating: sub.problem.rating || "Unrated",
                                            link: `https://codeforces.com/contest/${sub.problem.contestId}/problem/${sub.problem.index}`,
                                            programmingLanguage: sub.programmingLanguage,
                                            time: sub.creationTimeSeconds,
                                            })).slice(0, 5);
                                              // This is a UNIX timestamp (in seconds), like 1717012345.JavaScript Date uses milliseconds, so we convert from seconds to milliseconds.
                                              //.toISOString()
                                              // Converts the Date object to a string like this:
                                              // "2025-06-01T13:45:00.000Z"
                                              //.split("T")[0]We only care about the date part, so we split at "T" and take the first part → "2025-06-01"
                                              //We convert the UNIX timestamp to a clean date string in YYYY-MM-DD format.

              submissionData.result.forEach((sub) => {
              const date = new Date(sub.creationTimeSeconds * 1000)
                  .toISOString()
                  .split("T")[0]; // YYYY-MM-DD
                heatmap[date] = (heatmap[date] || 0) + 1; //This builds an object that counts how many submissions were made on each day. If the date is already in the heatmap, it increments the count.If not, it initializes it to 1.
              });


              const contestResponse = await fetch(`https://codeforces.com/api/user.rating?handle=${handle}`);
              const contestData = await contestResponse.json();


              if (contestData.status === 'OK') {
              contests = contestData.result
                            .slice()
                            .reverse()
                            .slice(0,15)
                            .map(contest => ({
                contestId: contest.contestId,
                contestName: contest.contestName,
                rank: contest.rank,
                oldRating: contest.oldRating,
                newRating: contest.newRating,
                ratingChange: contest.newRating - contest.oldRating,
                time: contest.ratingUpdateTimeSeconds
              }));
           }
           
      }
      
      res.status(200).json({
        success:true,
        data:userinfo,recentsolved,heatmap,contests
      })
    }else{
      res.status(404).json({
        success:false,
        error:"User not found"
      });
    }    
      
  } catch (error) {
          console.error(error);
    return res.status(500).json({
      success: false,
      error: "Server error",
      details: error.message,
    });
  }
}