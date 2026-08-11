const express = require('express');
const authRouter = express.Router();

const authController = require("../controller/authController")
// Example route
authRouter.get('/validation', authController.authCheck);
authRouter.post('/Login', authController.postLogin);
authRouter.post('/Logout', authController.postLogout);
authRouter.post('/Signup', authController.postSignup);
authRouter.post('/updateUser', authController.postUpdateUser);

module.exports = authRouter;