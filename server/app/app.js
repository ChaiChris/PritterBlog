import express from "express";
import { logger } from "./logger";
const app = express();
// app.use(cors());
app.use((req, res, next) => {
    logger.info(`${req.method}${req.url}`);
    next();
});
app.get("/error", (req, res) => {
    throw new Error("Something went wrong");
});
app.use((err, req, res, next) => {
    logger.error(err);
    res.status(500).json({
        error: "Server Error",
    });
});
app.listen(3001, () => {
    logger.info("Server running on http://localhost:3001 (DockerProject)");
});
//# sourceMappingURL=app.js.map