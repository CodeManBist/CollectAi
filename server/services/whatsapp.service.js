import qrcode from "qrcode-terminal";

import WhatsAppSession from "../models/whatsAppSession.model.js";

import {
  createClient,
  getClient,
  hasClient,
  removeClient,
  setInitialized,
  isInitialized,
} from "./sessionManager.js";

export const connectWhatsApp = async (userId) => {
  if (hasClient(userId)) {
    return {
      success: true,
      message: "Client already initialized.",
    };
  }

  const client = createClient(userId);

  // ==========================
  // QR EVENT
  // ==========================
  client.on("qr", async (qr) => {
    console.log(`QR Generated for ${userId}`);

    qrcode.generate(qr, {
      small: true,
    });

    await WhatsAppSession.findOneAndUpdate(
      { user: userId },
      {
        $set: {
          user: userId,
          status: "qr",
          qr,
        }
      },
      {
        upsert: true,
        new: true,
      }
    );
  });

  // ==========================
  // AUTHENTICATED
  // ==========================
  client.on("authenticated", async () => {
    console.log(`Authenticated ${userId}`);

    await WhatsAppSession.findOneAndUpdate(
      { user: userId },
      {
        status: "authenticated",
      }
    );
  });

  // ==========================
  // READY
  // ==========================
  client.on("ready", async () => {

  setInitialized(userId);

  console.log(`WhatsApp Ready ${userId}`);

  const info = client.info;

  await WhatsAppSession.findOneAndUpdate(
    { user: userId },
    {
      status: "connected",
      qr: null,
      phoneNumber: info?.wid?.user || "",
      profileName: info?.pushname || "",
      lastConnected: new Date(),
    }
  );
});

  // ==========================
  // AUTH FAILURE
  // ==========================
  client.on("auth_failure", async (msg) => {
    console.log(`Authentication Failed ${userId}`);

    await WhatsAppSession.findOneAndUpdate(
      { user: userId },
      {
        status: "auth_failed",
        connectionReason: msg,
      }
    );
  });

  // ==========================
  // DISCONNECTED
  // ==========================
  client.on("disconnected", async (reason) => {
    console.log(`Disconnected ${userId}`);

    setInitialized(userId, false);

    await WhatsAppSession.findOneAndUpdate(
      { user: userId },
      {
        status: "disconnected",
        qr: null,
        lastDisconnected: new Date(),
        connectionReason: reason,
      }
    );

    await removeClient(userId);
  });
  setInitialized(userId, false);

  client.initialize();

  return {
    success: true,
    message: "WhatsApp initialization started.",
  };
};

export const getStatus = async (userId) => {
  console.log("Requested userId:", userId);
  const session = await WhatsAppSession.findOne({ user: userId });

  console.log("Session found:", session);

  if (!session) {
    return {
      connected: false,
      status: "not_connected",
    };
  }

  return {
    connected: session.status === "connected",
    status: session.status,
    phoneNumber: session.phoneNumber,
    profileName: session.profileName,
    lastConnected: session.lastConnected,
  };
};

export const getQRCode = async (userId) => {
  const session = await WhatsAppSession.findOne({ user: userId });
  console.log("Requested userId:", userId);
  console.log("Session found:", session);

  if (!session) {
    return null;
  }

  return session.qr;
};

export const sendWhatsAppMessage = async (
  userId,
  phone,
  message
) => {
  try {
    if (!hasClient(userId) || !isInitialized(userId)) {
      throw new Error("WhatsApp is not connected.");
    }

    const client = getClient(userId);

    if (!client) {
      throw new Error(
        "WhatsApp is not connected."
      );
    }

    const cleanedPhone = phone
      .toString()
      .replace(/\D/g, "");

    const finalPhone =
      cleanedPhone.length === 10
        ? `91${cleanedPhone}`
        : cleanedPhone;

    const chatId = `${finalPhone}@c.us`;

    const isRegistered =
      await client.isRegisteredUser(chatId);

    if (!isRegistered) {
      throw new Error(
        "Number is not registered on WhatsApp."
      );
    }

    const result = await client.sendMessage(
      chatId,
      message
    );

    return {
      success: true,
      messageId: result.id.id,
    };
  } catch (error) {
    console.error(
      "WhatsApp Send Error:",
      error.message
    );

    return {
      success: false,
      error: error.message,
    };
  }
};

export const disconnectWhatsApp = async (userId) => {
  const client = getClient(userId);

  if (!client) {
    // No client in memory, but clean the DB anyway
    await WhatsAppSession.deleteOne({ user: userId });

    return {
      success: true,
      message: "Session removed.",
    };
  }

  try {
    await client.logout();
  } catch (err) {
    console.error("Logout Error:", err.message);
  }

  try {
    await client.destroy();
  } catch (err) {
    console.error("Destroy Error:", err.message);
  }

  await removeClient(userId);

  // Remove session document completely
  await WhatsAppSession.deleteOne({ user: userId });

  return {
    success: true,
    message: "Logged out successfully.",
  };
};