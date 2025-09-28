const mongoose = require('mongoose');

const PaymentModel = new mongoose.Schema({
  orderDate:{
    type:Date,
    default: Date.now
  },
  payStatus:{
    type:String
  },
   SippmentStatus: {
    type:String,
    default: 'Panding'

   }
  
},{strict:false});

module.exports = mongoose.model('Payment', PaymentModel);
