const express = require('express');

const Router = express.Router();

const bookingController = require('../../controller/booking-contoller');

Router.post('/',bookingController.create);
Router.delete('/:id',bookingController.destroy);
Router.get('/:id',bookingController.get);
Router.patch('/:id',bookingController.update);
module.exports = Router;