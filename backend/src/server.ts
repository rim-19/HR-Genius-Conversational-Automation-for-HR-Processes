

// backend/src/server.ts
import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
// import other routes if ready
// import employeeRoutes from './routes/employeeRoutes';
import documentRoutes from './routes/documentRoutes';




dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/documents', documentRoutes);
// Register API routes
app.use('/api', userRoutes);
// app.use('/api/employees', employeeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at: http://localhost:${PORT}`);
});
