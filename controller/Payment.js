
const Payment = require('../model/Payment')
const Razorpay = require('razorpay')

const instance = new Razorpay({
    key_id: 'rzp_test_RLiilKT4GIhfef',
    key_secret: 'oHVvmMLxgJs2f0o8lGu9UiE8',
});


const PaymentControler = {
    CheckOut: async (req, res) => {
        const { amount, CartItem, UserShipping, UserId } = req.body

        var options = {
            amount: amount * 100,  // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };
        const order = await instance.orders.create(options);

        res.status(200).json({
            msg: 'success',
            OrderId: order.id,
            amount: amount,
            CartItem,
            UserShipping,
            UserId,
            Status: order.status
        })
    },
    verify: async (req, res) => {

        const {
            orderId,
            paymentId,
            amount,
            orderItem,
            userId,
            userShipping
        } = req.body

        let orderConfirm = await Payment.create({
            orderId,
            paymentId,
            amount,
            orderItem,
            userId,
            userShipping,
            paymentStatus: 'Paid',

        })

        res.status(200).json({
            msg: 'Payment Successfull...',
            orderConfirm,
            success: true

        })
    },
    getAllPaymentData: async (req, res) => {
        try {
            const PaymentData = await Payment.find()
            console.log("PaymentData :", PaymentData);

            if (!PaymentData) return res.status(400).json({ msg: "Payment Data not found" });

            res.json(PaymentData);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    UpdateOrderData: async (req, res) => {
        try {
            const { SippmentStatus } = req.body
            const OrderId = req.params.id;

            let order = await Payment.findById(OrderId);

            if (!order) {
                // If an image was uploaded but the product was not found, delete the new file

                return res.status(404).json({ message: 'order not found' });
            }

            const updateData = {
                SippmentStatus: SippmentStatus
            };

            const updatedOrder = await Payment.findByIdAndUpdate(
                OrderId,
                { $set: updateData },
                { new: true, runValidators: true }
            )
            let Allorder = await Payment.find();

            console.log('payment server chek',Allorder)

            res.json(Allorder); 
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }
}

module.exports = PaymentControler;