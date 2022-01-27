const Product= require('../models').product;
const { Op }= require('sequelize'); //A sequelize object with function to query array columns

//DATABASE-SERVER FUNCTIONS FOR PRODUCTS

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

const fetchProductByCategory= async (category)=>{
    try{
        const productByCategory= await Product.findAll({
            where: {
                category: { [Op.contains]: [category] }
            }
        })

        return productByCategory;

    }catch(error){
        console.log(error)
    }
}

const fetchProductByID= async(productID)=>{
    /* 
        Calling the sequelize query returns a full result including but not limited to the queried data,
        to manually get and use the queried data properties/values, I must return the data parsed to JSON
    */

    const prevData= await Product.findOne({where: {id: productID}});
    return prevData.toJSON();
}

const updateProductInfo= async (product_id, {name, price, category, description})=>{
    const product= await Product.update(
        {
            name: name,
            price: price,
            category: category,
            description: description
        },
        {
            where: {id: product_id},
            returning: true,
            plain: true
        }
    );
    return product;
}

const deleteProductByID= async (product_id)=>{
    const deletedProduct= await Product.destroy({
        where: {id: product_id},
        returning: true,
        plain: true
    })

    return deletedProduct;
}


module.exports= {
    createProduct,
    fetchAllProducts,
    fetchProductByCategory,
    updateProductInfo,
    fetchProductByID,
    deleteProductByID
}