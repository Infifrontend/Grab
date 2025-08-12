
import { db } from "./db.js";
import { users, bids } from "../shared/schema.js";
import { eq } from "drizzle-orm";

export async function insertBidData() {
  try {
    console.log("Starting bid data insertion...");

    // First, ensure user with ID 1 exists
    const existingUser = await db.select().from(users).where(eq(users.id, 1));
    
    if (existingUser.length === 0) {
      console.log("Creating default user with ID 1...");
      await db.insert(users).values({
        id: 1,
        username: "admin",
        password: "admin123",
        name: "Administrator"
      });
      console.log("Default user created successfully.");
    } else {
      console.log("User with ID 1 already exists.");
    }

    // Now insert the bid data
    const bidData = [
      {
        id: 25,
        userId: 1,
        flightId: 39,
        bidAmount: "1200.00",
        passengerCount: 1,
        bidStatus: "completed",
        validUntil: new Date("2025-08-05T13:00:00.000Z"),
        notes: '{"title":"Flight and Travel Management Bid","flightType":"International","origin":"Guadalajara","destination":"Puerto Vallarta","travelDate":"2025-08-12","departureTimeRange":"00:00 - 23:00","totalSeatsAvailable":5,"minSeatsPerBid":1,"maxSeatsPerBid":1,"maxSeatsPerUser":5,"bidStartTime":"2025-07-24T19:30:00.000Z","bidEndTime":"2025-08-05T18:30:00.000Z","autoAwardTopBidder":false,"manualReviewOption":false,"autoRefundNonWinners":false,"fareType":"Economy","baggageAllowance":1,"cancellationTerms":"Standard - 24h free cancellation","mealIncluded":true,"otherNotes":"","configType":"bid_configuration","createdAt":"2025-07-24T13:09:29.132Z","status":"active","paymentInfo":{"paymentStatus":"Paid","paymentDate":"2025-07-24T13:10:59.383Z","depositPaid":true,"paymentCompleted":true,"completedAt":"2025-07-24T13:10:59.383Z"}}',
        createdAt: new Date("2025-07-24T07:39:29.133Z"),
        updatedAt: new Date("2025-07-24T07:40:59.384Z")
      },
      {
        id: 26,
        userId: 1,
        flightId: 1,
        bidAmount: "1100.00",
        passengerCount: 5,
        bidStatus: "completed",
        validUntil: new Date("2025-08-10T13:00:00.000Z"),
        notes: '{"title":"Aviation Travel Solutions Offering","flightType":"International","origin":"Mexico City","destination":"San Francisco","travelDate":"2025-08-12","departureTimeRange":null,"totalSeatsAvailable":5,"minSeatsPerBid":5,"maxSeatsPerBid":1,"maxSeatsPerUser":5,"bidStartTime":"2025-07-24T18:30:00.000Z","bidEndTime":"2025-08-10T18:30:00.000Z","autoAwardTopBidder":false,"manualReviewOption":false,"autoRefundNonWinners":false,"fareType":"Flexible Fare","baggageAllowance":10,"cancellationTerms":"Flexible - Free cancellation","mealIncluded":true,"otherNotes":"","configType":"bid_configuration","createdAt":"2025-07-24T13:16:16.613Z","status":"active","paymentInfo":{"paymentStatus":"Paid","paymentDate":"2025-07-24T13:57:45.381Z","depositPaid":true,"paymentCompleted":true,"completedAt":"2025-07-24T13:57:45.381Z"}}',
        createdAt: new Date("2025-07-24T07:46:16.614Z"),
        updatedAt: new Date("2025-07-24T08:27:45.382Z")
      },
      {
        id: 27,
        userId: 1,
        flightId: 42,
        bidAmount: "850.00",
        passengerCount: 5,
        bidStatus: "completed",
        validUntil: new Date("2025-08-10T13:00:00.000Z"),
        notes: '{"title":"Air Transportation Services Submission","flightType":"International","origin":"Los Cabos","destination":"Mexico City","travelDate":"2025-08-15","departureTimeRange":null,"totalSeatsAvailable":50,"minSeatsPerBid":5,"maxSeatsPerBid":2,"maxSeatsPerUser":5,"bidStartTime":"2025-07-24T18:30:00.000Z","bidEndTime":"2025-08-10T18:30:00.000Z","autoAwardTopBidder":true,"manualReviewOption":false,"autoRefundNonWinners":false,"fareType":"Premium Economy","baggageAllowance":10,"cancellationTerms":"Flexible","mealIncluded":true,"otherNotes":"","configType":"bid_configuration","createdAt":"2025-07-24T13:56:44.980Z","status":"active","paymentInfo":{"paymentStatus":"Paid","paymentDate":"2025-07-24T14:14:24.444Z","depositPaid":true,"paymentCompleted":true,"completedAt":"2025-07-24T14:14:24.445Z"}}',
        createdAt: new Date("2025-07-24T08:26:44.981Z"),
        updatedAt: new Date("2025-07-24T08:44:24.445Z")
      },
      {
        id: 28,
        userId: 1,
        flightId: 43,
        bidAmount: "650.00",
        passengerCount: 2,
        bidStatus: "completed",
        validUntil: new Date("2025-08-03T13:00:00.000Z"),
        notes: '{"title":"Cost-Effective Air Travel Bid","flightType":"International","origin":"Dallas","destination":"Cancun","travelDate":"2025-08-16","departureTimeRange":null,"totalSeatsAvailable":40,"minSeatsPerBid":2,"maxSeatsPerBid":5,"maxSeatsPerUser":5,"bidStartTime":"2025-07-24T18:30:00.000Z","bidEndTime":"2025-08-03T18:30:00.000Z","autoAwardTopBidder":false,"manualReviewOption":false,"autoRefundNonWinners":false,"fareType":"Premium Economy","baggageAllowance":15,"cancellationTerms":"Standard","mealIncluded":true,"otherNotes":"","configType":"bid_configuration","createdAt":"2025-07-24T14:19:47.600Z","status":"active","paymentInfo":{"paymentStatus":"Paid","paymentDate":"2025-07-24T14:21:55.519Z","depositPaid":true,"paymentCompleted":true,"completedAt":"2025-07-24T14:21:55.519Z"}}',
        createdAt: new Date("2025-07-24T08:49:47.601Z"),
        updatedAt: new Date("2025-07-24T08:51:55.519Z")
      },
      {
        id: 29,
        userId: 1,
        flightId: 12,
        bidAmount: "550.00",
        passengerCount: 5,
        bidStatus: "completed",
        validUntil: new Date("2025-07-30T13:00:00.000Z"),
        notes: '{"title":"Competitive Flight Services Proposal","flightType":"International","origin":"Chennai","destination":"Delhi","travelDate":"2025-07-31","departureTimeRange":null,"totalSeatsAvailable":20,"minSeatsPerBid":5,"maxSeatsPerBid":1,"maxSeatsPerUser":5,"bidStartTime":"2025-07-24T18:30:00.000Z","bidEndTime":"2025-07-30T18:30:00.000Z","autoAwardTopBidder":false,"manualReviewOption":false,"autoRefundNonWinners":false,"fareType":"Business","baggageAllowance":5,"cancellationTerms":"Standard","mealIncluded":true,"otherNotes":"","configType":"bid_configuration","createdAt":"2025-07-24T14:31:33.751Z","status":"active","paymentInfo":{"paymentStatus":"Paid","paymentDate":"2025-07-24T14:32:34.684Z","depositPaid":true,"paymentCompleted":true,"completedAt":"2025-07-24T14:32:34.684Z"}}',
        createdAt: new Date("2025-07-24T09:01:33.753Z"),
        updatedAt: new Date("2025-07-24T09:02:34.684Z")
      },
      {
        id: 30,
        userId: 1,
        flightId: 1,
        bidAmount: "800.00",
        passengerCount: 4,
        bidStatus: "active",
        validUntil: new Date("2025-07-30T13:00:00.000Z"),
        notes: '{"title":"Optimized Airfare Solutions Bid","flightType":"International","origin":"Dallas","destination":"Cancun","travelDate":"2025-07-30","departureTimeRange":null,"totalSeatsAvailable":100,"minSeatsPerBid":4,"maxSeatsPerBid":2,"maxSeatsPerUser":5,"bidStartTime":"2025-07-24T18:30:00.000Z","bidEndTime":"2025-07-30T18:30:00.000Z","autoAwardTopBidder":false,"manualReviewOption":false,"autoRefundNonWinners":false,"fareType":"First Class","baggageAllowance":10,"cancellationTerms":"Standard","mealIncluded":true,"otherNotes":"","configType":"bid_configuration","createdAt":"2025-07-24T14:35:57.928Z","status":"active"}',
        createdAt: new Date("2025-07-24T09:05:57.929Z"),
        updatedAt: new Date("2025-07-24T09:05:57.929Z")
      },
      {
        id: 31,
        userId: 1,
        flightId: 1,
        bidAmount: "870.00",
        passengerCount: 5,
        bidStatus: "active",
        validUntil: new Date("2025-07-30T13:00:00.000Z"),
        notes: '{"title":"Value-Driven Flight Procurement","flightType":"International","origin":"Dallas","destination":"Cancun","travelDate":"2025-07-31","departureTimeRange":null,"totalSeatsAvailable":100,"minSeatsPerBid":5,"maxSeatsPerBid":2,"maxSeatsPerUser":5,"bidStartTime":"2025-07-24T18:30:00.000Z","bidEndTime":"2025-07-30T18:30:00.000Z","autoAwardTopBidder":false,"manualReviewOption":false,"autoRefundNonWinners":false,"fareType":"Business","baggageAllowance":12,"cancellationTerms":"Non-refundable","mealIncluded":false,"otherNotes":"","configType":"bid_configuration","createdAt":"2025-07-24T14:37:52.072Z","status":"active"}',
        createdAt: new Date("2025-07-24T09:07:52.073Z"),
        updatedAt: new Date("2025-07-24T09:07:52.073Z")
      },
      {
        id: 32,
        userId: 1,
        flightId: 1,
        bidAmount: "900.00",
        passengerCount: 1,
        bidStatus: "active",
        validUntil: new Date("2025-07-30T13:00:00.000Z"),
        notes: '{"title":"Streamlined Air Travel Bid","flightType":"International","origin":"Frankfurt","destination":"Dallas","travelDate":"2025-07-30","departureTimeRange":null,"totalSeatsAvailable":100,"minSeatsPerBid":1,"maxSeatsPerBid":10,"maxSeatsPerUser":5,"bidStartTime":"2025-07-24T18:30:00.000Z","bidEndTime":"2025-07-30T18:30:00.000Z","autoAwardTopBidder":false,"manualReviewOption":false,"autoRefundNonWinners":false,"fareType":"First Class","baggageAllowance":10,"cancellationTerms":"Restrictive","mealIncluded":false,"otherNotes":"","configType":"bid_configuration","createdAt":"2025-07-24T14:38:46.996Z","status":"active"}',
        createdAt: new Date("2025-07-24T09:08:46.996Z"),
        updatedAt: new Date("2025-07-24T09:08:46.996Z")
      }
    ];

    // Insert bids one by one to handle potential conflicts
    for (const bid of bidData) {
      try {
        await db.insert(bids).values(bid);
        console.log(`Inserted bid with ID ${bid.id}`);
      } catch (error) {
        if (error.message.includes("duplicate key")) {
          console.log(`Bid with ID ${bid.id} already exists, skipping...`);
        } else {
          console.error(`Error inserting bid ${bid.id}:`, error.message);
        }
      }
    }

    console.log("Bid data insertion completed successfully!");
    return { success: true, message: "Bid data inserted successfully" };

  } catch (error) {
    console.error("Error inserting bid data:", error);
    throw error;
  }
}
