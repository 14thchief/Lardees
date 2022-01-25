const {pool}= require('../services/cartServices');
const {
    createProduct,
    fetchAllProducts
}= require('../services/productServices')





const addProduct= (req, res, next)=>{
    const {name, description= "none available", category, price} = req.body;

    if(!req.isAuthenticated()) return next({message: "Please login or signup to create product"})
    if(!req.user.is_admin) return next({status: 403, message: "non-admin unauthorised to create product!"})

    createProduct(name, category, price, description)
    .then(product=>{
        if (product.error) return next({message: product.error.message});

        res.status(201).json(product);
    })
    .catch(error=> next({message: "Error creating new product"}))
}

const getAllProducts= (req, res, next)=>{
    return fetchAllProducts()
    .then(result=>{
        res.status(200).json(result)
    })
    .catch(err=> next({status: 404, message: "error fetching products"}))
}

const getProductsByCat= (req, res, next)=>{
    const category= req.params.category;

   /* pool.query(
        `
        SELECT * FROM products
        WHERE products.category = $1
        `, [category], (error, results)=>{
            if(error){
                throw error
            }
            res.status(200).send(results.rows)
        }
    ) */


}

const getProductsById= (req, res, next)=>{
    const {id}= req.body;
   /* pool.query(
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
    ) */


}


const updateProduct= (req, res, next)=>{

    const {name, description, category, price} = req.body;
    const id= req.params.product_id;

    /* pool.query(

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
    ) */



}

const deleteProduct= (req, res, next)=>{
    const id= req.params.product_id;

    /*pool.query(
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
    ) */



}

module.exports= {
    getAllProducts,
    getProductsByCat,
    getProductsById,
    addProduct,
    updateProduct,
    deleteProduct
}