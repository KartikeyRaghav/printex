// Import required dependencies
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Create an Express application
const app = express();
const allowedOrigin = process.env.FRONTEND_URL;

app.use(
  cors({
    allowedOrigin,
    credentials: true,
  })
);

// Middleware to parse JSON bodies (up to 50MB)
app.use((req, res, next) => {
  if (req.is("multipart/form-data")) {
    next(); // Skip JSON parsing
  } else {
    express.json({ limit: "50mb" })(req, res, next);
  }
});

// Middleware to parse URL-encoded data (form data)
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Middleware to parse cookies sent with requests
app.use(cookieParser());

// Import Route Modules
import subscriptionRouter from "./routes/subscription.route.js";
import authRouter from "./routes/auth.route.js";

// Route Middleware Setup
app.use("/api/subscription", subscriptionRouter);
app.use("/api/auth", authRouter);

export { app };
