import "./config/env.js";   // ✅ FIRST LINE, NO EXCEPTIONS
if (process.env.NODE_ENV !== "production") {
  console.log(
    "ENV CHECK:",
    process.env.CLOUDINARY_API_KEY ? "OK" : "MISSING"
  );
}


import express from "express";
import cors from "cors";
import connectDB from "./db/index.js";
import placementRoutes from "./routes/placement.routes.js";

import collegeRoutes from "./routes/college.routes.js";
import clubRoutes from "./routes/club.routes.js";
import eventRoutes from "./routes/event.routes.js";
import teamMemberRoutes from "./routes/teamMember.routes.js";
import adminRoutes from "./routes/admin.routes.js";




const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "http://localhost:5173",
      "https://iiitians-network-connect.vercel.app/"
    ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));


app.use(express.json());

app.get("/", (req, res) => res.send("Backend running"));


app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});


app.use("/api/colleges", collegeRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/placements", placementRoutes);
app.use("/api/team", teamMemberRoutes);
app.use("/api/admin", adminRoutes);



connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT}`)
  );
});
