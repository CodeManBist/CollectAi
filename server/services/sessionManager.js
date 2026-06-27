import pkg from "whatsapp-web.js";

const { Client, LocalAuth } = pkg;

const clients = new Map();

export const setInitialized = (userId, value = true) => {
  const session = clients.get(userId);

  if (!session) return;

  session.initialized = value;
};

export const isInitialized = (userId) => {
  const session = clients.get(userId);

  if (!session) return false;

  return session.initialized;
};

/**
 * Create a WhatsApp client for a user.
 */
export const createClient = (userId) => {
  if (clients.has(userId)) {
    return clients.get(userId);
  }

  const client = new Client({
    authStrategy: new LocalAuth({
      clientId: userId.toString(),
    }),

    puppeteer: {
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    },
  });

  clients.set(userId, {
    client,
    initialized: false,
  });

  return client;
};

/**
 * Get existing client
 */
export const getClient = (userId) => {
  const session = clients.get(userId);

  return session ? session.client : null;
};

/**
 * Check if client exists
 */
export const hasClient = (userId) => {
  return clients.has(userId);
};

/**
 * Destroy and remove client
 */
export const removeClient = async (userId) => {
  const session = clients.get(userId);

  if (!session) return;

  try {
    await session.client.destroy();
  } catch (err) {
    console.error("Destroy Client Error:", err.message);
  }

  clients.delete(userId);
};

/**
 * Return all connected clients
 */
export const getAllClients = () => clients;