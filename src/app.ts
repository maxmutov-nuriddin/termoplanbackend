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

// Sog'lomlik holati (Health Check)
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    service: 'TermoPlan Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Asosiy API yo'llari
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/calculations', calculationRoutes);
app.use('/api/smeta', smetaRoutes);
app.use('/api/pdf', pdfRoutes);

// Global xatoliklar boshqaruvi
app.use(errorHandler);

export default app;
