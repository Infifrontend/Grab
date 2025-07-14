
import { db } from './db';
import { flights } from '@shared/schema';
import { sql } from 'drizzle-orm';

// Define domestic routes by country
const domesticRoutes = {
  // India domestic routes
  'India': ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Kochi'],
  // USA domestic routes  
  'USA': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Philadelphia', 'Phoenix', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco', 'Indianapolis', 'Seattle', 'Denver', 'Washington', 'Boston', 'El Paso', 'Nashville', 'Detroit', 'Oklahoma City', 'Portland', 'Las Vegas', 'Memphis', 'Louisville', 'Baltimore', 'Milwaukee', 'Albuquerque', 'Tucson', 'Fresno', 'Sacramento', 'Kansas City', 'Mesa', 'Atlanta', 'Omaha', 'Colorado Springs', 'Raleigh', 'Miami', 'Virginia Beach', 'Oakland', 'Minneapolis', 'Tulsa', 'Arlington', 'Tampa', 'New Orleans', 'Wichita', 'Cleveland', 'Bakersfield', 'Aurora', 'Anaheim', 'Honolulu', 'Santa Ana', 'Riverside', 'Corpus Christi', 'Lexington', 'Stockton', 'Henderson', 'Saint Paul', 'St. Louis', 'Cincinnati', 'Pittsburgh', 'Greensboro', 'Anchorage', 'Plano', 'Lincoln', 'Orlando', 'Irvine', 'Newark', 'Toledo', 'Durham', 'Chula Vista', 'Fort Wayne', 'Jersey City', 'St. Petersburg', 'Laredo', 'Madison', 'Chandler', 'Buffalo', 'Lubbock', 'Scottsdale', 'Reno', 'Glendale', 'Gilbert', 'Winston-Salem', 'North Las Vegas', 'Norfolk', 'Chesapeake', 'Garland', 'Irving', 'Hialeah', 'Fremont', 'Boise', 'Richmond', 'Baton Rouge', 'Spokane', 'Des Moines', 'Tacoma', 'San Bernardino', 'Modesto', 'Fontana', 'Santa Clarita', 'Birmingham', 'Oxnard', 'Fayetteville', 'Moreno Valley', 'Rochester', 'Glendale', 'Huntington Beach', 'Salt Lake City', 'Grand Rapids', 'Amarillo', 'Yonkers', 'Aurora', 'Montgomery', 'Akron', 'Little Rock', 'Huntsville', 'Augusta', 'Port St. Lucie', 'Grand Prairie', 'Columbus', 'Tallahassee', 'Overland Park', 'Tempe', 'McKinney', 'Mobile', 'Cape Coral', 'Shreveport', 'Frisco', 'Knoxville', 'Worcester', 'Brownsville', 'Vancouver', 'Fort Lauderdale', 'Sioux Falls', 'Ontario', 'Chattanooga', 'Providence', 'Newport News', 'Rancho Cucamonga', 'Santa Rosa', 'Oceanside', 'Salem', 'Elk Grove', 'Garden Grove', 'Pembroke Pines', 'Peoria', 'Eugene', 'Corona', 'Cary', 'Springfield', 'Fort Collins', 'Jackson', 'Alexandria', 'Hayward', 'Lancaster', 'Lakewood', 'Hollywood', 'Springdale', 'Sunnyvale', 'Macon', 'Kansas City', 'Paterson', 'Thornton', 'Pasadena', 'Pomona', 'Killeen', 'Escondido', 'Naperville', 'Bellevue', 'Clarksville', 'Rockford', 'Joliet', 'Torrance', 'Bridgeport', 'West Valley City', 'Westminster', 'Roseville', 'Richmond', 'Pearland', 'Fullerton', 'Carrollton', 'Coral Springs', 'Stamford', 'Thousand Oaks', 'Midland', 'Brighton', 'Fargo', 'Columbia', 'Murfreesboro', 'Concord', 'McKinney', 'Cedar Rapids', 'Sterling Heights', 'Kent', 'Carlsbad', 'Topeka', 'Norman', 'Santa Clara', 'Simi Valley', 'El Monte', 'Elizabeth', 'Hartford', 'Gainesville', 'Visalia', 'Olathe', 'Allentown', 'Hillsboro', 'Waterbury', 'Chesapeake', 'West Jordan', 'Westminster', 'Daly City', 'Downey', 'High Point', 'Miami Gardens', 'Portsmouth', 'Pompano Beach', 'Antioch', 'Temecula', 'Elgin', 'Murrieta', 'Wilmington', 'Surprise', 'West Palm Beach', 'Denton', 'Davenport', 'Waco', 'Orange', 'Clovis', 'West Covina', 'Warren', 'Round Rock', 'Rialto', 'Cambridge', 'Sugar Land', 'Lansing', 'Evansville', 'Valley', 'Princeton', 'College Station', 'Palmdale', 'Costa Mesa', 'Westminster', 'North Charleston', 'Inglewood', 'Abilene', 'Rochester', 'Camden', 'Lowell', 'San Buenaventura', 'Fairfield', 'Beaumont', 'Independence', 'Clearwater', 'Odessa', 'Murfreesboro', 'Sparks', 'Ann Arbor', 'Tyler', 'West Jordan']
};

// Function to determine if a city belongs to a country
function getCityCountry(city: string): string | null {
  for (const [country, cities] of Object.entries(domesticRoutes)) {
    if (cities.includes(city)) {
      return country;
    }
  }
  return null;
}

// Function to check if a route is domestic
function isDomesticRoute(origin: string, destination: string): boolean {
  const originCountry = getCityCountry(origin);
  const destinationCountry = getCityCountry(destination);
  
  return originCountry !== null && destinationCountry !== null && originCountry === destinationCountry;
}

async function migrateToDomesticFlights() {
  try {
    console.log('Starting migration to remove international flights...');
    
    // Get all current flights
    const allFlights = await db.select().from(flights);
    console.log(`Found ${allFlights.length} total flights`);
    
    // Identify international flights to remove
    const internationalFlights = allFlights.filter(flight => 
      !isDomesticRoute(flight.origin, flight.destination)
    );
    
    console.log(`Found ${internationalFlights.length} international flights to remove`);
    
    // Remove international flights
    if (internationalFlights.length > 0) {
      const internationalFlightIds = internationalFlights.map(f => f.id);
      
      await db.delete(flights).where(
        sql`${flights.id} IN (${sql.join(internationalFlightIds.map(id => sql`${id}`), sql`, `)})`
      );
      
      console.log(`Removed ${internationalFlights.length} international flights`);
    }
    
    // Get remaining domestic flights
    const domesticFlights = await db.select().from(flights);
    console.log(`${domesticFlights.length} domestic flights remaining`);
    
    // Log the remaining domestic routes
    console.log('\nRemaining domestic routes:');
    domesticFlights.forEach(flight => {
      console.log(`- ${flight.flightNumber}: ${flight.origin} → ${flight.destination} (${getCityCountry(flight.origin)})`);
    });
    
    console.log('\nMigration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Export the migration function
export { migrateToDomesticFlights };

// Run migration if this file is executed directly
if (require.main === module) {
  migrateToDomesticFlights()
    .then(() => {
      console.log('Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration script failed:', error);
      process.exit(1);
    });
}
