const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); // Your multer middleware
const authAdmin = require('../middleware/authAdmin')
const Products = require('../controller/ProductCtrl')

router.post('/Products',authAdmin, upload.single('ProductImg'), Products.createCate);
router.get('/Products',  Products.getCate);
router.put('/Products/:id', authAdmin,upload.single('ProductImg'), Products.updateCate);
router.delete('/Products/:id', authAdmin, Products.deleteCate);


module.exports = router;
