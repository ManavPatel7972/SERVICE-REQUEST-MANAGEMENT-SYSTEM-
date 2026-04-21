import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS
const corsOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",").map(o => o.trim()).filter(Boolean);

app.use(cors({
  origin(origin, cb) {
    if (!origin || corsOrigins.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.options(/.*/, cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check
app.get("/", (req, res) => res.json({ status: "ok", message: "SRM API Running" }));

// Import middlewares
import { globalErrorHandler } from "./middlewares/error.middleware.js";
import { verifyJwt } from "./middlewares/auth.middleware.js";

// Import routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import serviceDeptRoutes from "./routes/serviceDept.routes.js";
import serviceDeptPersonRoutes from "./routes/serviceDeptPerson.routes.js";
import serviceTypeRoutes from "./routes/serviceType.routes.js";
import serviceRequestTypeRoutes from "./routes/serviceRequestType.routes.js";
import serviceRequestRoutes from "./routes/serviceRequest.routes.js";
import serviceRequestReplyRoutes from "./routes/serviceRequestReply.routes.js";
import serviceRequestTypeWisePersonRoutes from "./routes/serviceRequestTypeWisePerson.routes.js";
import serviceRequestStatusRoutes from "./routes/serviceRequestStatus.routes.js";


// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", verifyJwt, userRoutes);
app.use("/api/v1/service-departments", verifyJwt, serviceDeptRoutes);
app.use("/api/v1/service-dept-persons", verifyJwt, serviceDeptPersonRoutes);
app.use("/api/v1/service-types", verifyJwt, serviceTypeRoutes);
app.use("/api/v1/service-request-types", verifyJwt, serviceRequestTypeRoutes);
app.use("/api/v1/request-type-persons", verifyJwt, serviceRequestTypeWisePersonRoutes);
app.use("/api/v1/service-statuses", verifyJwt, serviceRequestStatusRoutes);
app.use("/api/v1/service-requests", verifyJwt, serviceRequestRoutes);
app.use("/api/v1/service-request-replies", verifyJwt, serviceRequestReplyRoutes);

// Global error handler
app.use(globalErrorHandler);

export default app;
