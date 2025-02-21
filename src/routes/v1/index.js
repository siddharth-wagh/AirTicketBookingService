const express = require('express');

const Router = express.Router();
const bookingRouter = require('./booking-routes');
Router.use('/booking',bookingRouter);

module.exports = Router;