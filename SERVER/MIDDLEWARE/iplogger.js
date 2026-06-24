import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFilePath = path.resolve(__dirname, "../ip_log.txt");

const iplogger = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const timestamp = new Date().toISOString();

    res.on("finish", () => {
        const logEntry = `${timestamp} - ${ip} - ${res.statusCode}\n`;

        fs.appendFile(logFilePath, logEntry, (error) => {
            if (error) {
                console.error("Failed to write IP log:", error);
            }
        });
    });

    next();
};

export default iplogger;
