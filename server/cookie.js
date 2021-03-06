
var bodyParser = require('body-parser');
const express = require('express');
var path = require('path');
const passport = require('passport');
const cookieSession = require('cookie-session');
require('./passport');
const app = express();
const port = 3000;

app.use('/', express.static(path.join(__dirname, '../client/dist')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//Configure Session Storage
app.use(cookieSession({
    name: 'session-name',
    keys: ['key1', 'key2']
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
const checkUserLoggedIn = (req, res, next) => {
req.user ? next(): res.sendStatus(401);
}

//Protected Route.
app.get('/profile', checkUserLoggedIn, (req, res) => {
res.send(`<h1>${req.user.displayName}'s Profile Page</h1>`)
});

// Auth Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
function(req, res) {
    res.redirect('/profile');
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