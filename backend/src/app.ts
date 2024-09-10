
import express, {
  Response as ExResponse,
  Request as ExRequest,
} from "express";
import swaggerUi from "swagger-ui-express";
import morgan from "morgan";
import { Logger } from "./utils/logger.util";
import { RegisterRoutes } from "./routes";
import swaggerJson from "./swagger.json";
import { initializeDatabase } from "./database/database";
import { errorHandler } from "./middlewares/error-handling.middleware";

const app = express();
const logger = new Logger();

app.use(express.json());
app.use(morgan("tiny"));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerJson));

initializeDatabase()
  .then(() => {
    // Tsoa routes
    RegisterRoutes(app);

    app.use(errorHandler);

    app.use(function notFoundHandler(_req, res: ExResponse) {
      res.status(404).send({
        message: "Not Found",
      });
    });

    const port = process.env.PORT || 3000;

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  });

export default app;
