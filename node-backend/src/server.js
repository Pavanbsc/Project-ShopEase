import dotenv from 'dotenv';
import app from './app.js';
import { initializeDatabase } from './db.js';

dotenv.config();

const PORT = Number(process.env.PORT || 8083);

const startServer = async () => {
  await initializeDatabase();

  app.listen(PORT, () => {
    console.log(`ShopEase product API listening on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start ShopEase product API:', error.message || error);
  process.exit(1);
});
