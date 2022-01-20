const configObj = require('../config/Db_config').configObj;
const Pool= require('pg').Pool;

const pool= new Pool(configObj);


//CART SERVICE FUNCTIONS
const getUserPendingOrder= async (userID)=>{
    try{
        const pendingOrder = await pool.query( //check orders table for pending orders and return the id, use it in marking cart_items or create new order
            `
            SELECT id FROM orders
            WHERE user_id = $1
            AND status= 'pending'
            `, [userID]
        )
        return pendingOrder;

    }catch(err){
        console.log(err)
    }
    
}

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

        console.log(cartItems)
        return cartItems;
    }catch(error){
        console.log(error)
    }
}


const checkCartForProduct= async (product_id, order_id)=>{//helper function to check for product in cart
    const {rows: isInCart}= await pool.query(
        `
        SELECT product_id FROM cart_items
        WHERE product_id= $1
        AND order_id= $2
        `, [product_id, order_id]
    )

    return isInCart.length? true : false;
}

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



module.exports= {
    getUserPendingOrder,
    createUserPendingOrder,
    getAllCartItems,
    addProductToUserCart
}