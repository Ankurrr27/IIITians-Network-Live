import "./config/env.js";
import connectDB from "./db/index.js";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  console.log(
    "ENV CHECK:",
    process.env.CLOUDINARY_API_KEY ? "OK" : "MISSING"
  );
}

try {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch (error) {
  console.error("Failed to start server");
  console.error(error);
  process.exit(1);
}
