import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "qr",
        "authenticated",
        "connected",
        "disconnected",
        "auth_failed",
      ],
      default: "pending",
    },

    phoneNumber: {
      type: String,
      default: null,
    },

    profileName: {
      type: String,
      default: null,
    },

    qr: {
      type: String,
      default: null,
    },

    lastConnected: {
      type: Date,
      default: null,
    },

    lastDisconnected: {
      type: Date,
      default: null,
    },

    connectionReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const WhatsAppSession = mongoose.model(
  "WhatsAppSession",
  sessionSchema
);

export default WhatsAppSession;