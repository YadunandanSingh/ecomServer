const upload = require('../middleware/upload'); // Your multer middleware
const HeroSlide = require('../model/HeroSlideModel'); // Your Mongoose model
const auth = require('../middleware/auth'); // If you are using this
const fs = require('fs');
const path = require('path');


const HerloSlideCtrl = {
    createHeroSlide: async (req, res) => {
        // At this point, Multer has already processed the file, so req.file is available.
        // console.log("req.file:", req.file);

        // If there is an error from Multer, your middleware should have handled it.
        // So you can check for a file directly.
        if (!req.file) {
            return res.status(400).json({ msg: 'No file selected' });
        }

        try {
            const newImage = new HeroSlide({
                name: req.body.name || req.file.filename,
                imagePath: `/uploads/${req.file.filename}`,
            });
            await newImage.save();
            res.status(200).json({
                msg: 'Image uploaded successfully',
                image: newImage,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Failed to save image to database' });
        }
    },

    getHeroSlides: async (req, res) => {
        try {
            const slides = await HeroSlide.find();
            res.status(200).json(slides);
        } catch (error) {
            res.status(500).json({ msg: 'Failed to retrieve slides' });
        }
    },


    deleteHeloSlide: async (req, res) => {
        const { id } = req.params;

        try {
            // 1. First, find the document to get the image name.
            const itemToDelete = await HeroSlide.findById(id);
            if (!itemToDelete) {
                return res.status(404).json({ message: 'Item not found' });
            }

            // Store the image name from the document before it is deleted.
            const imageName = itemToDelete.name;
            console.log(imageName)
            // 2. Now, delete the document from the database.
            await HeroSlide.findByIdAndDelete(id);

            // 3. Proceed with deleting the image from the filesystem.
            if (imageName) {
                try {
                    const filePath = path.join(process.cwd(), 'uploads', imageName);

                    // Check if the file exists before attempting to delete it.
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                        // console.log("Deleted file:", filePath);
                    } else {
                        // console.log("File not found:", filePath);
                    return res.status(500).json({ message: 'File not found',});

                    }
                } catch (error) {
                    // Log the error but don't stop the database deletion from succeeding.
                    // Return a specific error for file deletion failures
                    return res.status(500).json({ message: 'Error deleting image file', error: error.message });
                }
            }

            res.status(200).json({ message: 'Item deleted successfully', deletedItem: itemToDelete });
        } catch (error) {
            console.error("Deletion process error:", error);
            return res.status(500).json({ message: 'Error during deletion process', error: error.message });
        }
    }

};

module.exports = HerloSlideCtrl;