const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const initializeDatabase = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS customers (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT NOT NULL,
      city TEXT,
      totalorders INTEGER DEFAULT 0,
      totalspent NUMERIC DEFAULT 0,
      lastpurchasedate TIMESTAMPTZ,
      segment TEXT,
      status TEXT DEFAULT 'active',
      createdat TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS segments (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      audiencesize INTEGER DEFAULT 0,
      conditions JSONB DEFAULT '[]'::jsonb,
      estimatedreach INTEGER DEFAULT 0,
      createdat TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id SERIAL PRIMARY KEY,
      campaignname TEXT NOT NULL,
      segment TEXT NOT NULL,
      channels JSONB DEFAULT '[]'::jsonb,
      message TEXT,
      scheduletype TEXT DEFAULT 'Send Now',
      status TEXT DEFAULT 'Draft',
      sentcount INTEGER DEFAULT 0,
      sentdate TIMESTAMPTZ,
      openrate NUMERIC DEFAULT 0,
      createdat TIMESTAMPTZ DEFAULT NOW()
    );
  `);
};

const connectDB = async () => {
  try {
    const client = await pool.connect();
    client.release();
    await initializeDatabase();
    console.log('PostgreSQL Connected');
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

const query = (text, params) => pool.query(text, params);

module.exports = {
  connectDB,
  query,
};
