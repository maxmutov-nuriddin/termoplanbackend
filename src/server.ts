import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDatabase } from './config/database';

const PORT = process.env.PORT || 5001;

async function startServer() {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 TermoPlan Backend Server ishga tushdi:`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
    console.log(`📍 Iqlim hududlari: http://localhost:${PORT}/api/projects/regions/climate`);
    console.log(`====================================================`);
  });
}

startServer().catch((err) => {
  console.error('[Server Startup Error]', err);
});
