import express from "express";

import { protect } from "../middleware/auth.middleware.js";

import {
  connect,
  status,
  qr,
  logout,
} from "../controllers/whatsapp.controller.js";

const router = express.Router();

router.post(
  "/connect",
  protect,
  connect
);

router.get(
  "/status",
  protect,
  status
);

router.get(
  "/qr",
  protect,
  qr
);

router.post(
  "/logout",
  protect,
  logout
);

export default router;