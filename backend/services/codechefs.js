const { JSDOM } = require("jsdom");
const fetch = require("node-fetch");

const ftech = async (handle) => {
    try {
        const resdata = await fetch(`https://www.codechef.com/users/${handle}`);
        // const url = `https://www.codechef.com/recent/user?page=0&user_handle=${handle}`

        if (resdata.status === 200) {
            const d = await resdata.text();

        const heatMapRegex = /var userDailySubmissionsStats\s*=\s*(\[[\s\S]*?\]);/;
        //will search for this line in the html and we are doing this using regrex which is a bit tricky but better approached
        //\s = any whitespace character (space, tab, newline)
        //* = zero or more occurrences  Matches optional spaces after the variable name
        //(\[[\s\S]*?\]) - This is the capture group:
        //( = Start of capture group (captures the JSON data)
        //\[ = Matches literal opening square bracket [
        //[\s\S]*? = Matches any character (including newlines)
        //[\s\S] = whitespace OR non-whitespace (essentially any character)
        //Non-greedy (*?): Stops at the first ] it finds, preventing it from matching too much
      
        const match = d.match(heatMapRegex);
        let headMapData = {};

            if (match && match[1]) {
                    headMapData = JSON.parse(match[1]);
                    // console.log("Parsed heatmap data:", headMapData);
            }
            //we got the heatmap data


            //now we need to get the rating and rank
        const ratingRegex = /var\s+all_rating\s*=\s*(\[[\s\S]*?\]);/;
        const match2 = d.match(ratingRegex);
        let ratingData = {};

        if (match2 && match2[1]) {
        
            ratingData = JSON.parse(match2[1]);

            if (ratingData.length === 0) {
                console.log("User has not participated in any contests.");
            } else {
                // console.log("Parsed rating data:", ratingData);
            }
            }

// getting and sending the user details thorugh dom manupilation

        const dom = new JSDOM(d);
        const document = dom.window.document;
        
        
        
        const userprofile = document.querySelector('.user-details-container');
        const ratingSection  = document.querySelector(".rating-number")?.parentNode;
        const ranks = document.querySelector(".rating-ranks")?.children?.[0];
        const recentSubmissionsUrl = `https://www.codechef.com/recent/user?page=0&user_handle=${handle}`;
        const recentProblems = [];
//You observed how CodeChef's website internally works (using browser DevTools, network inspector, or looking at its HTML/JS), and figured out a hidden or undocumented API endpoint that the site uses to fetch recent user submissions.

            const recentRes = await fetch(recentSubmissionsUrl);
            if (recentRes.status !== 200) {
            return { success: false, status: recentRes.status, error: "Could not fetch recent submissions" };
            }
            const recentJson = await recentRes.json();

            // recentJson contains recent submissions in 'content' field as HTML string
            // Parse it with JSDOM to extract rows
            const recentDom = new JSDOM(recentJson.content);
            const recentDocument = recentDom.window.document;
            const recentSubmissionList = recentDocument.querySelectorAll("table.dataTable tbody tr");


                    //fetching the recent problems
        recentSubmissionList?.forEach((row) => {
            const cols = row.querySelectorAll("td");
            const time = cols[0]?.getAttribute("title") || "";
            const link = cols[1]?.querySelector("a");
            const img = cols[2]?.querySelector("span img");
            const imgSrc = img ? img.getAttribute("src") : null;
            const language = cols[3]?.getAttribute("title") || "";
            const problemName = link?.textContent?.trim() || "";
            const problemLink = link ? `https://www.codechef.com${link.getAttribute("href")}` : "";

            recentProblems.push({
                time,
                problemLink,
                result:imgSrc,
                language,
                problemName
            })
        });

        return {
        success: true,
        status: resdata.status,
        profile:userprofile?.children?.[0]?.children?.[0]?.src || "",
        name:userprofile?.children?.[0]?.children?.[1]?.textContent?.trim() || "Not Available",
        currentrating:parseInt(document.querySelector(".rating-number")?.textContent?.trim()) || 0,
       highestRating: parseInt(ratingSection?.children?.[4]?.textContent?.split("Rating")[1]?.trim()) || 0,
        countryFlag: document.querySelector(".user-country-flag")?.src || "",
        countryName: document.querySelector(".user-country-name")?.textContent?.trim() || "Unknown",
        globalRank: parseInt(
                    ranks?.children?.[0]?.children?.[0]?.children?.[0]?.innerHTML?.replace(/[^\d]/g, "")
                ) || 0,
        countryRank: parseInt(
                    ranks?.children?.[1]?.children?.[0]?.children?.[0]?.innerHTML?.replace(/[^\d]/g, "")
                ) || 0,
        stars: document.querySelector(".rating")?.textContent?.trim() || "Unrated",  
        heatMap: headMapData || [],
        ratingData: ratingData || [],
        recentProblems: recentProblems || [],
        lastUpdated: new Date().toISOString()
    }  
    } else {
              return { success: false, status: resdata.status, error: "User not found" };
        }
    } catch (error) {
          return { success: false, error: error.message || "Something went wrong" };
    }
};


exports.codechef = async(req,res) => {
    try {
        const handle = req.params.handle;
        
        if(!handle){
            return res.status(400).json({
                success: false,
                error: "Please provide a username"
            })
        }

        const data = await ftech(handle);
        console.log(data);
        if(data.success){
            return res.status(200).json(data); 
        }else{
            return res.status(data.status || 500).json(data);
        }
    } catch (error) {
         return res.status(500).json({ success: false, error: error.message || "Internal Server Error" });
    }
}


