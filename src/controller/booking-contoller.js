const { BookingService } = require('../services/index');

const {StatusCodes} = require('http-status-codes');
const {createChannel,publishMessage} = require('../utils/messageQueue');
const {REMINDER_BINDING_KEY} = require('../config/serverConfig');
const bookingService = new BookingService();
class BookingController {
        
    constructor() {
        
    }
    async sendMessageToQueue(req,res) {
        const channel = await createChannel();
        const data = {
            message:"success"
        }
        publishMessage(channel,REMINDER_BINDING_KEY,JSON.stringify(data));
        return res.status(200).json({
            message:"Successfully published an event"
        })
    }
    async create(req,res) {
        try {
            
            const response = await bookingService.create(req.body);

            return res.status(StatusCodes.OK).json({
                data:response,
                message:"Successfully Booked a flight",
                success:true,
                error:{}
            })
        } catch (error) {
        
            return res.status(error.statusCode).json({
                data:{},
                message:error.message,
                success:false,
                err:error.explanation
            })
        }
    }

    async destroy(req,res) {
        try {
            
            const response = await bookingService.destroyBooking(req.params.id);

            return res.status(StatusCodes.OK).json({
                data:response,
                message:"Successfully deleted a booking",
                success:true,
                error:{}
            })
        } catch (error) {
        
            return res.status(error.statusCode).json({
                data:{},
                message:error.message,
                success:false,
                err:error.explanation
            })
        }
    }
    async get (req,res) {
        try {
            
            const response = await bookingService.getBooking(req.params.id);

            return res.status(StatusCodes.OK).json({
                data:response,
                message:"Successfully fetched booking",
                success:true,
                error:{}
            })
        } catch (error) {
        
            return res.status(error.statusCode).json({
                data:{},
                message:error.message,
                success:false,
                err:error.explanation
            })
        }
    }

    async update  (req,res) {
        try {
            const response = await bookingService.updateBooking(req.params.id,req.body);
            return res.status(StatusCodes.OK).json({
                data:response,
                success:true,
                message:"Successfully updated the booking",
                err:{}
            });
        } catch (error) {
            res.status(error.statusCode).json({
                data:{},
                success:false,
                message:error.message,
                err:error.explanation
            })
        }
    }

}
module.exports = {
    BookingController
}