const Router = require('express').Router();
const UserCtrl = require('../controller/UserCtrl');
const auth = require('../middleware/auth');

Router.route('/Register')
.post(UserCtrl.Register)

Router.route('/refresh_token')
.post(UserCtrl.refreshToken)

Router.route('/login')
.post(UserCtrl.Login)

Router.route('/logout')
.post(UserCtrl.logout)

Router.get('/userInfo',auth ,UserCtrl.getUser)
Router.put('/userCart/:id',auth ,UserCtrl.UpdateCart)
Router.put('/removeItem/:id',auth ,UserCtrl.UpdateCartItem)
Router.put('/removeCartItem/:id',auth ,UserCtrl.RemoveCartItem)

Router.put('/AddAddress/:id',auth ,UserCtrl.createAddress)
Router.put('/RemoveAddress/:id',auth ,UserCtrl.RemoveAddress)




module.exports = Router;
 