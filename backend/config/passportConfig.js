const LocalStrategy = require('passport-local').Strategy;
const  pool  = require('../config/auth/db_postgres.js')
const bcrypt =  require('bcrypt');
const AppError = require('../utils/AppError');

function initialize(passport){

    const authenticateUser = async (email,password,done) => {
           
        const user = await pool.query(
            `SELECT * FROM USERS WHERE email = $1`,[email]
        )

        if(user.rows.length>0){
            const existUser = user.rows[0];

            bcrypt.compare(password,existUser.password,(err,isMatch) => {
                if(err){
                    throw new AppError('No user logged in!!');
                }

                if(isMatch){
                    return done(null,existUser);
                }else{
                    return done(null,false,{message:'Password is not correct'})
                }
            })
        }else{
                return done(null,false,{message:'Email not registered'})
        }
    }

    passport.use(
        new LocalStrategy(
            {
                usernameField:'email',
                passwordField:'password'
            },
            authenticateUser
        )
    );

    passport.serializeUser((user,done) => done(null,user.user_id));

    passport.deserializeUser( async (id,done) => {
        try {
            const userData = await pool.query(
                `SELECT * FROM USERS WHERE user_id = $1`,[id]
            )

            if(userData.rows.length>0){
                done(null,userData.rows[0])
            }else{
                done(new AppError('No user found'),null)
            }
        } catch (error) {
            done(error);
        }
    })

}

module.exports = initialize;