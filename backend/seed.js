const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { ensureSeedData } = require('./services/seedService');

dotenv.config();

async function run() {
  await connectDB(process.env.MONGODB_URI);
  await ensureSeedData();
  console.log('Seed data ensured successfully');
  process.exit(0);
}

run().catch((error) => {
  console.error('Seed failed:', error.message);
  process.exit(1);
});
