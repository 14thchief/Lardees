const express= require('express');
const bodyParser= require('body-parser');
const morgan= require('morgan');
const apiRouter= require('./routes/api');
const indexRouter= require('./routes/index');
const passport= require('passport');
const session= require('express-session');
//const sessionStore= require('connect-pg-simple')(session);
const { sequelize, Sequelize}= require('./models/index');

require('./config/passport_config')(passport);
require('dotenv').config()

const app= express();
const logger= morgan('dev');

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 1000 * 60 * 60 * 24
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(logger);
app.use(bodyParser.json());
app.use('/api', apiRouter);
app.use('/', indexRouter);


app.use((err, req, res, next)=>{
    res.status(err.status).send(err.message)
})

const PORT= process.env.PORT;


app.listen(PORT, ()=>{
    console.log(`server is greenlight on port: ${PORT}`)
})