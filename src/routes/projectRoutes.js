const express = require('express');
const ProjectController = require('../app/controllers/ProjectController');
const authMiddleware = require('../app/middlewares/auth');

const router = express.Router();

router.use(authMiddleware)

router.get('/token_validate', ProjectController.TokenValidate)

module.exports = router;
