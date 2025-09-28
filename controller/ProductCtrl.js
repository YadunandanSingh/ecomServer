const Products = require('../model/productModel')
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const productCtrl = {
    createCate: async (req, res) => {
        try {
            const { name, Category, price, Discont_Price, brand, quantity, discription } = req.body
            const findname = await Products.findOne({ name })
            const findcate = await Products.findOne({ Category })
            if (findname && findcate) {
                return res.status(400).json({ msg: 'product and category are allready exist' });
            }

            if (!req.file) {
                return res.status(400).json({ msg: 'file not found' });
            }
            const newCate = await new Products({
                name,
                Category,
                price,
                Discont_Price,
                brand,
                quantity,
                discription,
                imagePath: `/uploads/${req.file.filename}`,
                image: req.file.filename
            })
            newCate.save()

            res.status(200).json({
                msg: 'success'
            })

        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ msg: 'Failed to save Products to database', error: error.message });

        }

    },
    getCate: async (req, res) => {
        try {
            const products = await Products.find()
            res.status(200).json({

                product: products
            })

        } catch (error) {
            res.status(500).json({ msg: 'Failed to get products to database' });
        }


    },
    updateCate: async (req, res) => {
        try {
            const { name, Category, price, Discont_Price, brand, quantity, discription } = req.body
            const productId = req.params.id;

            // console.log(productId, name, Category, price, Discont_Price, brand, quantity, discription )
            let product = await Products.findById(productId);

            if (!product) {
                // If an image was uploaded but the product was not found, delete the new file
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(404).json({ message: 'product not found' });
            }

            const updateData = {
                name: name || product.name,
                Category: Category || product.Category,
                price: price || product.price,
                Discont_Price: Discont_Price || product.Discont_Price,
                brand: brand || product.brand,
                quantity: quantity || product.quantity,
                discription: discription || product.discription,
                image: req.file.filename || product.image,
                imagePath: ( req.file.filename == 'undefined' ?product.imagePath: `/uploads/${req.file.filename}` ) 
                // `/uploads/${req.file.filename}` || product.imagePath,
            };

            if (req.file) {
                // Check if there was an old image and delete it
                // console.log(category)
                if (product.image) {
                    const filePath = path.join(process.cwd(), 'uploads', product.image);


                    // Check if the file exists before attempting to delete it.
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                        // console.log("Deleted file:", filePath);
                    } else {
                        // console.log("File not found:", filePath);
                        return res.status(500).json({ message: 'File not found', });

                    }
                }
                // Add the path of the new image to the update data
                updateData.image = req.file.filename;
            }

            const updatedProduct = await Products.findByIdAndUpdate(
                productId,
                { $set: updateData },
                { new: true, runValidators: true }
            );

            res.status(200).json({
                msg: 'product updated successfully',
                category: updatedProduct,
            });

        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ msg: 'Failed to save Products to database', error: error.message });
        }


    },
    deleteCate: async (req, res) => {
        const { id } = req.params;

        try {
            const itemToDelete = await Products.findById(id);
            if (!itemToDelete) {
                return res.status(404).json({ message: 'Item not found' });
            }

            const imageName = itemToDelete.image;
            if (imageName) {
                try {
                    const filePath = path.join(process.cwd(), 'uploads', imageName);

                    // Check if the file exists before attempting to delete it.
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                        console.log("Deleted file:", filePath);
                    } else {
                        console.log("File not found:", filePath);
                        return res.status(500).json({ message: 'File not found', });

                    }
                } catch (error) {
                    // Log the error but don't stop the database deletion from succeeding.
                    // Return a specific error for file deletion failures
                    return res.status(500).json({ message: 'Error deleting image file', error: error.message });
                }
            }

            await Products.findByIdAndDelete(id)
            res.status(200).json({
                msg: 'Category delete successfully',

            });
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ msg: 'Failed to save Products to database', error: error.message });
        }


    },

}

module.exports = productCtrl;
