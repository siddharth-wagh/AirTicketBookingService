const { BookingRepository } = require("../repository/index");
const {FLIGHT_SERVER_ROUTE} = require('../config/serverConfig');
const {ServiceError} = require('../utils/index');

const axios = require('axios');
class BookingService {
    constructor() {
        this.bookingRepository = new BookingRepository();
    }

    async create(data) {
        try {
            const flightId = data.flightId;
            let getFlightRequestURL = `${FLIGHT_SERVER_ROUTE}/api/v1/flights/${flightId}`;
            
            const response = await axios.get(getFlightRequestURL);
            
            const flightdata = response.data.data
            const priceOfTheFlight = flightdata.price;
            if(data.noOfSeats>flightdata.totalSeats) {
                throw new ServiceError("Number of seats is more than available seats","Insuffecient seats");
            }

            const totalCost = priceOfTheFlight * data.noOfSeats;
            console.log(totalCost);
            const bookingPayload = {...data,totalCost};
            const booking = await this.bookingRepository.create(bookingPayload);
            const updateFlightRequestUrl = `${FLIGHT_SERVER_ROUTE}/api/v1/flights/${booking.flightId}`;
           
            await axios.patch(updateFlightRequestUrl,{totalSeats :flightdata.totalSeats-data.noOfSeats});
            const FinalBooking = await this.bookingRepository.update(booking.id,{status:'BOOKED'});
            return FinalBooking;
        } catch (error) {
           
            if(error.name=='SequelizeValidationError'||error.name=='RepositoryError') {
                throw error;
            }
            throw new ServiceError();
        }
        
    }
}

module.exports =BookingService
