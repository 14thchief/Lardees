const express= require('express');
const bodyParser= require('body-parser');
const morgan= require('morgan');
const apiRouter= require('./routes/api');
const indexRouter= require('./routes/index');


const app= express();
const logger= morgan('dev');

app.use(logger);
app.use(bodyParser.json());
app.use('/api', apiRouter);
app.use('/', indexRouter);

const PORT= process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`server is greenlight on port: ${PORT}`)
})