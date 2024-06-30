
/*import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema({
  flightNumber: { type: String, required: true },
  departureAirport: { type: String, required: true },
  arrivalAirport: { type: String, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  date: { type: String, required: true },
  duration: { type: String, required: true },
  price: { type: Number, required: true }
});

flightSchema.statics.createFlight = async function(flightData) {
  try {
    const flight = new this(flightData);
    await flight.save();
    return flight;
  } catch (error) {
    throw new Error('Error creating flight: ' + error.message);
  }
};

const Flight = mongoose.model('Flight', flightSchema);

export default Flight;*/

import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema({
  flightNumber: { type: String, required: true },
  departureAirport: { type: String, required: true },
  arrivalAirport: { type: String, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  date: { type: String, required: true },
  duration: { type: String, required: true },
  price: { type: Number, required: true },
  bookedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Reference to the User model
});

flightSchema.statics.createFlight = async function(flightData) {
  try {
    const flight = new this(flightData);
    await flight.save();
    return flight;
  } catch (error) {
    throw new Error('Error creating flight: ' + error.message);
  }
};

const Flight = mongoose.model('Flight', flightSchema);

export default Flight;
