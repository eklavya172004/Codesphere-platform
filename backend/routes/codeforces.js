

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

      res.status(200).json({
        success:true,
        data:userinfo
      })
    }else{
      res.status(404).json({
        success:false,
        error:"User not found"
      });
    }    
      
  } catch (error) {
    
  }
}