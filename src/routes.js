const express = require('express');
const UserController = require('./app/controllers/UserController')

const routes = express.Router();

routes.post('/users', function (req, res) {
  UserController.store});

module.exports = routes;
