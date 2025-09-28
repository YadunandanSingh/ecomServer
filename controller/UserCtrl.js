const bcrypt = require('bcryptjs'); // For password hashing
const User = require('../model/userModol');
const jwt = require('jsonwebtoken');

const UserCtrl = {
    Register: async (req, res) => {
        try {
            const { name, email, phone, password } = req.body;
            // Check if data is provided
            console.log(req.body)
            if (!name || !email || !password) {
                return res.status(400).json({ success: false, msg: "Please fill in all fields." });
            }
            // Check if user already exists
            const existingUser = await User.find({ email });
            if (existingUser.length > 0) {
                return res.status(400).json({ success: false, msg: "User email already exists." });
            }
            // Hash the password and create a new userModol
            const Password = await bcrypt.hash(password, 10);
            const newUser = await new User({ name, email, phone, password: Password });
            await newUser.save();

            const accessToken = createAccessToken({ id: newUser._id });
            const refreshToken = createRefreshToken({ id: newUser._id });

            // Set refresh token in cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                path: '/user/refresh_token',
            })
            console.log("accessToken :", accessToken)

            res.status(201).json({ success: true, msg: "User registered successfully!", token: accessToken });
        } catch (error) {
            res.status(500).json({ success: false, msg: error.message });

        }
    },

    Login: async (req, res) => {
        try {
            const { email, password } = req.body;
            // Check if data is provided
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ msg: "User does not exist." });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ msg: "Incorrect password." });
            }

            const accessToken = createAccessToken({ id: user._id });
            const refreshToken = createRefreshToken({ id: user._id });


            // Set refresh token in cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                path: '/user/refresh_token',
            })

            res.json({ accessToken });
        } catch (error) {
            return res.status(500).json({ msg: error.message });

        }
    },
    logout: (req, res) => {
        try {
            res.clearCookie('refreshToken', { path: '/user/refresh_token' });
            return res.json({ msg: "Logged out" });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    refreshToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshToken;
            if (!rf_token) return res.status(400).json({ msg: "Please Login or Register" });

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({ msg: "Please Login or Register" });
                console.log("user :", user)

                const accessToken = createAccessToken({ id: user.id });
                res.json({ user, accessToken });
            });
        } catch (error) {

            return res.status(500).json({ msg: error.message });
        }
    },
    getUser: async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('-password');
            console.log("getUser :", user);

            if (!user) return res.status(400).json({ msg: "User does not exist." });

            res.json(user);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    UpdateCart: async (req, res) => {
        try {
            const { productId, name, price, quantity, imagePath } = req.body;
            const userId = req.params.id;

            // Check if the user exists
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const cartItem = {
                productId,
                name,
                price,
                quantity,
                imagePath,
            };

            // Find if the item already exists in the cart
            const itemIndex = user.cart.findIndex(item => item.productId === productId);

            let updatedUser;
            if (itemIndex > -1) {
                // If the item exists, update its quantity
                updatedUser = await User.findOneAndUpdate(
                    { "_id": userId, "cart.productId": productId },
                    { "$inc": { "cart.$.quantity": quantity } }, // Use $inc to increment the quantity
                    { new: true } // `new: true` returns the updated document
                ).select('-password');
            } else {
                // If the item does not exist, push it to the cart array
                updatedUser = await User.findByIdAndUpdate(
                    userId,
                    { $push: { cart: cartItem } },
                    { new: true }
                ).select('-password');
            }

            if (!updatedUser) {
                return res.status(500).json({ message: 'Failed to update cart' });
            }

            res.status(200).json({
                message: 'Cart updated successfully',
                user: updatedUser
            });

        } catch (error) {
            console.error("Error updating cart:", error);
            return res.status(500).json({ message: error.message });
        }
    },
    UpdateCartItem: async (req, res) => {
        try {
            const { productId } = req.body;
            const userId = req.params.id;

            // Check if user exists
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Find the item in the cart
            const itemIndex = user.cart.findIndex(item => item.productId === productId);
            if (itemIndex === -1) {
                return res.status(404).json({ message: 'Item not found in cart' });
            }

            let updatedUser;

            if (user.cart[itemIndex].quantity > 1) {
                // ✅ Decrease quantity by 1
                updatedUser = await User.findOneAndUpdate(
                    { _id: userId, "cart.productId": productId },
                    { $inc: { "cart.$.quantity": -1 } },
                    { new: true }
                ).select("-password");
            } else {
                // ✅ If quantity is 1, remove the item
                updatedUser = await User.findByIdAndUpdate(
                    userId,
                    { $pull: { cart: { productId } } },
                    { new: true }
                ).select("-password");
            }

            res.status(200).json({
                message: "Cart updated successfully",
                user: updatedUser,
            });

        } catch (error) {
            console.error("Error decreasing/removing cart item:", error);
            return res.status(500).json({ message: error.message });
        }
    },
    RemoveCartItem: async (req, res) => {
        try {
            const { productId } = req.body;
            const userId = req.params.id;

            // Check if user exists
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Find the item in the cart
            // const itemIndex = user.cart.findIndex(item => item.productId === productId);
            // if (itemIndex === -1) {
            //     return res.status(404).json({ message: 'Item not found in cart' });
            // }

            let updatedUser;

            updatedUser = await User.findByIdAndUpdate(
                userId,
                { $pull: { cart: { productId } } },
                { new: true }
            ).select("-password");

            res.status(200).json({
                message: "itemremove  successfully",
                user: updatedUser,
            });

        } catch (error) {
            console.error("Error decreasing/removing cart item:", error);
            return res.status(500).json({ message: error.message });
        }
    },

    createAddress: async (req, res) => {
        try {
            const { firstname, lastname, email, phone, houseNo, colony, country, city, landmark, pincode } = req.body
            const userId = req.params.id;

            // Check if the user exists
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }


            const newAddress = {
                addressId: `addressId_${Date.now()}`,
                firstname,
                lastname,
                email,
                phone,
                houseNo,
                colony,
                country,
                city,
                landmark,
                pincode
            }
              updatedAddress = await User.findByIdAndUpdate(
                    userId,
                    { $push: { address: newAddress } },
                    { new: true }
                ).select('-password');

            res.status(200).json({
                msg: 'success',
                user: updatedAddress,
            })

        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ msg: 'Failed to save Address in database', error: error.message });

        }

    },
    RemoveAddress: async (req, res) => {
        try {
            const { addressId } = req.body;
            const userId = req.params.id;

            // Check if user exists
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Find the item in the cart
            const itemIndex = user.address.findIndex(item => item.addressId === addressId);
            if (itemIndex === -1) {
                return res.status(404).json({ message: 'Address not found' });
            }

            let updatedAddress;

            updatedAddress = await User.findByIdAndUpdate(
                userId,
                { $pull: { address: { addressId } } },
                { new: true }
            ).select("-password");

            res.status(200).json({
                message: "Address remove successfully",
                user: updatedAddress,
            });

        } catch (error) {
            console.error("Error decreasing/removing cart item:", error);
            return res.status(500).json({ message: error.message });
        }
    },

}
const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
};

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

module.exports = UserCtrl;