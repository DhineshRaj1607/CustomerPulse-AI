const prisma = require('./prisma');

const connectDB = async () => {
  try {
    // Test the Prisma connection by running a simple query
    await prisma.$queryRaw`SELECT 1`;
    console.log('PostgreSQL Connected via Prisma');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = {
  connectDB,
  prisma,
};
