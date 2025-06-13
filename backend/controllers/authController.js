const AppError = require('../utils/AppError')
const catchAsync = require('../utils/catchAsync')
const bcrypt = require('bcrypt');
const pool = require('../config/auth/db_postgres');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');


const signToken = id => {
    return jwt.sign(
        {id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN}
    )
}

const createSendToken = (user,statuscode,res) => {
    const token = signToken(user.user_id);

    const cookieOption = {
        expires:new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN* 24 * 60 * 60 * 1000
        ),
        httpOnly:true
    }
    
    if(process.env.NODE_ENV === 'production') {
        cookieOption.secure = true;
    }

        user.password = undefined;

    res.cookie('jwt',token,cookieOption);

        res.status(statuscode).json({
        status:'success',
        token:token,
        data:{
            user
        }
    })
}

exports.signup = catchAsync(async (req, res, next) => {
    const {
        username,
        email,
        profile_image_url,
        password,
        confirmPassword,
        leetcode_username,
        codeforces_username,
        codechef_username,
        github_username
    } = req.body;

    if (!username || !email || !password || !confirmPassword) {
        return next(new AppError('Please provide all required fields', 400));
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
        `INSERT INTO USERS
        (username, email, profile_image_url, password, leetcode_username, codeforces_username, codechef_username, github_username)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING user_id, password, email, username, leetcode_username, codeforces_username, codechef_username, github_username
        `,
        [
            username,
            email,
            profile_image_url || '',
            hashedPassword,
            leetcode_username || null,
            codeforces_username || null,
            codechef_username || null,
            github_username || null
        ]
    );

    return res.status(201).json({
        status: 'success',
        message: 'You are now registered. Please log in!',
        user: newUser.rows[0]
    });
});


exports.login = catchAsync(async (req,res,next) => {
    const {email,password} = req.body;

    if(!email || !password){
        return next(new AppError('Please provide email and password!', 400));
    }

    const result = await pool.query(
            `SELECT * FROM USERS WHERE email = $1`,[email]
        )

        if (result.rows.length === 0) {
        return next(new AppError('Incorrect email or password', 401));
    }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
                   return next(new AppError('Incorrect email or password', 401));
        }

         createSendToken(user, 200, res);
})

exports.protect = catchAsync(async(req,res,next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token){
         return next(new AppError('You are not logged in to get the access.',401));
    }


    const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET);

        const result = await pool.query(`SELECT * FROM users WHERE user_id = $1`, [decoded.id]);

        
    if (result.rows.length === 0) {
        return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    req.user = result.rows[0];

    next();
})