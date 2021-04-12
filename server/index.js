
var bodyParser = require('body-parser');
const express = require('express');
var path = require('path');
const passport = require('passport');
const cookieSession = require('cookie-session');
require('./passport');
const session = require('express-session');
const app = express();
const port = 3000;

app.use('/', express.static(path.join(__dirname, '../client/dist')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//Configure Session Storage
// app.use(cookieSession({
//     name: 'session-name',
//     keys: ['key1', 'key2']
//   }))

app.use(session({
    secret: process.env.REACT_APP_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  }))
  
//Configure Passport
app.use(passport.initialize());
app.use(passport.session());

//Unprotected Routes
// app.get('/', (req, res) => {
// res.send('<h1>Home</h1>')
// });

app.get('/failed', (req, res) => {
res.send('<h1>Log in Failed :(</h1>')
});

// Middleware - Check user is Logged in
const accessProtectionMiddlewar = (req, res, next) => {
// req.user ? next(): res.sendStatus(401);
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(403).json({
            message: "must be logged in to continue"
        })
    }
}

//Protected Route.
app.get('/protected', accessProtectionMiddlewar, (req, res) => {
    res.send(`<h1>${req.user.displayName}'s Profile Page</h1>`);
    // res.send(req.user)
});

// Auth Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
function(req, res) {
    res.redirect('/protected');
}
);

//Logout
app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})

  
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})