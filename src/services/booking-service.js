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
            
            const bookingPayload = {...data,totalCost};
            const booking = await this.bookingRepository.create(bookingPayload);
            const updateFlightRequestUrl = `${FLIGHT_SERVER_ROUTE}/api/v1/flights/${booking.flightId}`;
           
            await axios.patch(updateFlightRequestUrl,{totalSeats :flightdata.totalSeats-data.noOfSeats});
            const FinalBooking = await this.bookingRepository.updateStatus(booking.id,{status:'BOOKED'});
            return FinalBooking;
        } catch (error) {
           
            if(error.name=='SequelizeValidationError'||error.name=='RepositoryError') {
                throw error;
            }
            throw new ServiceError();
        }
        
    }


    async destroyBooking(bookingId) {
        try {
            //getting the booking
            const booking = await this.bookingRepository.get(bookingId);
            const seats = booking.noOfSeats;

            //getting the flight with for this booking
            let getFlightRequestURL = `${FLIGHT_SERVER_ROUTE}/api/v1/flights/${booking.flightId}`;
            const response = await axios.get(getFlightRequestURL);      
            const flightdata = response.data.data;

            //deleting the booking for a flight
            const delresponse = await this.bookingRepository.destroy(bookingId);

            //updating the number of seats in the flight
            const updateFlightRequestUrl = `${FLIGHT_SERVER_ROUTE}/api/v1/flights/${booking.flightId}`;
            await axios.patch(updateFlightRequestUrl,{totalSeats:flightdata.totalSeats+seats});      

            return delresponse;
        } catch (error) {
            if(error.name=='SequelizeValidationError'||error.name=='RepositoryError') {
                throw error;
            }
            throw new ServiceError();
        }
    }

    async getBooking(bookingId) {
        try{
            const booking = await this.bookingRepository.get(bookingId);
            return booking;
        } catch (error) {
            if(error.name=='SequelizeValidationError'||error.name=='RepositoryError') {
                throw error;
            }
            throw new ServiceError();
        }
    }

    async updateBooking(bookingId,data) {
        try {
            const newFlightId = data.flightId;
            const newNoOfSeats = data.noOfSeats;
            const oldBooking = await this.bookingRepository.get(bookingId);
            const oldFlightId = oldBooking.flightId;
            const oldNoOfSeats = oldBooking.noOfSeats;


            
            //if the flight is same 
            if(newFlightId==oldFlightId) {
                const getFlightRequestURL = `${FLIGHT_SERVER_ROUTE}/api/v1/flights/${oldFlightId}`;
                
                const response = await axios.get(getFlightRequestURL);
               
                const flight = response.data.data;
                if(flight.totalSeats+oldNoOfSeats<newNoOfSeats) {
                    throw new ServiceError("Number of seats is more than available seats","Insuffecient seats");
                    
                }
               
                await this.bookingRepository.update(bookingId,{flightId:oldFlightId,noOfSeats:newNoOfSeats,totalCost:(newNoOfSeats*flight.price)});
                

                await axios.patch(getFlightRequestURL,{totalSeats:flight.totalSeats+oldNoOfSeats-newNoOfSeats});
                
                return true;

            }
            else {
                const getOldFlightRequestURL = `${FLIGHT_SERVER_ROUTE}/api/v1/flights/${oldFlightId}`;
                const getNewFlightRequestURL = `${FLIGHT_SERVER_ROUTE}/api/v1/flights/${newFlightId}`;
                const response1 = await axios.get(getOldFlightRequestURL);
                const response2 = await axios.get(getNewFlightRequestURL);
                const oldFlight = response1.data.data;
                const newFlight = response2.data.data;
                if(newFlight.totalSeats<newNoOfSeats) {
                    throw new ServiceError("Number of seats is more than available seats","Insuffecient seats");
                    
                }

                await this.bookingRepository.update(bookingId,{flightId:newFlightId,noOfSeats:newNoOfSeats,totalCost:(newNoOfSeats*newFlight.price)});

                await axios.patch(getOldFlightRequestURL,{totalSeats:oldFlight.totalSeats+oldNoOfSeats});
                await axios.patch(getNewFlightRequestURL,{totalSeats:newFlight.totalSeats-newNoOfSeats});
            }
            return true;

        } catch (error) {
            if(error.name=='SequelizeValidationError'||error.name=='RepositoryError') {
                throw error;
            }
            console.log(error);
            throw new ServiceError();
        }
    }
}

module.exports = BookingService
