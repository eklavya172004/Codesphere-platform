// const express = require("express"); 
const express = require("express");
const axios = require("axios");
const router = express.Router();
const {gitlogin,githubLoginCallback,fetchGithubProfile } = require("../services/github");

router.get("/login",gitlogin);
router.get("/callback",githubLoginCallback)

router.get("/profile", fetchGithubProfile);

module.exports = router; 