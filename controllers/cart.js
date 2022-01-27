const {
    getUserPendingOrder,
    createUserPendingOrder,
    getAllCartItems,
    addProductToUserCart,
    removeCartItem,
    removeAllCartItems,
    updateQuantity
} = require('../services/cartServices');

//Middleware to get pending OR create new orderID (OrderID connects the cart to the user)
const setOrderId= async (req, res, next)=>{
    if(req.isAuthenticated()){
        const userID= req.user.id;
        //console.log('User adding to cart: '+ req.user.full_name)
        try {
            const order = await getUserPendingOrder(userID);
            if (order.rows.length) {
                req.orderID = order.rows[0]["id"];
                //console.log(`pending order ID found: ${req.orderID}`);
                return next();
            }else {
                createUserPendingOrder(userID).then(newOrder => {
                    req.orderID = newOrder.rows[0]["id"];
                    //console.log(`New created order ID: ${req.orderID}`);
                    return next();
                });
            }
        } catch (error) {
            return next(error);
        }
    }else{
        next({status: 401, message: "please login or sign up"})
    }
}

//Fetch and send user's cart_items
const getCart= (req, res, next)=>{
    if (req.isAuthenticated()){

        return getUserPendingOrder(req.user.id).then(order=>{
            if(order && order.rows.length){
                const orderID= order.rows[0]["id"];
                getAllCartItems(orderID).then(cart_items=>{
                    res.status(200).json(cart_items)
                })
            }else{
                res.send([])
            }
            
        }).catch(error=> next(error))
    }
    next({status: 401, message: "User has to login or sign up"})
}

//Add product to user's cart
const addToCart= (req, res, next)=>{
    const {product_id, quantity= 1} = req.body;
    const order_id= req.orderID;
    
    if(req.isAuthenticated()){
        return addProductToUserCart(order_id, product_id, quantity)
        .then(result=>{
            if(result){
                const addedProductID= result[0]["product_id"];
                res.status(200).send({status: "success", message: "product added to cart", payload: result[0]})
            }else{
                res.status(400).send(`Product ${product_id} already exist in cart`)
            }
        })
        .catch(error=> next({status: 402, message: "error adding to cart"}))
    }
    next({status: 401, message: "Please login or sign up"})
}

//Remove product from user's cart
const removeProductFromCart= (req, res, next)=>{
    const {product_id}= req.body;
    
    if(req.isAuthenticated()){
        return getUserPendingOrder(req.user.id)
        .then(orderID=> {
            const order_id= orderID.rows[0]["id"];
            removeCartItem(order_id, product_id)
            .then(productID=>{
                //console.log(`Product ${productID.product_id} removed from cart!`);
                res.status(200).send({status: "success", message: "product removed from cart"})
            })
            .catch(error=> {
                next({status: 404, message: "product not found in cart"})
            })
        })
        .catch(error=> next({status: 401, message: "Cart not found"}))
        
    }
    next({status: 401, message: "user not authorized, please login!"});
}

//Reset/clear user's cart
const clearUserCart= (req, res, next)=>{
    if(req.isAuthenticated()){
        return getUserPendingOrder(req.user.id)
        .then(orderID=> {
            const order_id= orderID.rows[0]["id"];
            removeAllCartItems(order_id)
            .then(orderID=>{
                //console.log(`${req.user.full_name}'s cart with order ID of ${orderID.id} has been reset!`);
                res.status(200).send({status: "success", message: "cart cleared"});
            })
            .catch(error=> {
                next({status: 404, message: "Cart is already empty"})
            })
        })
        .catch(error=> next({status: 401, message: "Cart not found"}))
        
    }
    next({status: 401, message: "user not authorized, please login!"});
}

//One off update of product quantity in user's cart
const updateProductInCart= (req, res, next)=>{
    const {product_id, quantity} = req.body;
    if(req.isAuthenticated()){
        return getUserPendingOrder(req.user.id)
        .then(order=>{
            const orderID= order.rows[0]["id"];
            updateQuantity(orderID, product_id, quantity)
            .then(update=> {
                if(!update) return next({status: 401, message: "Product is not in cart"});
                res.status(201).json(update);
            })
            .catch(error=> next({status: 405, message: "Error updating cart"}))
        })
        .catch(e=> next({status: 404, message: "Cart not found!"}))
    }
    next({status: 401, message: "User not authorized, please login!"});
}

module.exports= {
    addToCart,
    setOrderId,
    getCart,
    removeProductFromCart,
    clearUserCart,
    updateProductInCart
};