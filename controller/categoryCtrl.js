const Category = require('../model/CategoryModel')
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const CategoryCtrl = {
    createCate: async (req, res) => {
        try {
            const { name } = req.body
            const findcate = await Category.findOne({ name })

            if (findcate) {
                return res.status(400).json({ msg: 'category allready exist' });
            }
            if (!name) {
                return res.status(400).json({ msg: 'name  are requied filds' });
            }
            if (!req.file) {
                return res.status(400).json({ msg: 'file not found' });
            }

            const newCate = await new Category({
                name,
                imagePath: `/uploads/${req.file.filename}`,
                image: req.file.filename
            })
            newCate.save()

            res.status(200).json({
                msg: 'success'
            })

        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ msg: 'Failed to save Category to database', error: error.message });
        }
    },
    getCate: async (req, res) => {
        try {
            const category = await Category.find()
            res.status(200).json({

                category: category
            })

        } catch (error) {
            res.status(500).json({ msg: 'Failed to get Category to database' });
        }

    },
    updateCate: async (req, res) => {
        try {
            const { name } = req.body;
            const categoryId = req.params.id;

            // Find the category to get the old image path
            let category = await Category.findById(categoryId);

            if (!category) {
                // If an image was uploaded but the category was not found, delete the new file
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(404).json({ message: 'Category not found' });
            }


            // Prepare the update data

            const updateData = { name: name || category.name, imagePath: `/uploads/${req.file.filename}` || Category.imagePath };
            // Handle image update if a new image is provided
            if (req.file) {
                // Check if there was an old image and delete it
                // console.log(category)
                if (category.image) {
                    const filePath = path.join(process.cwd(), 'uploads', category.image);


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



            // Use findByIdAndUpdate to update the document and get the new version
            const updatedCategory = await Category.findByIdAndUpdate(
                categoryId,
                { $set: updateData },
                { new: true, runValidators: true }
            );


            res.status(200).json({
                msg: 'Category updated successfully',
                category: updatedCategory,
            });

        } catch (error) {
            console.error(error);
            // If an error occurs after a file was uploaded, clean up the file
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            res.status(500).json({ msg: 'Failed to update Category', error: error.message });
        }

    },
    deleteCate: async (req, res) => {
        const { id } = req.params;

        try {
            const itemToDelete = await Category.findById(id);
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

            await Category.findByIdAndDelete(id)
            res.status(200).json({
                msg: 'Category delete successfully',

            });

        } catch (error) {
            res.status(500).json({ msg: 'Failed to delete Category to database', error: error.message });
        }

    },

}

module.exports = CategoryCtrl;
