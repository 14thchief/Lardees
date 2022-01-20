/* Landing page Routes */
const router= require('express').Router();

module.exports= router;


router.get('/', (req, res, next)=>{
    res.render('index', {greeting: 'welcome to this api Route'})
})



router.get('/secretpage', (req, res, next)=>{
    req.isAuthenticated()? res.send(secretPage) : res.send("No auth")
    
})