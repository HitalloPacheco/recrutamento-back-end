const express = require('express');
const UserController = require('../app/controllers/UserController');

const userRouter = express.Router();

userRouter.post('/create', UserController.Store);

userRouter.get('/auth', UserController.Auth);

userRouter.put('/changepassword', UserController.ChangePassword);

module.exports = userRouter;
