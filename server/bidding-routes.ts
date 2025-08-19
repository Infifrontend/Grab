import { Express } from "express";
import { biddingStorage } from "./bidding-storage.js";
import { nanoid } from "nanoid";

export function setupBiddingRoutes(app: Express) {
  // 1. Admin creates a bid (flight offer)
  app.post("/api/admin/bids", async (req, res) => {
    try {
      const bidData = req.body;

      // Validate required fields
      if (!bidData.bidAmount || !bidData.validUntil) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: bidAmount, validUntil",
        });
      }

      // Create the bid configuration
      const newBid = await biddingStorage.createBid({
        bidAmount: bidData.bidAmount.toString(),
        validUntil: new Date(bidData.validUntil),
        notes: JSON.stringify(bidData),
        totalSeatsAvailable: bidData.totalSeatsAvailable || 100,
        minSeatsPerBid: bidData.minSeatsPerBid || 1,
        maxSeatsPerBid: bidData.maxSeatsPerBid || 10,
        rStatus: 1, // Active status
      });

      res.json({
        success: true,
        message: "Bid created successfully",
        bid: newBid,
      });
    } catch (error: any) {
      console.error("Error creating bid:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create bid",
        error: error.message,
      });
    }
  });

  // 2. Retail user submits bid for an existing bid
  app.post("/api/retail/bids/:bidId/submit", async (req, res) => {
    try {
      const { bidId } = req.params;
      const { userId, submittedAmount, seatBooked } = req.body;

      // Validate inputs
      if (!userId || !submittedAmount || !seatBooked) {
        return res.status(400).json({
          success: false,
          message:
            "Missing required fields: userId, submittedAmount, seatBooked",
        });
      }

      // Ensure required statuses exist in the database
      await biddingStorage.ensureRequiredStatuses();

      // Check if bid exists and is active
      const bidDetails = await biddingStorage.getBidWithDetails(
        parseInt(bidId),
      );
      if (!bidDetails) {
        return res.status(404).json({
          success: false,
          message: "Bid not found",
        });
      }

      // Check seat availability
      if (bidDetails.availableSeats < seatBooked) {
        return res.status(400).json({
          success: false,
          message: "Not enough seats available",
        });
      }

      // Get dynamic status ID for "Under Review" instead of hardcoding
      const underReviewStatusId = await biddingStorage.getStatusIdByCode("UR");
      if (!underReviewStatusId) {
        throw new Error(
          "Under Review status not found in status management system",
        );
      }

      // Create retail bid submission
      const retailBid = await biddingStorage.createRetailBid({
        rBidId: parseInt(bidId),
        rUserId: parseInt(userId),
        submittedAmount: submittedAmount.toString(),
        seatBooked: parseInt(seatBooked),
        rStatus: underReviewStatusId, // Use dynamic status instead of hardcoded value
      });

      res.json({
        success: true,
        message: "Bid submitted successfully",
        retailBid: retailBid,
      });
    } catch (error: any) {
      console.error("Error submitting retail bid:", error);
      res.status(500).json({
        success: false,
        message: "Failed to submit bid",
        error: error.message,
      });
    }
  });

  // 3. Retail user makes payment for their bid
  app.post("/api/retail/bids/:bidId/payment", async (req, res) => {
    try {
      const { bidId } = req.params;
      const { userId, amount, paymentMethod } = req.body;

      // Validate inputs
      if (!userId || !amount || !paymentMethod) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: userId, amount, paymentMethod",
        });
      }

      // Ensure required statuses exist in the database
      await biddingStorage.ensureRequiredStatuses();

      // Check if user has a retail bid for this bid
      const retailBids = await biddingStorage.getRetailBidsByUser(
        parseInt(userId),
      );
      const userRetailBid = retailBids.find(
        (rb) => rb.rBidId === parseInt(bidId),
      );

      if (!userRetailBid) {
        return res.status(404).json({
          success: false,
          message: "No bid submission found for this user",
        });
      }

      // Get dynamic status IDs instead of hardcoding
      const processingStatusId = await biddingStorage.getStatusIdByCode("P");
      const underReviewStatusId = await biddingStorage.getStatusIdByCode("UR");

      if (!processingStatusId || !underReviewStatusId) {
        throw new Error(
          "Required statuses not found in status management system",
        );
      }

      // Create payment record
      const payment = await biddingStorage.createBidPayment({
        rUserId: parseInt(userId),
        rRetailBidId: userRetailBid.id,
        paymentReference: `PAY-${bidId}-USER${userId}-${nanoid(4)}`,
        amount: amount.toString(),
        currency: "USD",
        paymentMethod: paymentMethod,
        rStatus: processingStatusId, // Use dynamic status instead of hardcoded value
      });

      // Update retail bid status to "under review"
      await biddingStorage.updateRetailBidStatus(
        userRetailBid.id,
        underReviewStatusId,
      );

      res.json({
        success: true,
        message: "Payment submitted successfully",
        payment: payment,
        paymentReference: payment.paymentReference,
      });
    } catch (error: any) {
      console.error("Error processing payment:", error);
      res.status(500).json({
        success: false,
        message: "Failed to process payment",
        error: error.message,
      });
    }
  });

  // 4. Admin views all bids with user submissions
  app.get("/api/admin/bids", async (req, res) => {
    try {
      const allBids = await biddingStorage.getAllBids();

      // Get detailed information for each bid
      const bidsWithDetails = await Promise.all(
        allBids.map(async (bid) => {
          const details = await biddingStorage.getBidWithDetails(bid.id);
          return {
            ...bid,
            details: details,
          };
        }),
      );

      res.json({
        success: true,
        bids: bidsWithDetails,
      });
    } catch (error: any) {
      console.error("Error fetching admin bids:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch bids",
        error: error.message,
      });
    }
  });

  // 5. Admin views specific bid with all user submissions
  app.get("/api/admin/bids/:bidId", async (req, res) => {
    try {
      const { bidId } = req.params;

      const bidDetails = await biddingStorage.getBidWithDetails(
        parseInt(bidId),
      );
      if (!bidDetails) {
        return res.status(404).json({
          success: false,
          message: "Bid not found",
        });
      }

      // Get all retail bids for this bid with user details
      const retailBids = await biddingStorage.getRetailBidsByBid(
        parseInt(bidId),
      );
      const retailBidsWithUsers = await Promise.all(
        retailBids.map(async (rb) => {
          const user = await biddingStorage.getGrabUserById(rb.rUserId);
          const status = await biddingStorage.getStatusById(rb.rStatus || 1);
          return {
            ...rb,
            user: user,
            statusInfo: status,
          };
        }),
      );

      res.json({
        success: true,
        bid: bidDetails.bid,
        configData: bidDetails.configData,
        totalSeatsAvailable: bidDetails.totalSeatsAvailable,
        bookedSeats: bidDetails.bookedSeats,
        availableSeats: bidDetails.availableSeats,
        retailBids: retailBidsWithUsers,
        payments: bidDetails.bidPayments,
      });
    } catch (error: any) {
      console.error("Error fetching bid details:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch bid details",
        error: error.message,
      });
    }
  });

  // 6. Admin approves/rejects user bid
  app.put("/api/admin/retail-bids/:retailBidId/status", async (req, res) => {
    try {
      const { retailBidId } = req.params;
      const { status, adminNote } = req.body; // status: 'approved' | 'rejected'

      // Map status to dynamic status ID
      let statusId: number | null = null;
      switch (status) {
        case "approved":
          statusId = await biddingStorage.getStatusIdByCode("AP");
          break;
        case "rejected":
          statusId = await biddingStorage.getStatusIdByCode("R");
          break;
        case "under_review":
          statusId = await biddingStorage.getStatusIdByCode("UR");
          break;
        default:
          return res.status(400).json({
            success: false,
            message:
              "Invalid status. Use 'approved', 'rejected', or 'under_review'",
          });
      }

      if (!statusId) {
        return res.status(500).json({
          success: false,
          message: `Status '${status}' not found in status management system`,
        });
      }

      // Update retail bid status
      await biddingStorage.updateRetailBidStatus(
        parseInt(retailBidId),
        statusId,
      );

      // If approved, update payment status as well
      if (status === "approved") {
        const retailBids = await biddingStorage.getRetailBidsByBid(
          parseInt(retailBidId),
        );
        // Note: This is simplified - in a real app you'd find the specific retail bid and its payment
      }

      res.json({
        success: true,
        message: `Bid ${status} successfully`,
        status: status,
        adminNote: adminNote,
      });
    } catch (error: any) {
      console.error("Error updating bid status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update bid status",
        error: error.message,
      });
    }
  });

  // 7. User views their bid submissions
  app.get("/api/retail/my-bids/:userId", async (req, res) => {
    try {
      const { userId } = req.params;

      const userRetailBids = await biddingStorage.getRetailBidsByUser(
        parseInt(userId),
      );

      // Get bid details for each submission
      const bidsWithDetails = await Promise.all(
        userRetailBids.map(async (rb) => {
          const bidDetails = await biddingStorage.getBidWithDetails(
            rb.rBidId,
            parseInt(userId),
          );
          const status = await biddingStorage.getStatusById(rb.rStatus || 1);
          return {
            ...rb,
            bidDetails: bidDetails,
            statusInfo: status,
          };
        }),
      );

      res.json({
        success: true,
        userBids: bidsWithDetails,
      });
    } catch (error: any) {
      console.error("Error fetching user bids:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch user bids",
        error: error.message,
      });
    }
  });

  // 8. Check existing statuses
  app.get("/api/admin/statuses", async (req, res) => {
    try {
      const existingStatuses = await biddingStorage.getAllStatuses();
      res.json({
        success: true,
        statuses: existingStatuses,
      });
    } catch (error: any) {
      console.error("Error fetching statuses:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch statuses",
        error: error.message,
      });
    }
  });

  // 9. Initialize default statuses if not exists
  app.post("/api/admin/init-statuses", async (req, res) => {
    try {
      // Check if statuses exist
      const existingStatuses = await biddingStorage.getAllStatuses();

      if (existingStatuses.length === 0) {
        // Insert default statuses
        const defaultStatuses = [
          {
            statusName: "Submitted",
            statusCode: "S",
            description: "Bid submitted by user",
          },
          {
            statusName: "Under Review",
            statusCode: "UR",
            description: "Payment received, under review",
          },
          {
            statusName: "Approved",
            statusCode: "A",
            description: "Bid approved by admin",
          },
          {
            statusName: "Rejected",
            statusCode: "R",
            description: "Bid rejected by admin",
          },
          {
            statusName: "Completed",
            statusCode: "C",
            description: "Bid process completed",
          },
        ];

        // Note: You would insert these into the grabMStatus table
        // For now, return a message that they should be created manually
        res.json({
          success: true,
          message: "Please create default statuses in the database",
          suggestedStatuses: defaultStatuses,
        });
      } else {
        res.json({
          success: true,
          message: "Statuses already exist",
          statuses: existingStatuses,
        });
      }
    } catch (error: any) {
      console.error("Error initializing statuses:", error);
      res.status(500).json({
        success: false,
        message: "Failed to initialize statuses",
        error: error.message,
      });
    }
  });
}
