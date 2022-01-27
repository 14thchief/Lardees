const {
    createUser,
    signinService,
    signoutService
}= require('../services/authServices');




//sign up handler
const signup= (req, res, next)=>{
    const {email, password, name}= req.body;
    const {authkey= null}= req.headers;
    
    return createUser(authkey, email, password, name, next);
}

//log in handler
const signin= (req, res, next)=>{
    return signinService(req, res);
}

//log out handler
const signout= (req, res, next)=>{
    return signoutService(req, res);
}

module.exports= {
    signup,
    signin,
    signout
}