import cron from 'node-cron';
import Product from '../models/Product';

// Run every day at midnight (00:00)
cron.schedule('0 0 * * *', async () => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1); // subtract 1 month

  console.log(
    `[CRON] Checking for products handed over before ${oneMonthAgo.toISOString()}`
  );

  try {
    const outdated = await Product.find({
      status: 'handed_over',
      updatedAt: { $lt: oneMonthAgo },
    });

    console.log(`[CRON] Found ${outdated.length} products to delete`);

    const result = await Product.deleteMany({
      status: 'handed_over',
      updatedAt: { $lt: oneMonthAgo },
    });

    console.log(`[CRON] Deleted ${result.deletedCount} products`);
  } catch (err) {
    console.error('[CRON] Error:', err);
  }
});
