const configObj = require('../config/Db_config').configObj;
const Pool= require('pg').Pool;

const pool= new Pool(configObj);


//CART SERVICE FUNCTIONS?

//get an pending User order's cart
const getUserPendingOrder= async (userID)=>{
    try{
        const pendingOrder = await pool.query( //check orders table for pending orders and return the id, use it in marking cart_items or create new order
            `
            SELECT id FROM orders
            WHERE user_id = $1
            AND status= 'pending'
            `, [userID]
        )
        return pendingOrder? pendingOrder : false;

    }catch(err){
        console.log({status: "DB query error", message: "No result found"})
    }
    
}

//for when there is no pending order, create new User pending order
const createUserPendingOrder= async (userID)=>{
    try{
        const createdOrder= await pool.query(
            `
                INSERT INTO orders(user_id, status)
                VALUES ($1, 'pending')
                RETURNING *
            `, [userID])
        console.log({newOrder: createdOrder.rows});
        return createdOrder;

    }catch(error){
        console.log(error)
        
    }
    
}

//get all User's cart items for pending order
const getAllCartItems= async (orderID)=>{
    try{
        const {rows: cartItems}= await pool.query(
            `
            SELECT p.name AS name, c.quantity AS quantity, p.price*c.quantity AS sub_price
            FROM cart_items c
            JOIN products p
            ON c.product_id= p.id
            WHERE c.order_id= $1
            `, [orderID])
        return cartItems;
    }catch(error){
        console.log(error)
    }
}

//check User's pending cart if product exist: Helper function not exported
const checkCartForProduct= async (product_id, order_id)=>{
    const {rows: isInCart}= await pool.query(
        `
        SELECT product_id, quantity FROM cart_items
        WHERE product_id= $1
        AND order_id= $2
        `, [product_id, order_id]
    )

    return isInCart.length? isInCart[0] : false;
}

//add new product to User's cart
const addProductToUserCart= async (orderID, productID, quantity)=> {
    try{ 
        const isInCart= await checkCartForProduct(productID, orderID);
        if(isInCart) return false;

        const {rows: addedProduct} = await pool.query(
            `
            INSERT INTO cart_items(order_id, product_id, quantity)
            VALUES ($1, $2, $3)
            RETURNING product_id
            `, [orderID, productID, quantity])

        console.log(addedProduct);
        return addedProduct; //returns the product_id of product added to cart

    }catch(error){ console.log(error)}
}

//update quantity of product in User's cart
const updateQuantity= async (orderID, productID, newQuantity)=>{
    const isInCart= await checkCartForProduct(productID, orderID); //confirm the product is in cart
    if(!isInCart) return false; //return false if it is not

    const {quantity}= isInCart; //get the previous quantity before update
    if(!newQuantity) newQuantity= quantity; //default to previous quantity if no value is supplied i.e defaulting
    const {rows: updatedProduct}= await pool.query(
        `
        UPDATE cart_items
        SET quantity= $1
        WHERE order_id= $2
        AND product_id= $3
        RETURNING product_id, quantity
        `, [newQuantity, orderID, productID]
    )
    
    return updatedProduct[0];

}

//remove product from User's cart
const removeCartItem= async (orderID, productID, cb)=>{
    try{
        const {rows: removedItem}= await pool.query(
            `DELETE FROM cart_items
            WHERE order_id= $1
            AND product_id= $2
            RETURNING product_id`,
            [orderID, productID]
        )
        return removedItem[0];
    }catch(e){
        console.error(e.stack)
    }
}

//remove all product from User's cart
const removeAllCartItems= async (orderID)=>{
    try{
        const {rows: removedItems}= await pool.query(
            `DELETE FROM cart_items
            WHERE order_id= $1
            RETURNING order_id`,
            [orderID]
        )
        return removedItems[0];
    }catch(e){
        console.error(e.stack)
    }
}





module.exports= {
    pool,
    getUserPendingOrder,
    createUserPendingOrder,
    getAllCartItems,
    addProductToUserCart,
    removeCartItem,
    removeAllCartItems,
    updateQuantity
}