
import { db } from './db';
import { flights } from '@shared/schema';

const qatarFlightsData = [
  {
    flightNumber: "QR729",
    airline: "Qatar Airways",
    aircraft: "Boeing 777-300ER",
    origin: "Doha",
    destination: "New York",
    departureTime: new Date("2025-07-23T08:00:00.000Z"),
    arrivalTime: new Date("2025-07-23T14:30:00.000Z"),
    duration: "14h 30m",
    price: "1250.00",
    availableSeats: 200,
    totalSeats: 350,
    cabin: "economy",
    stops: 0,
    status: "scheduled"
  },
  {
    flightNumber: "QR001",
    airline: "Qatar Airways",
    aircraft: "Airbus A350-1000",
    origin: "London",
    destination: "Doha",
    departureTime: new Date("2025-07-24T10:15:00.000Z"),
    arrivalTime: new Date("2025-07-24T18:00:00.000Z"),
    duration: "6h 45m",
    price: "720.00",
    availableSeats: 85,
    totalSeats: 327,
    cabin: "economy",
    stops: 0,
    status: "scheduled"
  },
  {
    flightNumber: "QR139",
    airline: "Qatar Airways",
    aircraft: "Boeing 787-9",
    origin: "Paris",
    destination: "Doha",
    departureTime: new Date("2025-07-25T14:45:00.000Z"),
    arrivalTime: new Date("2025-07-25T22:30:00.000Z"),
    duration: "7h 45m",
    price: "680.00",
    availableSeats: 110,
    totalSeats: 311,
    cabin: "economy",
    stops: 0,
    status: "scheduled"
  },
  {
    flightNumber: "QR921",
    airline: "Qatar Airways",
    aircraft: "Airbus A350-900",
    origin: "Doha",
    destination: "Sydney",
    departureTime: new Date("2025-07-26T02:00:00.000Z"),
    arrivalTime: new Date("2025-07-27T01:00:00.000Z"),
    duration: "14h 0m",
    price: "1850.00",
    availableSeats: 90,
    totalSeats: 283,
    cabin: "economy",
    stops: 0,
    status: "scheduled"
  },
  {
    flightNumber: "QR841",
    airline: "Qatar Airways",
    aircraft: "Boeing 777-200LR",
    origin: "Tokyo",
    destination: "Doha",
    departureTime: new Date("2025-07-27T19:00:00.000Z"),
    arrivalTime: new Date("2025-07-28T00:30:00.000Z"),
    duration: "10h 30m",
    price: "1100.00",
    availableSeats: 150,
    totalSeats: 259,
    cabin: "economy",
    stops: 0,
    status: "scheduled"
  },
  {
    flightNumber: "QR571",
    airline: "Qatar Airways",
    aircraft: "Airbus A320",
    origin: "Doha",
    destination: "Muscat",
    departureTime: new Date("2025-07-28T09:00:00.000Z"),
    arrivalTime: new Date("2025-07-28T10:15:00.000Z"),
    duration: "1h 15m",
    price: "280.00",
    availableSeats: 40,
    totalSeats: 144,
    cabin: "economy",
    stops: 0,
    status: "scheduled"
  },
  {
    flightNumber: "QR613",
    airline: "Qatar Airways",
    aircraft: "Boeing 787-8",
    origin: "Doha",
    destination: "Mumbai",
    departureTime: new Date("2025-07-29T13:30:00.000Z"),
    arrivalTime: new Date("2025-07-29T19:20:00.000Z"),
    duration: "3h 20m",
    price: "450.00",
    availableSeats: 75,
    totalSeats: 254,
    cabin: "economy",
    stops: 0,
    status: "scheduled"
  },
  {
    flightNumber: "QR015",
    airline: "Qatar Airways",
    aircraft: "Airbus A380",
    origin: "Doha",
    destination: "London",
    departureTime: new Date("2025-07-30T07:30:00.000Z"),
    arrivalTime: new Date("2025-07-30T13:00:00.000Z"),
    duration: "6h 30m",
    price: "750.00",
    availableSeats: 250,
    totalSeats: 517,
    cabin: "economy",
    stops: 0,
    status: "scheduled"
  },
  {
    flightNumber: "QR830",
    airline: "Qatar Airways",
    aircraft: "Boeing 777-300ER",
    origin: "Doha",
    destination: "Bangkok",
    departureTime: new Date("2025-07-31T01:00:00.000Z"),
    arrivalTime: new Date("2025-07-31T11:55:00.000Z"),
    duration: "6h 55m",
    price: "600.00",
    availableSeats: 180,
    totalSeats: 350,
    cabin: "economy",
    stops: 0,
    status: "scheduled"
  },
  {
    flightNumber: "QR083",
    airline: "Qatar Airways",
    aircraft: "Airbus A350-900",
    origin: "Doha",
    destination: "Frankfurt",
    departureTime: new Date("2025-08-01T15:00:00.000Z"),
    arrivalTime: new Date("2025-08-01T20:30:00.000Z"),
    duration: "6h 30m",
    price: "710.00",
    availableSeats: 100,
    totalSeats: 283,
    cabin: "economy",
    stops: 0,
    status: "scheduled"
  },
  {
    flightNumber: "QR713",
    airline: "Qatar Airways",
    aircraft: "Boeing 777-300ER",
    origin: "Doha",
    destination: "Dallas",
    departureTime: new Date("2025-08-02T07:45:00.000Z"),
    arrivalTime: new Date("2025-08-02T15:15:00.000Z"),
    duration: "15h 30m",
    price: "1300.00",
    availableSeats: 190,
    totalSeats: 350,
    cabin: "economy",
    stops: 0,
    status: "scheduled"
  },
  {
    flightNumber: "QR101",
    airline: "Qatar Airways",
    aircraft: "Boeing 787-8",
    origin: "Doha",
    destination: "Geneva",
    departureTime: new Date("2025-08-03T11:00:00.000Z"),
    arrivalTime: new Date("2025-08-03T16:00:00.000Z"),
    duration: "6h 0m",
    price: "650.00",
    availableSeats: 60,
    totalSeats: 254,
    cabin: "economy",
    stops: 0,
    status: "scheduled"
  },
  {
    flightNumber: "QR672",
    airline: "Qatar Airways",
    aircraft: "Airbus A350-1000",
    origin: "Doha",
    destination: "Kathmandu",
    departureTime: new Date("2025-08-04T05:00:00.000Z"),
    arrivalTime: new Date("2025-08-04T10:45:00.000Z"),
    duration: "4h 45m",
    price: "420.00",
    availableSeats: 130,
    totalSeats: 327,
    cabin: "economy",
    stops: 0,
    status: "scheduled"
  },
  {
    flightNumber: "QR283",
    airline: "Qatar Airways",
    aircraft: "Boeing 777-200LR",
    origin: "Doha",
    destination: "Stockholm",
    departureTime: new Date("2025-08-05T10:30:00.000Z"),
    arrivalTime: new Date("2025-08-05T16:00:00.000Z"),
    duration: "6h 30m",
    price: "700.00",
    availableSeats: 105,
    totalSeats: 259,
    cabin: "economy",
    stops: 0,
    status: "scheduled"
  },
  {
    flightNumber: "QR669",
    airline: "Qatar Airways",
    aircraft: "Airbus A320",
    origin: "Doha",
    destination: "Kuwait",
    departureTime: new Date("2025-08-06T18:00:00.000Z"),
    arrivalTime: new Date("2025-08-06T19:30:00.000Z"),
    duration: "1h 30m",
    price: "250.00",
    availableSeats: 55,
    totalSeats: 144,
    cabin: "economy",
    stops: 0,
    status: "scheduled"
  },
  {
    flightNumber: "QR960",
    airline: "Qatar Airways",
    aircraft: "Airbus A350-900",
    origin: "Doha",
    destination: "Perth",
    departureTime: new Date("2025-08-07T23:00:00.000Z"),
    arrivalTime: new Date("2025-08-08T18:30:00.000Z"),
    duration: "10h 30m",
    price: "1600.00",
    availableSeats: 70,
    totalSeats: 283,
    cabin: "economy",
    stops: 0,
    status: "scheduled"
  },
  {
    flightNumber: "QR701",
    airline: "Qatar Airways",
    aircraft: "Boeing 777-300ER",
    origin: "Doha",
    destination: "Washington D.C.",
    departureTime: new Date("2025-08-08T08:30:00.000Z"),
    arrivalTime: new Date("2025-08-08T16:00:00.000Z"),
    duration: "13h 30m",
    price: "1200.00",
    availableSeats: 170,
    totalSeats: 350,
    cabin: "economy",
    stops: 0,
    status: "scheduled"
  },
  {
    flightNumber: "QR212",
    airline: "Qatar Airways",
    aircraft: "Boeing 787-9",
    origin: "Doha",
    destination: "Oslo",
    departureTime: new Date("2025-08-09T14:15:00.000Z"),
    arrivalTime: new Date("2025-08-09T19:45:00.000Z"),
    duration: "6h 30m",
    price: "690.00",
    availableSeats: 95,
    totalSeats: 311,
    cabin: "economy",
    stops: 0,
    status: "scheduled"
  },
  {
    flightNumber: "QR095",
    airline: "Qatar Airways",
    aircraft: "Airbus A350-1000",
    origin: "Doha",
    destination: "Munich",
    departureTime: new Date("2025-08-10T16:00:00.000Z"),
    arrivalTime: new Date("2025-08-10T21:45:00.000Z"),
    duration: "6h 45m",
    price: "730.00",
    availableSeats: 120,
    totalSeats: 327,
    cabin: "economy",
    stops: 0,
    status: "scheduled"
  },
  {
    flightNumber: "QR107",
    airline: "Qatar Airways",
    aircraft: "Boeing 787-8",
    origin: "Doha",
    destination: "Copenhagen",
    departureTime: new Date("2025-08-11T09:30:00.000Z"),
    arrivalTime: new Date("2025-08-11T15:00:00.000Z"),
    duration: "6h 30m",
    price: "670.00",
    availableSeats: 80,
    totalSeats: 254,
    cabin: "economy",
    stops: 0,
    status: "scheduled"
  }
  // Continue with the rest of the flights...
];

async function migrateQatarFlights() {
  try {
    console.log('Starting Qatar Airways flights migration...');
    
    // Insert all Qatar Airways flights
    for (const flightData of qatarFlightsData) {
      try {
        await db.insert(flights).values(flightData);
        console.log(`Added flight ${flightData.flightNumber}: ${flightData.origin} → ${flightData.destination}`);
      } catch (error) {
        console.error(`Failed to add flight ${flightData.flightNumber}:`, error);
      }
    }
    
    console.log(`\nMigration completed! Added ${qatarFlightsData.length} Qatar Airways flights.`);
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Export the migration function
export { migrateQatarFlights };

// Run migration if this file is executed directly
if (require.main === module) {
  migrateQatarFlights()
    .then(() => {
      console.log('Qatar Airways migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Qatar Airways migration script failed:', error);
      process.exit(1);
    });
}
