const express = require('express');
const userRouter = require('./routes/userRoute');
const cors = require('cors');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const {rateLimit} = require('express-rate-limit');
const leetcode  = require('./routes/leetcode');
const codechef = require('./routes/codechefs');
const codeforces = require('./routes/codeforces');

const initializePassport = require('./config/passportConfig');
initializePassport(passport);

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false
})

const specificLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, 
    max: 10,
    message: '<b>Too many requests for this route, please try again later.</b>'
  });
  

const globalErrorHandler = require('./middleware/globalerrorHandler');

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}
));

app.use(limiter);

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(
    session({
        secret:'secret',

        resave: false,

        saveUninitialized: false,

        cookie: {
        httpOnly: true,
        secure: false, // set to true if using HTTPS
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
    }
    })
)

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use('/api/user',userRouter);

//leetcode data fetching
app.use('/api/leetcode/contest',specificLimiter,leetcode.contest);
app.use('/api/leetcode/:id',specificLimiter,leetcode.leetcode);


//codechefs data fetching
app.use('/api/codechefs/:handle',specificLimiter,codechef.codechef);


//codeforces data fetching
app.use('/api/codeforces/:handle',specificLimiter,codeforces.codeforces);


app.use(globalErrorHandler);

module.exports = app;