import cron from 'node-cron';
import Product from '../models/Product';

cron.schedule('* * * * *', async () => {
  const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
  console.log(
    `[CRON] Checking for products older than ${tenDaysAgo.toISOString()}`
  );

  try {
    const outdated = await Product.find({
      status: 'handed_over',
      updatedAt: { $lt: tenDaysAgo },
    });

    console.log(`[CRON] Found ${outdated.length} products to delete`);

    const result = await Product.deleteMany({
      status: 'handed_over',
      updatedAt: { $lt: tenDaysAgo },
    });

    console.log(`[CRON] Deleted ${result.deletedCount} products`);
  } catch (err) {
    console.error('[CRON] Error:', err);
  }
});
