const passport= require('passport')
, LocalStrategy= require('passport-local').Strategy;

passport.use(new LocalStretegy(
    function(username, password, done) {
        users.findOne({ username: username }, function(err, user) {
          if (err) { return done(err); }
          if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
          }
          if (!user.validPassword(password)) {
            return done(null, false, { message: 'Incorrect password.' });
          }
          return done(null, user);
        });
      }
));

module.exports= passport;