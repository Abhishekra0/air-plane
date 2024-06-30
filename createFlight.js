/*import mongoose from 'mongoose';
import Flight from './models/Flight.js';

const url = 'mongodb://localhost:27017/flgp';

const popularCities = [
  'Delhi',
  'Mumbai',
  'Bangalore',
  'Chennai',
  'Kolkata',
  'Hyderabad',
  'Ahmedabad',
  'Pune',
  'Goa',
  'Jaipur',
  'Dubai',
  'NewYork',
  'London'
];

function getRandomTime() {
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 60);
  return { hours, minutes };
}

function addDurationToTime({ hours, minutes }, durationHours, durationMinutes) {
  const newMinutes = minutes + durationMinutes;
  const newHours = hours + durationHours + Math.floor(newMinutes / 60);
  return { hours: newHours % 24, minutes: newMinutes % 60 };
}

function formatTime({ hours, minutes }) {
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

async function createNewFlights(date) {
  try {
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to database');

    for (let i = 0; i < 100; i++) {
      const departureCity = popularCities[Math.floor(Math.random() * popularCities.length)];
      let arrivalCity;
      do {
        arrivalCity = popularCities[Math.floor(Math.random() * popularCities.length)];
      } while (arrivalCity === departureCity);

      const departureTime = getRandomTime();
      const durationHours = Math.floor(Math.random() * 10) + 1; // Duration between 1 and 10 hours
      const durationMinutes = Math.floor(Math.random() * 60); // Additional random minutes for duration

      const arrivalTime = addDurationToTime(departureTime, durationHours, durationMinutes);
      const duration = `${durationHours}h ${String(durationMinutes).padStart(2, '0')}m`;

      const flightData = {
        flightNumber: `JE10${String(i).padStart(2, '0')}`,
        departureAirport: departureCity,
        arrivalAirport: arrivalCity,
        departureTime: formatTime(departureTime),
        arrivalTime: formatTime(arrivalTime),
        date: date,
        duration: duration,
        price: (Math.floor(Math.random() * 1000) + 100) * 10
      };

      const newFlight = await Flight.create(flightData);
      console.log('Flight created successfully:', newFlight);
    }
    
  } catch (error) {
    console.error('Error creating flights:', error);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from database');
  }
}

// Call the function with a specific date
createNewFlights('2024-06-14'); // Change the date here as needed
createNewFlights('2024-06-15');
createNewFlights('2024-06-16');
createNewFlights('2024-06-17');
createNewFlights('2024-06-18');
createNewFlights('2024-06-19'); // Change the date here as needed
createNewFlights('2024-06-20');
createNewFlights('2024-06-21');
createNewFlights('2024-06-22');
createNewFlights('2024-06-23');
createNewFlights('2024-06-24'); // Change the date here as needed
createNewFlights('2024-06-25');
createNewFlights('2024-06-26');
createNewFlights('2024-06-27');
createNewFlights('2024-06-28');
createNewFlights('2024-06-29'); // Change the date here as needed
createNewFlights('2024-06-30');

*/

import mongoose from 'mongoose';
import Flight from './models/Flight.js';

const url = 'mongodb://localhost:27017/flgp';

const popularCities = [
  'Delhi',
  'Mumbai',
  'Bangalore',
  'Chennai',
  'Kolkata',
  'Hyderabad',
  'Ahmedabad',
  'Pune',
  'Goa',
  'Jaipur',
  'Dubai',
  'NewYork',
  'London'
];

function getRandomTime() {
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 60);
  return { hours, minutes };
}

function addDurationToTime({ hours, minutes }, durationHours, durationMinutes) {
  const newMinutes = minutes + durationMinutes;
  const newHours = hours + durationHours + Math.floor(newMinutes / 60);
  return { hours: newHours % 24, minutes: newMinutes % 60 };
}

function formatTime({ hours, minutes }) {
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function getDatesForNextTwoMonths() {
  const dates = [];
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  // Add dates for the current month
  for (let day = currentDate.getDate(); day <= new Date(currentYear, currentMonth + 1, 0).getDate(); day++) {
    dates.push(new Date(currentYear, currentMonth, day));
  }
  
  // Add dates for the next month
  for (let day = 1; day <= new Date(currentYear, currentMonth + 2, 0).getDate(); day++) {
    dates.push(new Date(currentYear, currentMonth + 1, day));
  }

  return dates;
}

async function createNewFlights() {
  try {
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to database');

    const dates = getDatesForNextTwoMonths();

    for (const date of dates) {
      for (let i = 0; i < 10; i++) {
        const departureCity = popularCities[Math.floor(Math.random() * popularCities.length)];
        let arrivalCity;
        do {
          arrivalCity = popularCities[Math.floor(Math.random() * popularCities.length)];
        } while (arrivalCity === departureCity);

        const departureTime = getRandomTime();
        const durationHours = Math.floor(Math.random() * 10) + 1; // Duration between 1 and 10 hours
        const durationMinutes = Math.floor(Math.random() * 60); // Additional random minutes for duration

        const arrivalTime = addDurationToTime(departureTime, durationHours, durationMinutes);
        const duration = `${durationHours}h ${String(durationMinutes).padStart(2, '0')}m`;

        const flightData = {
          flightNumber: `JE10${String(i).padStart(2, '0')}`,
          departureAirport: departureCity,
          arrivalAirport: arrivalCity,
          departureTime: formatTime(departureTime),
          arrivalTime: formatTime(arrivalTime),
          date: date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
          duration: duration,
          price: (Math.floor(Math.random() * 1000) + 100) * 10
        };

        const newFlight = await Flight.create(flightData);
        console.log('Flight created successfully:', newFlight);
      }
    }
    
  } catch (error) {
    console.error('Error creating flights:', error);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from database');
  }
}

// Call the function to create flights
createNewFlights();

