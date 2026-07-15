import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/db.js";
import { startReminderJob } from "./jobs/reminderJob.js";
import { restoreWhatsAppSessions } from "./services/WhatsappRestore.service.js";

const PORT = process.env.PORT;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, async () => {
            console.log(`Server running on port ${PORT}`);
            startReminderJob();

            await restoreWhatsAppSessions();
        });
    } catch (error) {
        console.error("Error starting server:", error.message);
    }
};

startServer();