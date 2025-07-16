
import { db } from './db';
import { flights } from '@shared/schema';

const returnFlights = [
  // Return flights for Chennai to Delhi route
  {
    flightNumber: "6E459",
    airline: "IndiGo",
    aircraft: "Airbus A320",
    origin: "Delhi",
    destination: "Chennai",
    departureTime: new Date("2025-07-23T15:30:00.000Z"),
    arrivalTime: new Date("2025-07-23T18:15:00.000Z"),
    duration: "2h 45m",
    price: "3900.00",
    availableSeats: 155,
    totalSeats: 180,
    cabin: "economy",
    stops: 0,
    status: "scheduled"
  },
  {
    flightNumber: "SG791",
    airline: "SpiceJet",
    aircraft: "Boeing 737",
    origin: "Delhi",
    destination: "Chennai",
    departureTime: new Date("2025-07-23T19:45:00.000Z"),
    arrivalTime: new Date("2025-07-23T22:30:00.000Z"),
    duration: "2h 45m",
    price: "3300.00",
    availableSeats: 142,
    totalSeats: 180,
    cabin: "economy",
    stops: 0,
    status: "scheduled"
  },
  {
    flightNumber: "AI889",
    airline: "Air India",
    aircraft: "Boeing 737",
    origin: "Delhi",
    destination: "Chennai",
    departureTime: new Date("2025-07-23T11:00:00.000Z"),
    arrivalTime: new Date("2025-07-23T13:45:00.000Z"),
    duration: "2h 45m",
    price: "4100.00",
    availableSeats: 120,
    totalSeats: 180,
    cabin: "economy",
    stops: 0,
    status: "scheduled"
  },
  // Return flights for Mumbai to Delhi route
  {
    flightNumber: "6E346",
    airline: "IndiGo",
    aircraft: "Airbus A320",
    origin: "Delhi",
    destination: "Mumbai",
    departureTime: new Date("2025-07-22T16:20:00.000Z"),
    arrivalTime: new Date("2025-07-22T18:35:00.000Z"),
    duration: "2h 15m",
    price: "4200.00",
    availableSeats: 148,
    totalSeats: 180,
    cabin: "economy",
    stops: 0,
    status: "scheduled"
  },
  {
    flightNumber: "SG611",
    airline: "SpiceJet",
    aircraft: "Boeing 737",
    origin: "Delhi",
    destination: "Mumbai",
    departureTime: new Date("2025-07-22T20:10:00.000Z"),
    arrivalTime: new Date("2025-07-22T22:25:00.000Z"),
    duration: "2h 15m",
    price: "3800.00",
    availableSeats: 165,
    totalSeats: 180,
    cabin: "economy",
    stops: 0,
    status: "scheduled"
  },
  // Return flights for Bangalore to Delhi route
  {
    flightNumber: "6E567",
    airline: "IndiGo",
    aircraft: "Airbus A320",
    origin: "Delhi",
    destination: "Bangalore",
    departureTime: new Date("2025-07-24T14:30:00.000Z"),
    arrivalTime: new Date("2025-07-24T17:00:00.000Z"),
    duration: "2h 30m",
    price: "4500.00",
    availableSeats: 135,
    totalSeats: 180,
    cabin: "economy",
    stops: 0,
    status: "scheduled"
  },
  {
    flightNumber: "AI845",
    airline: "Air India",
    aircraft: "Boeing 737",
    origin: "Delhi",
    destination: "Bangalore",
    departureTime: new Date("2025-07-24T18:15:00.000Z"),
    arrivalTime: new Date("2025-07-24T20:45:00.000Z"),
    duration: "2h 30m",
    price: "4800.00",
    availableSeats: 125,
    totalSeats: 180,
    cabin: "economy",
    stops: 0,
    status: "scheduled"
  },
  // Return flights for international routes
  {
    flightNumber: "Y4733",
    airline: "Volaris",
    aircraft: "Airbus A321neo",
    origin: "New York",
    destination: "Cancun",
    departureTime: new Date("2025-07-30T15:45:00.000Z"),
    arrivalTime: new Date("2025-07-30T20:00:00.000Z"),
    duration: "4h 15m",
    price: "230.00",
    availableSeats: 175,
    totalSeats: 239,
    cabin: "economy",
    stops: 0,
    status: "scheduled"
  }
];

export async function addReturnFlights() {
  try {
    console.log('Adding return flights for round trip support...');
    
    for (const flight of returnFlights) {
      await db.insert(flights).values(flight);
      console.log(`Added return flight: ${flight.flightNumber} ${flight.origin} → ${flight.destination}`);
    }
    
    console.log('✅ Return flights added successfully!');
    return { success: true, message: 'Return flights added successfully' };
  } catch (error) {
    console.error('❌ Error adding return flights:', error);
    throw error;
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  addReturnFlights()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
