const express = require('express');

const Router = express.Router();
const V1ApiRoutes = require('./v1/index');
Router.use('/v1',V1ApiRoutes);

module.exports = Router;