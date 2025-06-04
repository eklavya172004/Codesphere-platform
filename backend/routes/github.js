// const express = require("express"); 
const express = require("express");
const axios = require("axios");
const router = express.Router();
const {gitlogin,githubLoginCallback} = require("../services/github");

router.get("/login",gitlogin);
router.get("/callback",githubLoginCallback)

module.exports = router;