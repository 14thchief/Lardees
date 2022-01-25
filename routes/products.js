/* Product Routes */
const router= require("express").Router();
const db= require('../controllers/products');
module.exports= router;



/*router.param('category', (req, res, next)=>{
    const category= req.params.category;
    const products= productsDb.filter(product=> product.categories.includes(category))
    req.products= products;
    next()
})

router.param('product_id', (req, res, next)=>{
    const id= req.params.product_id;
    const product= productsDb.filter(product=> product.id == id)
    next()
})*/


router.get('/', db.getAllProducts);

router.get("/categories/:category", db.getProductsByCat);
router.get('/:product_id', db.getProductsById);

router.post('/add', db.addProduct);

router.put('/:product_id', db.updateProduct);

router.delete('/:product_id', db.deleteProduct);