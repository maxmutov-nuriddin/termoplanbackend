import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import calculationRoutes from './routes/calculationRoutes';
import smetaRoutes from './routes/smetaRoutes';
import pdfRoutes from './routes/pdfRoutes';
import { errorHandler } from './middleware/errorHandler';

const app: Application = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(morgan('dev'));

import mongoose from 'mongoose';

// Sog'lomlik holati (Health & Live Check)
const healthHandler = (req: Request, res: Response) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const uptimeSec = Math.floor(process.uptime());
  const hours = Math.floor(uptimeSec / 3600);
  const minutes = Math.floor((uptimeSec % 3600) / 60);
  const seconds = uptimeSec % 60;
  const uptimeString = `${hours}h ${minutes}m ${seconds}s`;

  res.status(200).json({
    status: 'online',
    service: 'TermoPlan Backend API',
    uptime: uptimeString,
    uptimeSeconds: uptimeSec,
    database: {
      status: dbStatusMap[dbState] || 'unknown',
      connected: dbState === 1,
    },
    memory: {
      rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
    },
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
};

// Har qanday monitoring xizmati (UptimeRobot, Render, brauzer) uchun ochiq yo'llar
app.get('/api/health', healthHandler);
app.get('/api/live', healthHandler);
app.get('/health', healthHandler);
app.get('/live', healthHandler);
app.get('/ping', (req: Request, res: Response) => res.status(200).send('pong'));

// Asosiy API yo'llari
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/calculations', calculationRoutes);
app.use('/api/smeta', smetaRoutes);
app.use('/api/pdf', pdfRoutes);

// Global xatoliklar boshqaruvi
app.use(errorHandler);

export default app;
