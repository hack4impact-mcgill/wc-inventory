
import express, { Response as ExResponse, } from "express";
import swaggerUi from "swagger-ui-express";
import morgan from "morgan";
import { Logger } from "./utils/logger.util";
import { RegisterRoutes } from "./routes";
import swaggerJson from "./swagger.json";
import { initializeDatabase } from "./database/database";
import { errorHandler } from "./middlewares/error-handling.middleware";
import cors from "cors";
import { configDotenv } from "dotenv";
import helmet from 'helmet';
import { applyRateLimiter } from "./middlewares/rate-limit.middleware";



configDotenv();

const app = express();
const logger = new Logger();
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors())
app.use(helmet());
app.use(applyRateLimiter);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerJson));

initializeDatabase()
  .then(() => {

    RegisterRoutes(app);

    app.use(errorHandler);

    app.use(function notFoundHandler(_req, res: ExResponse) {
      res.status(404).send({
        message: "Endpoint Not Found",
      });
    });

    const port = process.env.PORT || 3001;

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  });

export default app;
