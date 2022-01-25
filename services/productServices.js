const Product= require('../models').product;

const createProduct= async (name, category, price, description)=>{
    try{
        const isInDB= await Product.findOne({where: {name}});
        if (isInDB) return {error: {message: "Product already exists in the Database, Update the product at /update"}};

        const newProduct= await Product.create({
            name: name,
            category: category,
            price: price,
            description: description
        })
        return newProduct;

    }catch(error){
        console.log(error.stack)
    }
}

const fetchAllProducts= async ()=>{
    try{
        const productsArray= await Product.findAll()
        return productsArray;
    }catch(error){
        console.log(error)
    }
}

const viewProduct= async (product_id)=>{}

const updateProduct= async (product_id)=>{}

const deleteProduct= async (product_id)=>{}


module.exports= {
    createProduct,
    fetchAllProducts
}