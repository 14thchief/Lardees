/* Landing page Routes */
const router= require('express').Router();
const loginForm= require('../static/forms').loginHTML;
const signupForm= require('../static/forms').signupHTML;
const secretPage= require('../static/pages').secretPage;
module.exports= router;


router.get('/', (req, res, next)=>{
    res.render('index', {greeting: 'welcome to this api Route'})
})

router.get('/login', (req, res, next)=>{
    res.send(loginForm);
});

router.get('/signup', (req, res, next)=>{
    res.send(signupForm);
});

router.get('/secretpage', (req, res, next)=>{
    req.isAuthenticated()? res.send(secretPage) : res.send("No auth")
    
})