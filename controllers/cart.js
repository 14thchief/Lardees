const configObj = require('../config/Db_config').configObj;
const Pool= require('pg').Pool;

const pool= new Pool(configObj);

const getOrderId= (req, res, next)=>{
    const {user_id, status='pending'} = req.params;
    pool.query( //check orders table for unsettled/unchecked orders and use order_id for cart_items grouping or create new order
        `
        SELECT id FROM orders
        WHERE user_id = $1
        AND status= $2
        `, [user_id, status], (error, results) => {
        if (error) {
            throw error;
        }
        const resultArr = results.rows;
        
        if (!resultArr.length) { //if no pending order create new order with pending status
        pool.query(
                `
                    INSERT INTO orders(user_id, status)
                    VALUES ($1, $2)
                    `, [user_id, status], (error, results) => {
                if (error) {
                    throw error;
                }
                pool.query(
                    `
                            SELECT id FROM orders
                            WHERE status= 'pending'
                            `, (error, results) => {
                    if (error) {
                        throw error;
                    }
                    console.log(`New created order: ${results.rows[0].id}`);
                    req.order_id = results.rows[0].id;
                    next()
                }
                );
            }
            );
        } else { //else if there is an unsettled order...
            console.log('pending order found: ' + resultArr[0].id);
            req.order_id = resultArr[0].id;
            next()
        }
    }
    )
}

const getCart= (req, res, next)=>{
    const order_id= req.order_id;
    pool.query(
        `
        SELECT p.name AS name, c.quantity AS quantity, p.price*c.quantity AS total_price
        FROM cart_items c
        JOIN products p
        ON c.product_id= p.id
        WHERE c.order_id= $1
        `, [order_id], (error, results)=>{
            if(error){
                throw error;
            }
            
            res.status(200).send(results.rows)
        }
    )
}

const addToCart= (req, res, next)=>{
    const {product_id, quantity= 1} = req.body;
    const order_id= req.order_id;
    
    pool.query(
        `
        SELECT product_id FROM cart_items
        WHERE product_id = $2
        AND order_id= $1
        `, [order_id, product_id], (error, results)=>{
            if(error){
                throw error
            }
            if(results.rows){
                //Update product quantity
                pool.query(
                    `
                    UPDATE cart_items
                    SET quantity= $3
                    WHERE order_id= $1
                    AND product_id= $2
                    `, [order_id, product_id, quantity], (error, results)=>{
                        if(error){
                            throw error
                        }
                        res.status(201).send(results.rows)
                    }
                )
            }else{
                //insert product to cart
                pool.query(
                    `
                    INSERT INTO cart_items(order_id, product_id, quantity)
                    VALUES ($1, $2, $3)
                    `, [order_id, product_id, quantity], (error, results)=>{
                        if(error){
                            throw error
                        }
                        res.status(201).send(results.rows)
                    }
                )
            }
            console.log(results.rows)
        }
    )

    
}

const deleteFromCart= (req, res, next)=>{
    const {product_id} = req.body;
    const order_id= req.order_id;
    pool.query(
        `
        DELETE * FROM cart_items
        WHERE order_id= $1
        AND product_id= $2
        `, [order_id, product_id], (error, results)=>{
            if(error){
                throw error
            }
            res.status(201).send(results.rows)
        }
    )
}


module.exports= {
    addToCart,
    getOrderId,
    getCart
};