    const LocalStrategy = require('passport-local').Strategy;
    const bcrypt = require('bcrypt');
    const  pool  = require('./dbConfig');

    const authenticateUser = async (email, password, done) => {
        pool.query(
            `SELECT * FROM users 
            WHERE email= $1`, [email],
            (err, results) =>{
                if(err){
                    throw err;
                }
                console.log(results.rows)

                if (results.rows.length>0){
                    const user = results.rows[0]

                    bcrypt.compare(password,user.password, (err, isMatch)=>{
                        if(err){
                            throw err
                        }

                        if(isMatch){
                            return done(null, user)
                    }else{
                            return done(null, false, {message: "Incorrect password"})
                        
                    }
                })
            }else{
                return done(null, false, {message: "No user with that email"})

            }
    })
    }

    function initialize(passport){
        passport.use(new LocalStrategy({
            usernameField:"email",
            passwordField:"password"

        }, authenticateUser))
        passport.serializeUser((user, done) => {
            done(null, user.id);
        });
        passport.deserializeUser((id,done)=>{
            pool.query(
                `SELECT * FROM users
                WHERE id = $1`, [id], (err,results)=>{
                    if(err){
                        throw err
                    }
                    return done(null, results.rows[0]);
                }
            )
        })
    }

    module.exports = initialize;