const { BookingService } = require('../services/index');

const {StatusCodes} = require('http-status-codes');


const bookingService = new BookingService();
const create = async(req,res) => {
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

const destroy = async (req,res) => {
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
const get = async (req,res) => {
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

const update = async (req,res) =>{
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

module.exports = {
    create,
    destroy,
    get,
    update
}