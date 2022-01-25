const passport = require("passport");
const bcrypt= require('bcrypt');
const User= require('../models').user;

require('../config/passport_config')(passport); //set up for passport library

const encryptPassword= (password)=>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

//sign up handler
const signup= (req, res, next)=>{
    const {email, password, name}= req.body;
    const {authkey}= req.headers;

    const condition= authkey === process.env.ADMIN_KEY;

    if (condition){
       User.create({
            email: email,
            password: encryptPassword(password),
            full_name: name,
            is_admin: true
            //other details included later
        })
        .then(user=> {
            console.log(`New admin created: ${user.full_name}`)
            return next()
        })
        .catch(error =>{
            console.log(error.stack)
            next({status: 400, message: "email already exists!"})
        })
    }
    else{
        console.log(req.headers);
        User.create({
            email: req.body.email,
            password: encryptPassword(req.body.password),
            full_name: req.body.name
            //other details included later
        })
        .then(user=> next())
        .catch(error =>{
            console.log(error)
        error.status= 400;
        error.message= "email already exists!"
        next(error)
        })  
    }
}


//log in handler
//upon successful login and session start, passportJS will populate req.user with the user object from the database
const signin= (req, res, next)=>{
    //if(!req.user) return next({status: 401, message: "Invalid user"})
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