const {
    getUserPendingOrder,
    createUserPendingOrder,
    getAllCartItems,
    addProductToUserCart
} = require('../services/cartServices');


const getOrderId= async (req, res, next)=>{
    if(req.isAuthenticated()){
        const userID= req.user.id;
        console.log('User adding to cart: '+ req.user.full_name)
        try {
            const order = await getUserPendingOrder(userID);
            if (order.rows.length) {
                req.orderID = order.rows[0]["id"];
                console.log(`pending order ID found: ${req.orderID}`);
                return next();
            }else {
                createUserPendingOrder(userID).then(newOrder => {
                    req.orderID = newOrder.rows[0]["id"];
                    console.log(`New created order ID: ${req.orderID}`);
                    return next();
                });
            }
        } catch (error) {
            return next(error);
        }
    }
    next({status: 401, message: "Please login or sign up"})
}

const getCart= (req, res, next)=>{
    if (req.isAuthenticated()){
        return getUserPendingOrder(req.user.id).then(order=>{
            if(order.rows.length){
                const orderID= order.rows[0]["id"];
                getAllCartItems(orderID).then(cart_items=>{
                    res.json(cart_items)
                })
            }else{
                res.json(order.rows)
            }
            
        }).catch(error=> next(error))
    }
    next({status: 401, message: "User has to login or sign up"})
}

const addToCart= (req, res, next)=>{
    const {product_id, quantity= 1} = req.body;
    const order_id= req.orderID;
    
    if(req.isAuthenticated()){
        return addProductToUserCart(order_id, product_id, quantity).then(result=>{
            if(result){
                const addedProductID= result[0]["product_id"];
                res.status(200).send(`Product ${addedProductID} added to cart successfully`)
            }else{
                res.status(400).send(`Product ${product_id} already exist in cart`)
            }
        })
    }
    next({status: 401, message: "Please login or sign up"})
}


module.exports= {
    addToCart,
    getOrderId,
    getCart
};