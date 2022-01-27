const passport = require("passport");
const bcrypt= require('bcrypt');
const User= require('../models').user;

require('../config/passport_config')(passport); //set up for passport library

const encryptPassword= (password)=>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

const createUser= (authkey, email, password, name, next)=>{
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
        User.create({
            email: email,
            password: encryptPassword(password),
            full_name: name
            //other details included later
        })
        .then(user=> next())
        .catch(error =>{
            next({message: "email already exists!", status: 400});
        })
    }
}

const signinService= (req, res)=>{
    //upon successful login, passportJS will populate req.user with the database user record
    const {id, email, full_name}= req.user;
    res.json({id, email, full_name})
}

const signoutService= (req, res)=>{
    req.logout(); //destroys req.user created by passport's authentication
    req.session.destroy(); //destroys req.session created by express session
    res.status(200).send("User logged out and session destroyed")
}

module.exports= {
    createUser,
    signinService,
    signoutService
}