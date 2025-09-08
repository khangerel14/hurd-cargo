import cron from 'node-cron';
import Product from '../models/Product';

// Run every day at midnight (00:00)
cron.schedule('0 0 * * *', async () => {
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14); // subtract 14 days from today

  console.log(
    `[CRON] Checking for products handed over before ${fourteenDaysAgo.toISOString()}`
  );

  try {
    const outdated = await Product.find({
      status: 'handed_over',
      updatedAt: { $lt: fourteenDaysAgo },
    });

    console.log(`[CRON] Found ${outdated.length} products to delete`);

    const result = await Product.deleteMany({
      status: 'handed_over',
      updatedAt: { $lt: fourteenDaysAgo },
    });

    console.log(`[CRON] Deleted ${result.deletedCount} products`);
  } catch (err) {
    console.error('[CRON] Error:', err);
  }
});
