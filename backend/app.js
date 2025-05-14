const express = require('express');
const userRouter = require('./routes/userRoute');
const cors = require('cors');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');


const initializePassport = require('./config/passportConfig');
initializePassport(passport);

const app = express();

const globalErrorHandler = require('./middleware/globalerrorHandler');

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}
));
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

app.use(globalErrorHandler);

module.exports = app;