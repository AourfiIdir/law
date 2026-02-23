import mongoose from "mongoose";

const BienSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    requiredPapers: {
      type: [String], // defined by admin, shown as a dropdown / checklist on frontend
      default: [],
    },
    userPapers: {
      type: [String], // URLs to uploaded documents from the user
      default: [],
    },
    status: {
      type: String,
      enum: [
        "pending_review", // user just submitted product
        "awaiting_documents", // admin accepted product and defined requiredPapers
        "under_review", // user uploaded documents, admin is checking them
        "available", // accepted and visible on website
        "sold", // sold, still visible but marked as sold
        "rejected",
      ],
      default: "pending_review",
    },
    meetup: {
      date: { type: Date },
      location: { type: String },
      notes: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Bien", BienSchema);

