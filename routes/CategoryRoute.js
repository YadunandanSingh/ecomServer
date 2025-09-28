const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); // Your multer middleware
const authAdmin = require('../middleware/authAdmin')
const categoryCate = require('../controller/categoryCtrl')

router.post('/category',authAdmin, upload.single('categoreImg'), categoryCate.createCate);
router.get('/category',  categoryCate.getCate);
router.put('/category/:id', authAdmin,upload.single('categoreImg'), categoryCate.updateCate);
router.delete('/category/:id', authAdmin, categoryCate.deleteCate);


module.exports = router;
