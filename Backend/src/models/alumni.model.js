import mongoose from "mongoose";

const alumniSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    iiit: {
      type: String,
      required: true,
      trim: true,
    },
    graduationYear: {
      type: Number,
      required: true,
      min: 2000,
      max: 2100,
    },
    generation: {
      type: String,
      required: true,
      trim: true,
    },
    branch: {
      type: String,
      required: true,
      trim: true,
    },
    currentRole: {
      type: String,
      required: true,
      trim: true,
    },
    currentCompany: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    linkedin: {
      type: String,
      trim: true,
      default: "",
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
  },
  { timestamps: true }
);

alumniSchema.index({
  name: "text",
  iiit: "text",
  branch: "text",
  currentRole: "text",
  currentCompany: "text",
  generation: "text",
});

export default mongoose.model("Alumni", alumniSchema);
