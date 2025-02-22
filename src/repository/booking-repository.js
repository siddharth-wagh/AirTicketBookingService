const {Booking} = require('../models/index');
const {ValidationError,AppError} = require('../utils/index');
const {StatusCodes} = require('http-status-codes');
class BookingRepository {
    async create(data) {
        try{
            const booking = await Booking.create(data);
            return booking;
        } catch(error) {
            if(error.name === 'SequelizeValidationError') {
                throw new ValidationError(error);
            }
            throw new AppError('RepositoryError','Cannot create Booking','There was some issue creating the booking please try again later',StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async updateStatus(bookingId,data) {
        try {
            const booking = await Booking.findByPk(bookingId);
            if(data.status) {
                booking.status = "BOOKED";
                await booking.save();
            }
            console.log(booking);
            return booking;
        } catch (error) {
            if(error.name === 'SequelizeValidationError') {
                throw new ValidationError(error);
            }
            throw new AppError('RepositoryError','Cannot update Booking','There was some issue updating the booking please try again later',StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }


    async destroy(bookingId) {
        try {
            await Booking.destroy({
                where:{
                    id:bookingId
                }
            })
            return true;
        } catch (error) {
            if(error.name === 'SequelizeValidationError') {
                throw new ValidationError(error);
            }
            throw new AppError('RepositoryError','Cannot delete Booking','There was some issue deleting the booking please try again later',StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async get(bookingId) {
        try {
            const booking = await Booking.findByPk(bookingId);
            if(!booking){
                throw new AppError('RepositoryError','Cannot get Booking','Booking with this id doesnt exist',StatusCodes.INTERNAL_SERVER_ERROR);
            }
            return booking;
        } catch (error) {
            if(error.name === 'SequelizeValidationError') {
                throw new ValidationError(error);
            }
            if(error.name==='RepositoryError')
            {
                throw error;
            }
            throw new AppError('RepositoryError','Cannot get Booking','There was some issue getting the booking please try again later',StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async update(bookingId,data) {
        try {
            const response = await this.get(bookingId);
            if(response)
            {
                await Booking.update(data,{
                     where:{
                        id:bookingId
                    }
                });
            }
            return true;
        } catch (error) {
            if(error.name === 'SequelizeValidationError') {
                throw new ValidationError(error);
            }
            if(error.name==='RepositoryError')
            {
                throw error;
            }
            throw new AppError('RepositoryError','Cannot get Booking','There was some issue getting the booking please try again later',StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports = BookingRepository
