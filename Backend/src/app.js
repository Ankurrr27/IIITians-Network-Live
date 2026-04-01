import express from "express";
import cors from "cors";
import placementRoutes from "./routes/placement.routes.js";
import collegeRoutes from "./routes/college.routes.js";
import clubRoutes from "./routes/club.routes.js";
import eventRoutes from "./routes/event.routes.js";
import teamMemberRoutes from "./routes/teamMember.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import alumniRoutes from "./routes/alumni.routes.js";

const app = express();

const defaultOrigins = [
  "http://localhost:5173",
  "https://iiitians-network-connect.vercel.app",
];

const allowedOrigins = [
  ...defaultOrigins,
  ...(process.env.CORS_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/colleges", collegeRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/placements", placementRoutes);
app.use("/api/team", teamMemberRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/alumni", alumniRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode =
    err.statusCode || (err.message === "Not allowed by CORS" ? 403 : 500);
  const message =
    process.env.NODE_ENV === "production" && statusCode === 500
      ? "Internal server error"
      : err.message;

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({ message });
});

export default app;
