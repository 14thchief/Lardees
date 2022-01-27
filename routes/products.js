/* Product Routes */
const router= require("express").Router();
const {
    getAllProducts,
    getProductsByCat,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
}= require('../controllers/products');
module.exports= router;


router.use(['/add', '/update', '/delete'], (req, res, next)=>{
    if(!req.isAuthenticated()) return next({message: "Please login or signup to create product"})
    if(!req.user.is_admin) return next({status: 401, message: "non-admin unauthorised to create product!"})
    next()
})

router.get('/', getAllProducts);

router.get('/product', getProductById);

router.get("/cat/:category", getProductsByCat);

router.post('/add', addProduct);

router.put('/update', updateProduct);

router.delete('/delete', deleteProduct);