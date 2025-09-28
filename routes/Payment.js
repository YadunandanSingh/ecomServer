const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin')

const Payment = require('../controller/Payment');


// checkout
router.post('/checkout', Payment.CheckOut);
router.post('/verify-payment',  Payment.verify); 
router.get('/getAll-payment',auth, Payment.getAllPaymentData); 
router.put('/order/:id', authAdmin, Payment.UpdateOrderData);





module.exports = router;
