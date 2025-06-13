const axios = require("axios");
const fetch = require("node-fetch");
const { URLSearchParams } = require("url");

//login 
exports.gitlogin = async (req, res) => {
  if (req.user) {
    return res.redirect("http://localhost/3000");
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
exports.githubLoginCallback = async (req, res) => {
    const { code, state } = req.query;
    const storedState = req.cookies.github_oauth_state;

    // Validate state parameter to prevent CSRF
    if (state !== storedState) {
        return res.status(403).send("Invalid state parameter");
    }

    // Clear the used state cookie
    res.clearCookie('github_oauth_state');

    try {
        // Exchange code for access token
        const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                client_id: process.env.Client_ID,
                client_secret: process.env.Client_secrets,
                code,
                redirect_uri: "http://localhost:4000/auth/github/callback",
            }),
        });

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        if (!accessToken) {
            console.error('Access token not received:', tokenData);
            return res.status(401).send("Access token not received");
        }

        // Regenerate session for security (prevents session fixation)
        req.session.regenerate(async (err) => {
            if (err) {
                console.error('Session regeneration error:', err);
                return res.status(500).send('Session error');
            }

            req.session.accessToken = accessToken;

            try {
                // Fetch GitHub user profile
                const userResponse = await fetch("https://api.github.com/user", {
                    headers: {
                        Authorization: `token ${accessToken}`,
                        Accept: "application/json",
                    },
                });

                const githubUser = await userResponse.json();

                // Fetch user's email
                const githubEmailResponse = await fetch("https://api.github.com/user/emails", {
                    headers: {
                        Authorization: `token ${accessToken}`,
                        Accept: "application/json",
                    },
                });

                const emailData = await githubEmailResponse.json();

                if (!Array.isArray(emailData) || emailData.length === 0) {
                    console.error('No emails found for GitHub user:', githubUser);
                    return res.status(400).send('No emails found for GitHub user');
                }

                const primaryEmailObj = emailData.find(e => e.primary && e.verified);
                const primaryEmail = primaryEmailObj ? primaryEmailObj.email : emailData[0].email;

                // Save session and redirect
                req.session.save(err => {
                    if (err) {
                        console.error('Session save error:', err);
                        return res.status(500).send('Session save error');
                    }

                res.redirect('http://localhost:3000/dashboard/Github?github=1');
                });

            } catch (fetchError) {
                console.error('Error fetching GitHub user details:', fetchError);
                return res.status(500).send('Failed to fetch GitHub user details');
            }
        });

    } catch (err) {
        console.error("GitHub callback error:", err);
        return res.status(500).send("GitHub OAuth failed");
    }
};



exports.fetchGithubProfile = async (req, res) => {
      console.log('Session Object:', req.session);

    if (!req.session) {
        console.error('Session is undefined');
        return res.status(500).json({ error: 'Session is not initialized' });
    }

    // const accessToken = req.session.accessToken;

    const accessToken = req.session.accessToken; // retrieve from session

    console.log(accessToken);

    if (!accessToken) {
        console.error('Access token missing');
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const query = `{
        viewer {
            login
            name
            avatarUrl
            bio
            company
            location
            websiteUrl
            email
            twitterUsername
            followers { totalCount }
            following { totalCount }
            pinnedItems(first: 6, types: REPOSITORY) {
                totalCount
                nodes {
                    ... on Repository {
                        name
                        url
                        description
                        stargazerCount
                        forkCount
                        updatedAt
                        primaryLanguage { name color }
                    }
                }
            }
            repositories(first: 10, orderBy: {field: UPDATED_AT, direction: DESC}, privacy: PUBLIC) {
                totalCount
                nodes {
                    name
                    url
                    description
                    stargazerCount
                    forkCount
                    updatedAt
                    primaryLanguage { name color }
                    defaultBranchRef {
                        name
                        target {
                            ... on Commit {
                                history(first: 10) {
                                    totalCount
                                    edges {
                                        node {
                                            committedDate
                                            message
                                            url
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            contributionsCollection {
                contributionCalendar {
                    totalContributions
                    weeks {
                        contributionDays {
                            color
                            contributionCount
                            date
                        }
                    }
                }
                contributionYears
                totalCommitContributions
                totalIssueContributions
                totalPullRequestContributions
            }
            status {
                message
            }
        }
    }`;

    try {
        const response = await axios.post(
            'https://api.github.com/graphql',
            { query },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        // ✅ Safely check if data exists
        if (!response.data || !response.data.data || !response.data.data.viewer) {
            console.error('GitHub API did not return expected data:', response.data);
            return res.status(500).json({ error: 'Invalid response from GitHub API' });
        }

        // console.log('GitHub User:', response.data.data.viewer);
        res.json(response.data.data.viewer);

   } catch (error) {
    if (error.response) {
        // API responded with an error status
        console.error('Error fetching GitHub profile:', error.response.data);
        res.status(500).json({ error: error.response.data });
    } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request);
        res.status(500).json({ error: 'No response from GitHub API' });
    } else {
        // Something else happened
        console.error('Error setting up request:', error.message);
        res.status(500).json({ error: 'Unknown server error' });
    }
}
};