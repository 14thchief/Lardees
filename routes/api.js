const apiRouter= require('express').Router();
const productsRouter= require('./products');
const cartRouter= require('./cart');
const authRouter= require('./users');





//api routes set up
apiRouter.use('/auth', authRouter)
apiRouter.use('/products', productsRouter); //will either be a matching name or matching id on the db
apiRouter.use('/cart', cartRouter);


apiRouter.get('/', (req, res, next)=> {
    res.send(req.method + "request recieved on apiRoute")
})




module.exports= apiRouter;