import WhatsAppSession from "../models/whatsAppSession.model.js";
import { connectWhatsApp } from "./whatsapp.service.js";

export const restoreWhatsAppSessions = async () => {
  try {
    console.log("🔄 Restoring WhatsApp sessions...");

    const sessions = await WhatsAppSession.find({
      status: "connected",
    });

    console.log(`Found ${sessions.length} session(s).`);

    for (const session of sessions) {
      try {
        console.log(
          `Restoring ${session.user.toString()}`
        );

        await connectWhatsApp(
          session.user.toString()
        );
      } catch (err) {
        console.error(
          `Failed restoring ${session.user}`,
          err.message
        );
      }
    }

    console.log("✅ Session restore complete.");
  } catch (err) {
    console.error(
      "Restore Service Error:",
      err.message
    );
  }
};