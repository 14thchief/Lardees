const {
    createProduct,
    fetchAllProducts,
    fetchProductByCategory,
    updateProductInfo,
    fetchProductByID,
    deleteProductByID
}= require('../services/productServices')

//ROUTE HANDLERS FOR PRODUCTS

const getAllProducts= (req, res, next)=>{
    return fetchAllProducts()
    .then(result=>{
        res.status(200).json(result)
    })
    .catch(err=> next({status: 404, message: "error fetching products"}))
}

const getProductsByCat= (req, res, next)=>{
    const category= req.params.category;

    return fetchProductByCategory(category)
    .then(productsArray=> {
        res.status(200).json(productsArray);
    })
    .catch(error=> next({message: "Products not found"}))
}

const getProductById= (req, res, next)=>{
    const {id}= req.body;
    fetchProductByID(id)
    .then(result=> res.status(200).send(result))
    .catch(error=> next(error));
}

const addProduct= (req, res, next)=>{
    const {name, description= "none available", category, price} = req.body;

    createProduct(name, category, price, description)
    .then(product=>{
        if (product.error) return next({message: product.error.message});

        res.status(201).json(product);
    })
    .catch(error=> next({message: "Error creating new product"}))
}

const updateProduct= (req, res, next)=>{
    const product_id= req.body.id;
    fetchProductByID(product_id) //JSON data
    .then(prevData=>{
        const { name= prevData.name, category= prevData.category, price= prevData.price, description= prevData.description } = req.body;
        const updateData= {name, category, price, description};
        return updateData;
    })
    .then(newData=>{
        const {name, category, price, description} = newData;
        return updateProductInfo(product_id, {name, category, price, description})
        .then(result=>{
            res.send(result)
        })
        .catch(e=> next(e))
    })
    .catch(e=> next(e))
}

const deleteProduct= (req, res, next)=>{
    const id= req.body.product_id;
    deleteProductByID(id)
    then(result=>{
        res.status(204).send(result)
    })
}

module.exports= {
    getAllProducts,
    getProductsByCat,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
}