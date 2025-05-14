const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const passport = require('passport');

// router.post('/login');
router.post('/signup',authController.signup);

router.post('/login', 
  passport.authenticate('local', {
    successRedirect: '/api/user/login-success',
    failureRedirect: '/api/user/login-failure',
    failureFlash: true
  })
);

router.get('/login-success', (req, res) => {
  res.status(200).json({
    message: 'Logged in successfully!',
    user: req.user
  });
});

router.get('/login-failure', (req, res) => {
  res.status(401).json({
    message: 'Login failed. Invalid credentials.'
  });
});

router.post('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

module.exports = router;