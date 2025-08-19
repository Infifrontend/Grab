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

      const [bid] = await db
        .insert(grabTBids)
        .values(bidData)
        .returning();
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

  async updateBidStatus(bidId: number, statusId: number): Promise<void> {
    try {
      await db
        .update(grabTBids)
        .set({ rStatus: statusId, updatedAt: new Date() })
        .where(eq(grabTBids.id, bidId));
    } catch (error) {
      console.error("Error updating bid status:", error);
      throw error;
    }
  }

  // Helper method to get status ID by status_code
  async getStatusIdByCode(statusCode: string): Promise<number | null> {
    try {
      const [status] = await db
        .select({ id: grabMStatus.id })
        .from(grabMStatus)
        .where(eq(grabMStatus.statusCode, statusCode))
        .limit(1);
      return status?.id || null;
    } catch (error) {
      console.error("Error fetching status by code:", error);
      return null;
    }
  }

  // Retail Bids (User bid submissions)
  async createRetailBid(retailBidData: InsertGrabTRetailBid): Promise<GrabTRetailBid> {
    try {
      // Fetch "Under Review" status ID using status_code
      const underReviewStatusId = await this.getStatusIdByCode("UR");
      
      if (!underReviewStatusId) {
        throw new Error("Under Review status not found in grab_m_status table");
      }

      const bidDataWithStatus = {
        ...retailBidData,
        rStatus: retailBidData.rStatus || underReviewStatusId
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

  async updateRetailBidStatus(retailBidId: number, statusId: number): Promise<void> {
    try {
      await db
        .update(grabTRetailBids)
        .set({ rStatus: statusId, updatedAt: new Date() })
        .where(eq(grabTRetailBids.id, retailBidId));
    } catch (error) {
      console.error("Error updating retail bid status:", error);
      throw error;
    }
  }

  // Payments Management
  async createBidPayment(paymentData: InsertGrabTBidPayment): Promise<GrabTBidPayment> {
    try {
      // Fetch "Approved" status ID using status_code
      const approvedStatusId = await this.getStatusIdByCode("AP");
      
      if (!approvedStatusId) {
        throw new Error("Approved status not found in grab_m_status table");
      }

      const paymentDataWithStatus = {
        ...paymentData,
        rStatus: paymentData.rStatus || approvedStatusId,
        processedAt: paymentData.processedAt || new Date()
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
      const retailBidIds = retailBids.map(rb => rb.id);

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

  async updatePaymentStatus(paymentId: number, statusId: number): Promise<void> {
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

  async getGrabUserByUsername(username: string): Promise<GrabTUser | undefined> {
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

  async getStatusById(statusId: number): Promise<GrabMStatus | undefined> {
    try {
      const [status] = await db
        .select()
        .from(grabMStatus)
        .where(eq(grabMStatus.id, statusId))
        .limit(1);
      return status;
    } catch (error) {
      console.error("Error fetching status by ID:", error);
      return undefined;
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
        if (bid.notes && typeof bid.notes === "string" && bid.notes.trim() !== "") {
          const parsedData = JSON.parse(bid.notes);
          if (parsedData && typeof parsedData === "object" && !Array.isArray(parsedData)) {
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
      const totalSeatsAvailable = bid.totalSeatsAvailable || (configData as any).totalSeatsAvailable || 100;
      
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

      // User-specific status
      let hasUserPaid = false;
      let userPaymentStatus = "not_paid";
      let displayStatus = "";
      let statusForUser = "";

      if (userId) {
        const userRetailBid = retailBids.find(rb => rb.rUserId === userId);
        const userPayment = bidPayments.find(payment => payment.rUserId === userId);

        // Get status IDs for checking
        const underReviewStatusId = await this.getStatusIdByCode("UR");
        const approvedStatusId = await this.getStatusIdByCode("AP");
        const rejectedStatusId = await this.getStatusIdByCode("R");

        hasUserPaid = userRetailBid && (userRetailBid.rStatus === underReviewStatusId || userRetailBid.rStatus === approvedStatusId) || !!userPayment;

        if (hasUserPaid) {
          if (userRetailBid?.rStatus === approvedStatusId) {
            displayStatus = "Approved";
            statusForUser = "approved";
            userPaymentStatus = "approved";
          } else if (userRetailBid?.rStatus === rejectedStatusId) {
            displayStatus = "Rejected";
            statusForUser = "rejected";
            userPaymentStatus = "rejected";
          } else if (userRetailBid?.rStatus === underReviewStatusId) {
            displayStatus = "Under Review";
            statusForUser = "under_review";
            userPaymentStatus = "under_review";
          } else {
            displayStatus = "Under Review";
            statusForUser = "under_review";
            userPaymentStatus = "under_review";
          }
        } else {
          if (availableSeats > 0) {
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
        if (availableSeats > 0) {
          displayStatus = "Open";
          statusForUser = "open";
          userPaymentStatus = "open";
        } else {
          displayStatus = "Closed";
          statusForUser = "closed";
          userPaymentStatus = "closed";
        }
      }

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
        userRetailBidStatus: retailBids.find(rb => rb.rUserId === userId)?.rStatus || null
      };
    } catch (error) {
      console.error("Error getting bid with details:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const biddingStorage = new BiddingStorage();