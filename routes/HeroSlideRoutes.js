const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); // Your multer middleware
const HeroSlide = require('../model/HeroSlideModel'); // Your Mongoose model
const auth = require('../middleware/auth'); // If you are using this
const HerloSlideCtrl = require('../controller/HeroSlideCtrl');
const authAdmin = require('../middleware/authAdmin')

// Route to upload a new hero slide
// Use `upload.single('myImage')` as middleware directly in the route chain
router.get('/allSlide',  HerloSlideCtrl.getHeroSlides);
router.post('/upload', authAdmin, upload.single('ImageSlide'), HerloSlideCtrl.createHeroSlide);
router.delete('/delete/:id', authAdmin,HerloSlideCtrl.deleteHeloSlide);


module.exports = router;