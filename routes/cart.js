/* Cart Routes */
const router= require('express').Router();
const {
    getOrderId, 
    getCart, 
    addToCart,
    removeProductFromCart,
    clearUserCart,
    updateProductInCart
}=  require('../controllers/cart');
module.exports= router;

//Get all cart items
router.get('/', getCart) //expects parameter with user_id

//Add item to cart
router.post('/add', getOrderId, addToCart) //expects params with user_id, and req body with product_id, quantity

//Update item quantity in cart
router.put('/update', updateProductInCart);

//Delete item from cart
router.delete('/product', removeProductFromCart);

//Delete all cart items
router.delete('/', clearUserCart);


//checkout_order = change order status from 'pending' to 'paid' (and after delivery to 'completed').
//checkout order=> initailize paystack, paystack collects user payment info, runs payment/ verify payment (webhook or whatever)/ update order status/ save auth code for further one-click payment
router.post('/checkout', (req, res, next)=>{
    const order= cart.map(item=> {
        return `${item.name} (x${item.quantity}): ${item.price} naira`
    })
    const totalPrice= cart.map(item=> item.price)
    .reduce((prev, curr)=>{ return prev + curr}); //this data will be the amount to charge user for payment.

    const orders= [...cart, {totalPrice}]
    res.send(orders);
})