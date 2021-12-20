const router= require('express').Router();
const users= require('../src/database').users;
const passport= require('../app');
module.exports= router;


//Registration
router.post('/register', (req, res, next)=>{
    const user= req.body;
    const algo= users.map(u=> u.id == user.id).length === 0;
    if(user.user_name && user.user_id && algo && user.password.length > 3 && typeof user.age === 'number'&& user.country){
        const user= req.body;
        users.push({ "user_name": user.user_name.toLowerCase(), ...user});
        console.log("New user registered")
        res.send("User registered!")
    }else{
        console.log(user)
        //console.log(typeof user.age)
        res.status(404).send("Invalid data sent, There should be user_name, age that is a number, password of length 4 or greater, country data")
    }
    
})


//Login
router.post('/login', (req, res, next)=>{
    const user= req.body;
    if(users.map(u=> u.user_name == user.user_name && u.password === user.password).length > 0){
        // create a session
        //send auth token
        res.send(`session started for user:  ${user.user_name}`)
    }else{
        res.status(404).send("User not found, Register first instead")
        //redirect to registration page on front-end
    }
})