import express from 'express';
import userRoutes from './routes/userRoutes';
import connectDB from './config/db';
import productRoutes from './routes/productRoutes';
import cors from 'cors';
import authRouter from './routes/auth.router';
import './jobs/cleaner';
import Product from './models/Product';

const app = express();
app.use(
  cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

connectDB();

app.use(express.json());

app.get('/test-delete', async (req, res) => {
  const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);

  try {
    const result = await Product.deleteMany({
      status: 'handed_over',
      updatedAt: { $lt: tenDaysAgo },
    });

    res.json({ deleted: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to the Cargo-Web API!');
});

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRouter);

const PORT = process.env.PORT ?? 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
