const express = require('express');
// const {createChannel} = require('../../utils/messageQueue');
const Router = express.Router();

// const channel = await createChannel();

const {BookingController} = require('../../controller/booking-contoller');
const bookingController = new BookingController();
Router.post('/',bookingController.create);
Router.delete('/:id',bookingController.destroy);
Router.get('/:id',bookingController.get);
Router.patch('/:id',bookingController.update);
Router.post('/publish',bookingController.sendMessageToQueue);
module.exports = Router;