const passport = require("passport");
const jwt = require("jsonwebtoken");
const SchemaUser = require("../models/SchemaUser");
const session = require("express-session");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { generateToken } = require("../middleware/middlewareJWT");

const express = require("express");
const { welcomeEmail } = require("../middleware/middlewareNodemailer");
const google = express();



google.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));



google.use(passport.initialize());
google.use(passport.session());


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRE,
    callbackURL: process.env.BACKEND_URL + '/auth/google/callback',
  },
  function(accessToken, refreshToken, profile, done) {
    done(null, profile);
  }
));

passport.serializeUser((user, done) => {
    done(null, user);
}
);

passport.deserializeUser((user, done) => {
    done(null, user);
}
);

google.get('/auth/google',
    passport.authenticate('google', { 
        scope: ['profile', 'email'], 
        prompt: 'select_account' 
    })
);

google.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: process.env.FRONTEND_URL + '/login' }),
    async function (req, res) {
        try{
            const user = await SchemaUser.findOne({ email: req.user._json.email });
            if(!user){
                const newUser = new SchemaUser({
                    email: req.user._json.email,
                    username: req.user._json.name,
                    name: req.user._json.given_name,
                    surname: req.user._json.family_name,
                    avatar: req.user._json.picture,
                    provider: "google"
                });
                await newUser.save();
                const token = generateToken({_id: newUser._id, email: newUser.email})
                welcomeEmail(newUser.email);
                res.redirect(process.env.FRONTEND_URL + '/login/' + token);
            }else{
                const token = generateToken({_id: user._id, email: user.email})
                res.redirect(process.env.FRONTEND_URL + '/login/' + token);
            }
        }
        catch(err){
            console.log(err);
        }
    }
);


module.exports = google;




