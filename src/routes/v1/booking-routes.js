const express = require('express');

const Router = express.Router();

const bookingController = require('../../controller/booking-contoller');

Router.post('/',bookingController.create);
module.exports = Router;