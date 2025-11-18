// backend/src/server.ts

import express from 'express';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes';
import documentRoutes from './routes/documentRoutes';
import employeeRoutes from './routes/employeeRoutes'; // ENABLED

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', userRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/employees', employeeRoutes); // ENABLED

// Server port
const PORT = process.env.PORT || 5000;

// IMPORTANT FIX: force IPv4 so that Windows CMD/PowerShell/cURL/n8n can connect
app.listen(Number(PORT), '127.0.0.1', () => {
  console.log(`🚀 Server is running on http://127.0.0.1:${PORT}`);
});
