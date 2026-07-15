import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.routes.js';
import invoiceRoutes from './routes/invoice.routes.js';
import reminderRoutes from './routes/reminder.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import testRoutes from './routes/test.routes.js';
import whatsappRoutes from './routes/whatsapp.routes.js';

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.CLIENT_URL,
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/payment', paymentRoutes);
app.use("/api/test", testRoutes);
app.use("/api/whatsapp", whatsappRoutes);

app.get('/', (req, res) => {
    res.send('CollectAI API is running');
});

export default app;
