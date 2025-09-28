jwt = require("jsonwebtoken");
const User = require('../model/userModol');
const authAdmin = (req, res, next) => {
    try {
        const token = req.header("Authorization");
        if (!token) return res.status(400).json({ msg: " Authentication Not Found." });

        jwt.verify (token, process.env.ACCESS_TOKEN_SECRET, async(err, user) => {
            if (err) return res.status(400).json({ msg: "Admin Invalid Authentication." });
            const finduser = await User.findById(user.id).select('-password');

            if(finduser.role === 0 ){
                return res.status(400).json({ msg: "Admin Invalid Authentication." });
            }
            req.user = user;
            console.log("admin role :",finduser.role)
            next();
        });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
        
    }
}

module.exports = authAdmin;