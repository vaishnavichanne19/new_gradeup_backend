import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "login",
      required: true,
    },
    area: { type: String, required: true },
    companyname: { type: String, required: true },
    companyphone: { type: Number },
    ownerName: { type: String },
    ownerphone: { type: Number },
    domain: {
      type: String,
      enum: ["Construction", "Education", "Healthcare", "Other"],
      required: true,
    },
    customDomain: {
      type: String,
      default: "",
    },
    marketingType: {
      type: String,
      enum: ["All", "Product", "Service"],
    },
    marketingOptions: {
      type: [String],
      default: [],
    },
    location: {
      locationtype: {
        type: String,
        enum: ["live", "manual"]
      },
     address: {
        type: String,
      },
      lat: {
        type: Number,
      },
      lng: {
        type: Number,
      },
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  },
);

export const LeadModuleData = mongoose.model("LeadData", leadSchema);
