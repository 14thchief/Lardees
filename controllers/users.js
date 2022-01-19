const passport = require("passport");
const bcrypt= require('bcrypt');
const User= require('../models').User;

require('../config/passport_config')(passport); //set up for passport library

const encryptPassword= (password)=>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

//sign up handler
const signup= (req, res, next)=>{
    const newUser= User.create({
        email: req.body.email,
        password: encryptPassword(req.body.password),
        full_name: req.body.name
        //other details included later
    })
    .then(user=> next())
    .catch(error =>{
    error.status= 400;
    error.message= "email already exists!"
    next(error)
    })
    
}


//log in handler
//upon successful login and session start, passportJS will populate req.user with the user object from the database
const signin= (req, res, next)=>{
    const {id, email, full_name}= req.user;
    res.json({id, email, full_name})
}

//log out handler
const signout= (req, res, next)=>{
    req.logout(); //destroys req.user created by passport's authentication
    req.session.destroy(); //destroys req.session created by express session
    res.status(200).send("User logged out and session destroyed")
}

module.exports= {
    signup,
    signin,
    signout
}