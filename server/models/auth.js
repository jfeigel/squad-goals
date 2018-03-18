const passport = require('../index.js').passport;
const config = require('../config.json');
const userModel = require('./user');
const bcrypt = require('bcryptjs');

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const LocalStrategy = require('passport-local').Strategy;
// if we have a port other than 80, add it to our callback url
let port = '';
if (config.site.port !== 80) {
  port = `:${config.site.port}`;
}
passport.use(
  new LocalStrategy(async function(username, password, done) {
    // get the user
    const user = await userModel.get(username);
    if (user.error === true) {
      // this user doesn't exist
      return done(null, false);
    }
    const match = await bcrypt.compare(password, user.password);
    if (match !== true) {
      return done(null, false);
    }
    done(null, user);
  })
);
