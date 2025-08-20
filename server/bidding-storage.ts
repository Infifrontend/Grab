import { db } from "./db";
import {
  grabTBids,
  grabTRetailBids,
  grabTBidPayments,
  grabTUsers,
  grabMStatus,
  type GrabTBid,
  type InsertGrabTBid,
  type GrabTRetailBid,
  type InsertGrabTRetailBid,
  type GrabTBidPayment,
  type InsertGrabTBidPayment,
  type GrabTUser,
  type GrabMStatus,
} from "../shared/schema.js";
import { eq, and, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

export class BiddingStorage {
  // Bids Management
  async createBid(bidData: InsertGrabTBid): Promise<GrabTBid> {
    try {
      console.log("Creating bid with data:", bidData);

      // If no rStatus provided, default to "Open" status
      if (!bidData.rStatus) {
        const openStatusId = await this.getStatusIdByCode("O");
        if (!openStatusId) {
          throw new Error("Open status not found in grab_m_status table");
        }
        bidData.rStatus = openStatusId;
      }

      const [bid] = await db.insert(grabTBids).values(bidData).returning();
      console.log("Bid created successfully:", bid);
      return bid;
    } catch (error) {
      console.error("Error creating bid:", error);
      throw error;
    }
  }

  async getBidById(bidId: number) {
    try {
      const [bid] = await db
        .select()
        .from(grabTBids)
        .where(eq(grabTBids.id, bidId))
        .limit(1);

      if (!bid) {
        return null;
      }

      // Get status information
      let status = null;
      if (bid.rStatus) {
        [status] = await db
          .select({ id: grabMStatus.id, statusName: grabMStatus.statusName })
          .from(grabMStatus)
          .where(eq(grabMStatus.id, bid.rStatus))
          .limit(1);
      }

      return {
        bid,
        status,
      };
    } catch (error) {
      console.error("Error fetching bid by ID:", error);
      throw error;
    }
  }

  async getAllBids(): Promise<GrabTBid[]> {
    try {
      const results = await db
        .select()
        .from(grabTBids)
        .orderBy(desc(grabTBids.createdAt));
      return results;
    } catch (error) {
      console.error("Error getting all bids:", error);
      throw error;
    }
  }

  // Get status by ID
  async getStatusById(statusId: number): Promise<GrabMStatus | null> {
    try {
      console.log(`Looking up status by ID: ${statusId}`);
      const result = await db
        .select()
        .from(grabMStatus)
        .where(eq(grabMStatus.id, statusId))
        .limit(1);

      console.log(`Status lookup result for ID ${statusId}:`, result);
      return result[0] || null;
    } catch (error) {
      console.error(`Error getting status by ID ${statusId}:`, error);
      return null;
    }
  }

  // Get retail bid by ID
  async getRetailBidById(retailBidId: number): Promise<GrabTRetailBid | null> {
    try {
      const result = await db
        .select()
        .from(grabTRetailBids)
        .where(eq(grabTRetailBids.id, retailBidId))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      console.error("Error getting retail bid by ID:", error);
      throw error;
    }
  }

  // Update bid status
  async updateBidStatus(bidId: number, statusId: number): Promise<void> {
    try {
      console.log(`Updating main bid ${bidId} to status ${statusId}`);

      const result = await db
        .update(grabTBids)
        .set({
          rStatus: statusId,
          updatedAt: new Date()
        })
        .where(eq(grabTBids.id, bidId))
        .returning();

      console.log(`Successfully updated main bid ${bidId} status, affected rows:`, result.length);

      if (result.length === 0) {
        throw new Error(`No main bid found with ID ${bidId}`);
      }
    } catch (error) {
      console.error(`Error updating main bid status:`, error);
      throw error;
    }
  }

  // Sync main bid status based on retail bid statuses
  async syncBidStatusFromRetailBids(bidId: number): Promise<void> {
    try {
      console.log(`Syncing main bid ${bidId} status based on retail bids`);
      
      // Get all retail bids for this main bid
      const retailBids = await this.getRetailBidsByBid(bidId);
      
      if (retailBids.length === 0) {
        // No retail bids, keep as Open
        const openStatusId = await this.getStatusIdByCode("O");
        if (openStatusId) {
          await this.updateBidStatus(bidId, openStatusId);
        }
        return;
      }

      // Get status IDs
      const underReviewStatusId = await this.getStatusIdByCode("UR");
      const approvedStatusId = await this.getStatusIdByCode("AP");
      const rejectedStatusId = await this.getStatusIdByCode("R");

      // Check if any retail bid is approved
      const hasApprovedBid = retailBids.some(rb => rb.rStatus === approvedStatusId);
      if (hasApprovedBid) {
        await this.updateBidStatus(bidId, approvedStatusId);
        return;
      }

      // Check if any retail bid is under review (payment done)
      const hasUnderReviewBid = retailBids.some(rb => rb.rStatus === underReviewStatusId);
      if (hasUnderReviewBid) {
        await this.updateBidStatus(bidId, underReviewStatusId);
        return;
      }

      // If all retail bids are rejected, keep as Open for new submissions
      const openStatusId = await this.getStatusIdByCode("O");
      if (openStatusId) {
        await this.updateBidStatus(bidId, openStatusId);
      }

    } catch (error) {
      console.error(`Error syncing bid status from retail bids:`, error);
      throw error;
    }
  }

  // Retail Bids (User bid submissions)
  async createRetailBid(
    retailBidData: InsertGrabTRetailBid,
  ): Promise<GrabTRetailBid> {
    try {
      // Fetch "Under Review" status ID using status_code
      const underReviewStatusId = await this.getStatusIdByCode("UR");

      if (!underReviewStatusId) {
        throw new Error("Under Review status not found in grab_m_status table");
      }

      const bidDataWithStatus = {
        ...retailBidData,
        rStatus: retailBidData.rStatus || underReviewStatusId,
      };

      const [retailBid] = await db
        .insert(grabTRetailBids)
        .values(bidDataWithStatus)
        .returning();
      return retailBid;
    } catch (error) {
      console.error("Error creating retail bid:", error);
      throw error;
    }
  }

  async getRetailBidsByBid(bidId: number): Promise<GrabTRetailBid[]> {
    try {
      const retailBids = await db
        .select()
        .from(grabTRetailBids)
        .where(eq(grabTRetailBids.rBidId, bidId))
        .orderBy(desc(grabTRetailBids.createdAt));
      return retailBids;
    } catch (error) {
      console.error("Error fetching retail bids:", error);
      return [];
    }
  }

  async getRetailBidsByUser(userId: number): Promise<GrabTRetailBid[]> {
    try {
      const retailBids = await db
        .select()
        .from(grabTRetailBids)
        .where(eq(grabTRetailBids.rUserId, userId))
        .orderBy(desc(grabTRetailBids.createdAt));
      return retailBids;
    } catch (error) {
      console.error("Error fetching user retail bids:", error);
      return [];
    }
  }

  async updateRetailBidStatus(
    retailBidId: number,
    statusId: number,
  ): Promise<void> {
    try {
      console.log(`Updating retail bid ${retailBidId} to status ${statusId}`);

      const result = await db
        .update(grabTRetailBids)
        .set({
          rStatus: statusId,
          updatedAt: new Date()
        })
        .where(eq(grabTRetailBids.id, retailBidId))
        .returning();

      console.log(`Successfully updated retail bid ${retailBidId} status, affected rows:`, result.length);

      if (result.length === 0) {
        throw new Error(`No retail bid found with ID ${retailBidId}`);
      }
    } catch (error) {
      console.error(`Error updating retail bid status:`, error);
      throw error;
    }
  }

  // Payments Management
  async createBidPayment(
    paymentData: InsertGrabTBidPayment,
  ): Promise<GrabTBidPayment> {
    try {
      // Fetch "Approved" status ID using status_code
      const approvedStatusId = await this.getStatusIdByCode("AP");

      if (!approvedStatusId) {
        throw new Error("Approved status not found in grab_m_status table");
      }

      const paymentDataWithStatus = {
        ...paymentData,
        rStatus: paymentData.rStatus || approvedStatusId,
        processedAt: paymentData.processedAt || new Date(),
      };

      const [payment] = await db
        .insert(grabTBidPayments)
        .values(paymentDataWithStatus)
        .returning();
      return payment;
    } catch (error) {
      console.error("Error creating bid payment:", error);
      throw error;
    }
  }

  async getBidPaymentsByRetailBid(bidId: number): Promise<GrabTBidPayment[]> {
    try {
      // Get retail bids for this bid first
      const retailBids = await this.getRetailBidsByBid(bidId);
      const retailBidIds = retailBids.map((rb) => rb.id);

      if (retailBidIds.length === 0) {
        return [];
      }

      const payments = await db
        .select()
        .from(grabTBidPayments)
        .where(eq(grabTBidPayments.rRetailBidId, retailBidIds[0])); // Simplified for now

      return payments;
    } catch (error) {
      console.error("Error fetching bid payments:", error);
      return [];
    }
  }

  async updatePaymentStatus(
    paymentId: number,
    statusId: number,
  ): Promise<void> {
    try {
      await db
        .update(grabTBidPayments)
        .set({ rStatus: statusId, processedAt: new Date() })
        .where(eq(grabTBidPayments.id, paymentId));
    } catch (error) {
      console.error("Error updating payment status:", error);
      throw error;
    }
  }

  // Users Management
  async createGrabUser(userData: {
    username: string;
    password: string;
    name: string;
    email: string;
    phone?: string;
    isRetailAllowed?: boolean;
  }): Promise<GrabTUser> {
    try {
      // Fetch "Active" status ID using status_code
      const activeStatusId = await this.getStatusIdByCode("A");

      if (!activeStatusId) {
        throw new Error("Active status not found in grab_m_status table");
      }

      const [user] = await db
        .insert(grabTUsers)
        .values({
          ...userData,
          isRetailAllowed: userData.isRetailAllowed ?? true,
          rStatus: activeStatusId,
        })
        .returning();
      return user;
    } catch (error) {
      console.error("Error creating grab user:", error);
      throw error;
    }
  }

  async getGrabUserByUsername(
    username: string,
  ): Promise<GrabTUser | undefined> {
    try {
      const [user] = await db
        .select()
        .from(grabTUsers)
        .where(eq(grabTUsers.username, username))
        .limit(1);
      return user;
    } catch (error) {
      console.error("Error fetching grab user by username:", error);
      return undefined;
    }
  }

  async getGrabUserById(userId: number): Promise<GrabTUser | undefined> {
    try {
      const [user] = await db
        .select()
        .from(grabTUsers)
        .where(eq(grabTUsers.id, userId))
        .limit(1);
      return user;
    } catch (error) {
      console.error("Error fetching grab user by ID:", error);
      return undefined;
    }
  }

  // Status Management
  async getAllStatuses(): Promise<GrabMStatus[]> {
    try {
      const statuses = await db
        .select()
        .from(grabMStatus)
        .orderBy(grabMStatus.id);
      return statuses;
    } catch (error) {
      console.error("Error fetching statuses:", error);
      return [];
    }
  }

  async getStatusIdByCode(statusCode: string): Promise<number | null> {
    try {
      console.log(`Looking up status ID for code: ${statusCode}`);
      const result = await db
        .select({ id: grabMStatus.id })
        .from(grabMStatus)
        .where(eq(grabMStatus.statusCode, statusCode))
        .limit(1);

      console.log(`Status lookup result for ${statusCode}:`, result);
      return result.length > 0 ? result[0].id : null;
    } catch (error) {
      console.error(`Error getting status ID for code ${statusCode}:`, error);
      return null;
    }
  }

  async createStatus(statusData: {
    statusName: string;
    statusCode: string;
    description?: string;
  }): Promise<GrabMStatus> {
    try {
      const [status] = await db
        .insert(grabMStatus)
        .values(statusData)
        .returning();
      return status;
    } catch (error) {
      console.error("Error creating status:", error);
      throw error;
    }
  }

  async ensureRequiredStatuses(): Promise<void> {
    try {
      const requiredStatuses = [
        {
          statusName: "Open",
          statusCode: "O",
        },
        {
          statusName: "Under Review",
          statusCode: "UR",
        },
        {
          statusName: "Approved",
          statusCode: "AP",
        },
        {
          statusName: "Rejected",
          statusCode: "R",
        },
        {
          statusName: "Processing",
          statusCode: "P",
        },
        { statusName: "Active", statusCode: "A" },
        {
          statusName: "Completed",
          statusCode: "C",
        },
      ];

      for (const statusData of requiredStatuses) {
        const existingStatus = await this.getStatusIdByCode(
          statusData.statusCode,
        );
        if (!existingStatus) {
          console.log(
            `Creating missing status: ${statusData.statusName} (${statusData.statusCode})`,
          );
          await this.createStatus(statusData);
        }
      }
    } catch (error) {
      console.error("Error ensuring required statuses:", error);
      throw error;
    }
  }

  // Update bid details
  async updateBidDetails(bidId: number, updateData: Partial<GrabTBid>): Promise<void> {
    try {
      await db
        .update(grabTBids)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(eq(grabTBids.id, bidId));
    } catch (error) {
      console.error("Error updating bid details:", error);
      throw error;
    }
  }

  // Complete Bidding Workflow
  async getBidWithDetails(bidId: number, userId?: number) {
    try {
      const bidDetails = await this.getBidById(bidId);
      if (!bidDetails) {
        return null;
      }

      const { bid } = bidDetails;

      // Parse configuration data safely
      let configData = {};
      try {
        if (
          bid.notes &&
          typeof bid.notes === "string" &&
          bid.notes.trim() !== ""
        ) {
          const parsedData = JSON.parse(bid.notes);
          if (
            parsedData &&
            typeof parsedData === "object" &&
            !Array.isArray(parsedData)
          ) {
            configData = parsedData;
          }
        }
      } catch (e) {
        console.warn(`Could not parse bid notes for bid ${bidId}:`, e);
      }

      // Get retail bids and payments
      const retailBids = await this.getRetailBidsByBid(bidId);
      const bidPayments = await this.getBidPaymentsByRetailBid(bidId);

      // Calculate seat availability
      const totalSeatsAvailable =
        bid.totalSeatsAvailable ||
        (configData as any).totalSeatsAvailable ||
        100;

      // Get status IDs for Under Review and Approved
      const underReviewStatusId = await this.getStatusIdByCode("UR");
      const approvedStatusId = await this.getStatusIdByCode("AP");

      const bookedSeats = retailBids.reduce((total, rb) => {
        if (!rb) return total;
        const status = rb.rStatus;
        if (status === underReviewStatusId || status === approvedStatusId) {
          return total + (rb.seatBooked || 0);
        }
        return total;
      }, 0);

      const availableSeats = totalSeatsAvailable - bookedSeats;
      const isBidFullyBooked = availableSeats <= 0;

      // Status Priority Logic Implementation
      let hasUserPaid = false;
      let userPaymentStatus = "not_paid";
      let displayStatus = "";
      let statusForUser = "";
      let statusSource = "global_bid"; // Default source
      let finalStatus = bid.rStatus; // Default to bid's main status

      if (userId) {
        const userRetailBid = retailBids.find((rb) => rb.rUserId === userId);
        const userPayment = bidPayments.find(
          (payment) => payment.rUserId === userId,
        );

        // Get status IDs for checking
        const underReviewStatusId = await this.getStatusIdByCode("UR");
        const approvedStatusId = await this.getStatusIdByCode("AP");
        const rejectedStatusId = await this.getStatusIdByCode("R");
        const openStatusId = await this.getStatusIdByCode("O");

        // Status Priority Logic:
        // If retail bid row exists → use grab_t_retail_bids.r_status
        // If no retail bid row → use default grab_t_bids.r_status
        if (userRetailBid) {
          finalStatus = userRetailBid.rStatus;
          statusSource = "retail_bid";
          hasUserPaid = true;

          // Map retail bid status to display status
          if (userRetailBid.rStatus === approvedStatusId) {
            displayStatus = "Approved";
            statusForUser = "approved";
            userPaymentStatus = "approved";
          } else if (userRetailBid.rStatus === rejectedStatusId) {
            displayStatus = "Rejected";
            statusForUser = "rejected";
            userPaymentStatus = "rejected";
          } else if (userRetailBid.rStatus === underReviewStatusId) {
            displayStatus = "Under Review";
            statusForUser = "under_review";
            userPaymentStatus = "under_review";
          } else {
            displayStatus = "Under Review";
            statusForUser = "under_review";
            userPaymentStatus = "under_review";
          }
        } else {
          // No retail bid exists, use global bid status
          finalStatus = bid.rStatus;
          statusSource = "global_bid";
          hasUserPaid = false;

          if (availableSeats > 0 && bid.rStatus === openStatusId) {
            displayStatus = "Open";
            statusForUser = "open";
            userPaymentStatus = "open";
          } else {
            displayStatus = "Closed";
            statusForUser = "closed";
            userPaymentStatus = "closed";
          }
        }
      } else {
        // No user provided, use global bid status
        finalStatus = bid.rStatus;
        statusSource = "global_bid";

        const openStatusId = await this.getStatusIdByCode("O");
        if (availableSeats > 0 && bid.rStatus === openStatusId) {
          displayStatus = "Open";
          statusForUser = "open";
          userPaymentStatus = "open";
        } else {
          displayStatus = "Closed";
          statusForUser = "closed";
          userPaymentStatus = "closed";
        }
      }

      // Override status if bid is fully booked and user hasn't paid
      if (isBidFullyBooked && !hasUserPaid) {
        displayStatus = "Closed";
        statusForUser = "closed";
        userPaymentStatus = "closed";
      }

      return {
        bid,
        configData,
        retailBids,
        bidPayments,
        totalSeatsAvailable,
        bookedSeats,
        availableSeats,
        isBidFullyBooked,
        displayStatus,
        statusForUser,
        userPaymentStatus,
        hasUserPaid,
        statusSource, // Indicates whether status comes from "global_bid" or "retail_bid"
        finalStatus, // The actual status ID being used
        userRetailBidStatus:
          retailBids.find((rb) => rb.rUserId === userId)?.rStatus || null,
      };
    } catch (error) {
      console.error("Error getting bid with details:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const biddingStorage = new BiddingStorage();