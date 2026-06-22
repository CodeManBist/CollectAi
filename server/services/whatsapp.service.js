import pkg from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

const { Client, LocalAuth } = pkg;

let isReady = false;

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "collectai",
  }),
});

client.on("qr", (qr) => {
  console.log("\nSCAN THIS QR WITH WHATSAPP\n");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  isReady = true;
  console.log("✅ WhatsApp Ready");
});

client.on("authenticated", () => {
  console.log("✅ WhatsApp Authenticated");
});

client.initialize();

export const sendWhatsAppMessage = async (phone, message) => {
  try {
    if (!isReady) {
      throw new Error("WhatsApp is not ready");
    }

    await new Promise(resolve =>
      setTimeout(resolve, 3000)
    );

    const cleanedPhone = phone.replace(/\D/g, "");
    const finalPhone =
      cleanedPhone.length === 10
        ? `91${cleanedPhone}`
        : cleanedPhone;

    const formattedPhone = `${finalPhone}@c.us`;

    const isRegistered =
      await client.isRegisteredUser(formattedPhone);

    if (!isRegistered) {
      throw new Error("WhatsApp number not found");
    }

    const result = await client.sendMessage(
      formattedPhone,
      message
    );

    return {
      success: true,
      messageId: result.id.id,
    };
  } catch (error) {
    console.error("WhatsApp Error:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};