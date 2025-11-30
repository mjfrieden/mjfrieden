import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { config } from './config/env';
import authRoutes from './routes/authRoutes';
import dataRoutes from './routes/dataSourceRoutes';

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors({ origin: '*'}));

app.get('/', (_req, res) => {
  res.send({ name: 'White Cloud Medical – VaxPass API' });
});

app.use('/api/auth', authRoutes);
app.use('/api', dataRoutes);

app.listen(config.port, () => {
  console.log(`API running on port ${config.port}`);
});
