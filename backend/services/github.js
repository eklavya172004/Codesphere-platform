const axios = require("axios");


//login 
exports.gitlogin = async (req, res) => {
  if (req.user) {
    return res.redirect("http://localhost/3000/");
  }

  // 1. Generate random state token (for CSRF protection)
  const state = generateRandomState();

  // 2. Set state in cookie (10 min expiry)
  const cookieConfig = {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 10,
    sameSite: "lax",
    path: "/",
  };

  res.cookie("github_oauth_state", state, cookieConfig);

  // 3. Build GitHub OAuth URL
  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", process.env.Client_ID);
  url.searchParams.set("redirect_uri", "http://localhost:4000/auth/github/callback");
  url.searchParams.set("state", state);
  url.searchParams.set("scope", "read:user user:email");

  // 4. Redirect to GitHub
  res.redirect(url.toString());
};

// Utility to generate a random state string
function generateRandomState(length = 24) {
  return [...Array(length)].map(() => Math.random().toString(36)[2]).join("");
}


//callback 
exports.githubLoginCallback = async (req,res) => {
    const {code,state} = req.query;
    const storedState = req.cookies.github_oauth_state;

    if(state!=storedState){
        return res.status(403).send("Invalid state parameter");
    }

    try {
        const token = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id:process.env.Client_ID,
                client_secret:process.env.Client_secrets,
                code,
                redirect_uri:"http://localhost:4000/auth/github/callback",
            },{
                headers:{
                    Accept:"application/json"
                }
            }
        );

        const accessToken = token.data.access_token;

        const user = await axios.get("https://api.github.com/user",{
            headers:{
                Authorization:`Bearer ${accessToken}`,
                Accept:"application/json",
            },
        });

        const githubUser = await user.data.json();

        console.log(githubUser);

            res.send(`GitHub Login Successful. Welcome ${githubUser.login}`);
    } catch (error) {
            console.error("GitHub callback error:", err);
             res.status(500).send("GitHub OAuth failed");
    }
} 