const router= require('express').Router();
const {signin, signup, signout}= require('../controllers/users');
module.exports= router;
const passport= require('passport');
require('../config/passport_config')(passport);


//Signin
router.post('/signin', passport.authenticate('local'), signin);

//Signup
router.post('/signup', signup, passport.authenticate('local'), signin);

//Signout
router.post('/signout', signout);