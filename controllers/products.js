const configObj = require('../config/Db_config').configObj;
const Pool= require('pg').Pool;

const pool= new Pool(configObj);



const getAllProducts= (req, res, next)=>{
    pool.query(
        `
        SELECT * FROM products
        `, (error, results)=>{
            if(error){
                throw error
            }
            console.log(results.rows)
            res.status(200).send(results.rows)
        }
    )
}

const getProductsByCat= (req, res, next)=>{
    const category= req.params.category;

    pool.query(
        `
        SELECT * FROM products
        WHERE products.category = $1
        `, [category], (error, results)=>{
            if(error){
                throw error
            }
            res.status(200).send(results.rows)
        }
    )
}

const getProductsById= (req, res, next)=>{
    const id= parseInt(req.params.product_id);
    pool.query(
        `
        SELECT * FROM products
        WHERE id = $1
        `, [id], (error, results)=>{
            if(error){
                throw error
            }
            console.log(results.rows)
            res.status(200).send(results.rows)
        }
    )
}


const addProduct= (req, res, next)=>{

    const {name, description, category, price} = req.body;
    pool.query(
        `
        INSERT INTO products(name, description, category, price)
        VALUES ($1, $2, $3, $4)
        `, [name, description, category, price], (error, results)=>{
            if(error){
                throw error
            }
            console.log(results.rows)
            res.status(200).send(`New product added with id: ${results.insertId}`)
        }
    )
}

const updateProduct= (req, res, next)=>{

    const {name, description, category, price} = req.body;
    const id= req.params.product_id;

    pool.query(

        `
        UPDATE products
        SET name= $1, description= $2, category= $3, price= $4
        WHERE id= $5
        `, [name, description, category, price, id], (error, results)=>{
            if(error){
                throw error
            }
            console.log(req.body)
            res.status(200).send(`Updated product with id: ${id}`)
        }
    )
}

const deleteProduct= (req, res, next)=>{
    const id= req.params.product_id;

    pool.query(
        `
        DELETE FROM products
        WHERE id = $1
        `, [id], (error, results)=>{
            if(error){
                throw error
            }
            console.log(results.rows)
            res.status(200).send(`product with id: ${id}`)
        }
    )
}

module.exports= {
    getAllProducts,
    getProductsByCat,
    getProductsById,
    addProduct,
    updateProduct,
    deleteProduct
}