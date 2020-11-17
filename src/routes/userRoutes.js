const express = require('express');
const UserController = require('../app/controllers/UserController');

const userRouter = express.Router();

userRouter.post('/createvalid', UserController.createValid)
userRouter.post('/valid', UserController.Valid)

userRouter.post('/create', UserController.Store);

userRouter.post('/auth', UserController.Auth);

userRouter.put('/changepassword', UserController.ChangePassword);

userRouter.post('/forgot_password', UserController.ForgotPassword);

module.exports = userRouter;
