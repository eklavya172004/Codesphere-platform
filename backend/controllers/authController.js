const AppError = require('../utils/AppError')
const catchAsync = require('../utils/catchAsync')
const bcrypt = require('bcrypt');
const pool = require('../config/auth/db_postgres');
const flash = require('express-flash');

exports.signup  = catchAsync(async (req,res,next) => {
        const {username,email,profile_image_url,password,confirmPassword} = req.body;
        
        if(!username || !email || !password || !confirmPassword){
            return next(new AppError('Please provide all required fields',400));
        }

          if (password !== confirmPassword) {
            return next(new AppError('Passwords do not match', 400));
        }

        if (password.length < 8) {
            return next(new AppError('Password must be at least 8 characters long', 400));
        }


        
        const existingUser = await pool.query(`SELECT * FROM USERS WHERE email = $1`, [email]);
        
        if (existingUser.rows.length > 0) {
            return next(new AppError('Email already exists', 400));
        }
        
        const hashedPassword = await bcrypt.hash(password,10);
        
        const newUser = await pool.query(
                `INSERT INTO USERS(username,email,profile_image_url,password)
                 VALUES($1,$2,$3,$4)
                 RETURNING user_id,password,email
                `,[username,email,profile_image_url || '',hashedPassword]
            )

             return res.status(201).json({
                status: 'success',
                message: 'You are now registered. Please log in!',
                user: newUser.rows[0]
            });
        
        
})