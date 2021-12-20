/* Cart Routes */
const router= require('express').Router();
const db=  require('../controllers/cart');
module.exports= router;

//Get all cart items
router.get('/:user_id',db.getOrderId, db.getCart) //expects parameter with user_id

//Add item to cart
router.post('/', db.createOrder, db.addToCart) //expects body with user_id, product_id, quantity

//!! SET-UP PUT/UPDATE ACTION !!

//Delete item from cart
router.delete('/:product_id',(req, res, next)=>{
    const toDeleteIndex= cart.findIndex(item=> item.id == req.params.product_id);
    if(toDeleteIndex > -1){  
        cart.splice(toDeleteIndex, 1);
        res.status(204).send();
        console.log(cart)
    }
})

//submit/checkout cart orders
router.post('/checkout', (req, res, next)=>{
    const order= cart.map(item=> {
        return `${item.name} (x${item.quantity}): ${item.price} naira`
    })
    const totalPrice= cart.map(item=> item.price)
    .reduce((prev, curr)=>{ return prev + curr}); //this data will be the amount to charge user for payment.

    const orders= [...cart, {totalPrice}]
    res.send(orders);
})