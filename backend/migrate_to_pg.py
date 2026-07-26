from pathlib import Path
base = Path(r'c:\Project\CustomerPulse AI\backend')
files = {
    'config/db.js': """const { Pool } = require('pg');

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
""",
    'models/Customer.js': """const { query } = require('../config/db');

const normalizeCustomer = (row) => {
  if (!row) return null;
  return {
    _id: String(row.id),
    name: row.name,
    email: row.email,
    phone: row.phone,
    city: row.city,
    totalOrders: row.totalorders,
    totalSpent: Number(row.totalspent),
    lastPurchaseDate: row.lastpurchasedate,
    segment: row.segment,
    status: row.status,
    createdAt: row.createdat,
  };
};

const getAll = async () => {
  const result = await query('SELECT * FROM customers ORDER BY createdat DESC');
  return result.rows.map(normalizeCustomer);
};

const getById = async (id) => {
  const result = await query('SELECT * FROM customers WHERE id = $1 LIMIT 1', [id]);
  return normalizeCustomer(result.rows[0]);
};

const create = async (data) => {
  const result = await query(
    `INSERT INTO customers (name, email, phone, city, totalorders, totalspent, lastpurchasedate, segment, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      data.name,
      data.email,
      data.phone,
      data.city || null,
      data.totalOrders ?? 0,
      data.totalSpent ?? 0,
      data.lastPurchaseDate || null,
      data.segment || null,
      data.status || 'active',
    ],
  );
  return normalizeCustomer(result.rows[0]);
};

const update = async (id, fields) => {
  const columnMap = {
    name: 'name',
    email: 'email',
    phone: 'phone',
    city: 'city',
    totalOrders: 'totalorders',
    totalSpent: 'totalspent',
    lastPurchaseDate: 'lastpurchasedate',
    segment: 'segment',
    status: 'status',
  };

  const updates = [];
  const values = [];
  let index = 1;

  Object.entries(columnMap).forEach(([field, column]) => {
    if (fields[field] !== undefined) {
      updates.push(`${column} = $${index}`);
      values.push(fields[field]);
      index += 1;
    }
  });

  if (updates.length === 0) {
    return getById(id);
  }

  values.push(id);
  const result = await query(
    `UPDATE customers SET ${updates.join(', ')} WHERE id = $${index} RETURNING *`,
    values,
  );
  return normalizeCustomer(result.rows[0]);
};

const deleteById = async (id) => {
  await query('DELETE FROM customers WHERE id = $1', [id]);
};

const getCount = async () => {
  const result = await query('SELECT COUNT(*) FROM customers');
  return parseInt(result.rows[0].count, 10);
};

const findAllWithEmails = async () => {
  const result = await query("SELECT * FROM customers WHERE email IS NOT NULL AND email <> '' ORDER BY createdat DESC");
  return result.rows.map(normalizeCustomer);
};

const findBySegmentExact = async (segment) => {
  const result = await query(
    `SELECT * FROM customers WHERE segment ILIKE $1 AND email IS NOT NULL AND email <> '' ORDER BY createdat DESC`,
    [segment],
  );
  return result.rows.map(normalizeCustomer);
};

const findBySegmentPartial = async (segment) => {
  const result = await query(
    `SELECT * FROM customers WHERE segment ILIKE $1 AND email IS NOT NULL AND email <> '' ORDER BY createdat DESC`,
    [`%${segment}%`],
  );
  return result.rows.map(normalizeCustomer);
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteById,
  getCount,
  findAllWithEmails,
  findBySegmentExact,
  findBySegmentPartial,
};
""",
    'models/Segment.js': """const { query } = require('../config/db');

const normalizeSegment = (row) => {
  if (!row) return null;
  return {
    _id: String(row.id),
    name: row.name,
    description: row.description,
    audienceSize: row.audiencesize,
    conditions: row.conditions || [],
    estimatedReach: row.estimatedreach,
    createdAt: row.createdat,
  };
};

const getAll = async () => {
  const result = await query('SELECT * FROM segments ORDER BY createdat DESC');
  return result.rows.map(normalizeSegment);
};

const getById = async (id) => {
  const result = await query('SELECT * FROM segments WHERE id = $1 LIMIT 1', [id]);
  return normalizeSegment(result.rows[0]);
};

const getByName = async (name) => {
  const result = await query('SELECT * FROM segments WHERE name ILIKE $1 LIMIT 1', [name]);
  return normalizeSegment(result.rows[0]);
};

const create = async (data) => {
  const result = await query(
    `INSERT INTO segments (name, description, audiencesize, conditions, estimatedreach)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      data.name,
      data.description || '',
      data.audienceSize ?? data.estimatedReach ?? 0,
      JSON.stringify(data.conditions || []),
      data.estimatedReach ?? data.audienceSize ?? 0,
    ],
  );
  return normalizeSegment(result.rows[0]);
};

const update = async (id, fields) => {
  const columnMap = {
    name: 'name',
    description: 'description',
    audienceSize: 'audiencesize',
    conditions: 'conditions',
    estimatedReach: 'estimatedreach',
  };

  const updates = [];
  const values = [];
  let index = 1;

  Object.entries(columnMap).forEach(([field, column]) => {
    if (fields[field] !== undefined) {
      updates.push(`${column} = $${index}`);
      values.push(field === 'conditions' ? JSON.stringify(fields.conditions || []) : fields[field]);
      index += 1;
    }
  });

  if (updates.length === 0) {
    return getById(id);
  }

  values.push(id);
  const result = await query(
    `UPDATE segments SET ${updates.join(', ')} WHERE id = $${index} RETURNING *`,
    values,
  );
  return normalizeSegment(result.rows[0]);
};

const deleteById = async (id) => {
  await query('DELETE FROM segments WHERE id = $1', [id]);
};

const getCount = async () => {
  const result = await query('SELECT COUNT(*) FROM segments WHERE audiencesize > 0');
  return parseInt(result.rows[0].count, 10);
};

module.exports = {
  getAll,
  getById,
  getByName,
  create,
  update,
  deleteById,
  getCount,
};
""",
    'models/Campaign.js': """const { query } = require('../config/db');

const normalizeCampaign = (row) => {
  if (!row) return null;
  return {
    _id: String(row.id),
    campaignName: row.campaignname,
    segment: row.segment,
    channels: row.channels || [],
    message: row.message,
    scheduleType: row.scheduletype,
    status: row.status,
    sentCount: row.sentcount,
    sentDate: row.sentdate,
    openRate: Number(row.openrate),
    createdAt: row.createdat,
  };
};

const getAll = async () => {
  const result = await query('SELECT * FROM campaigns ORDER BY createdat DESC');
  return result.rows.map(normalizeCampaign);
};

const getById = async (id) => {
  const result = await query('SELECT * FROM campaigns WHERE id = $1 LIMIT 1', [id]);
  return normalizeCampaign(result.rows[0]);
};

const create = async (data) => {
  const result = await query(
    `INSERT INTO campaigns (campaignname, segment, channels, message, scheduletype, status, sentcount, sentdate, openrate)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      data.campaignName,
      data.segment,
      JSON.stringify(data.channels || []),
      data.message || null,
      data.scheduleType || 'Send Now',
      data.status || 'Draft',
      data.sentCount ?? 0,
      data.sentDate || null,
      data.openRate ?? 0,
    ],
  );
  return normalizeCampaign(result.rows[0]);
};

const update = async (id, fields) => {
  const columnMap = {
    campaignName: 'campaignname',
    segment: 'segment',
    channels: 'channels',
    message: 'message',
    scheduleType: 'scheduletype',
    status: 'status',
    sentCount: 'sentcount',
    sentDate: 'sentdate',
    openRate: 'openrate',
  };

  const updates = [];
  const values = [];
  let index = 1;

  Object.entries(columnMap).forEach(([field, column]) => {
    if (fields[field] !== undefined) {
      updates.push(`${column} = $${index}`);
      values.push(field === 'channels' ? JSON.stringify(fields.channels || []) : fields[field]);
      index += 1;
    }
  });

  if (updates.length === 0) {
    return getById(id);
  }

  values.push(id);
  const result = await query(
    `UPDATE campaigns SET ${updates.join(', ')} WHERE id = $${index} RETURNING *`,
    values,
  );
  return normalizeCampaign(result.rows[0]);
};

const deleteById = async (id) => {
  await query('DELETE FROM campaigns WHERE id = $1', [id]);
};

const getCountByStatus = async (statuses) => {
  const result = await query(
    `SELECT COUNT(*) FROM campaigns WHERE status = ANY($1::text[])`,
    [statuses],
  );
  return parseInt(result.rows[0].count, 10);
};

const getAverageOpenRate = async () => {
  const result = await query(`
    SELECT AVG(openrate) AS averageopenrate FROM campaigns WHERE openrate IS NOT NULL
  `);
  return Number(result.rows[0].averageopenrate ?? 0);
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteById,
  getCountByStatus,
  getAverageOpenRate,
};
""",
    'controllers/customerController.js': """const Customer = require('../models/Customer');

const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.getAll();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch customers', error: error.message });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.getById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch customer', error: error.message });
  }
};

const createCustomer = async (req, res) => {
  try {
    const { name, email, phone, city, totalOrders, totalSpend, lastPurchaseDate, segment, status } = req.body;
    const createdCustomer = await Customer.create({
      name,
      email,
      phone,
      city,
      totalOrders,
      totalSpent: totalSpend,
      lastPurchaseDate,
      segment,
      status,
    });
    res.status(201).json(createdCustomer);
  } catch (error) {
    res.status(500).json({ message: 'Unable to create customer', error: error.message });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { name, email, phone, city, totalOrders, totalSpend, lastPurchaseDate, segment, status } = req.body;
    const updatedCustomer = await Customer.update(req.params.id, {
      name,
      email,
      phone,
      city,
      totalOrders,
      totalSpent: totalSpend,
      lastPurchaseDate,
      segment,
      status,
    });

    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ message: 'Unable to update customer', error: error.message });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.getById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    await Customer.deleteById(req.params.id);
    res.json({ message: 'Customer removed' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete customer', error: error.message });
  }
};

module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
""",
    'controllers/segmentController.js': """const Segment = require('../models/Segment');

const getSegments = async (req, res) => {
  try {
    const segments = await Segment.getAll();
    res.json(segments);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch segments', error: error.message });
  }
};

const getSegmentById = async (req, res) => {
  try {
    const segment = await Segment.getById(req.params.id);
    if (!segment) {
      return res.status(404).json({ message: 'Segment not found' });
    }
    res.json(segment);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch segment', error: error.message });
  }
};

const createSegment = async (req, res) => {
  try {
    const { name, description, audienceSize, conditions, estimatedReach } = req.body;
    const createdSegment = await Segment.create({
      name,
      description: description || '',
      audienceSize: audienceSize || estimatedReach || 0,
      conditions: conditions || [],
      estimatedReach: estimatedReach || audienceSize || 0,
    });
    res.status(201).json(createdSegment);
  } catch (error) {
    res.status(500).json({ message: 'Unable to create segment', error: error.message });
  }
};

const updateSegment = async (req, res) => {
  try {
    const { name, description, audienceSize, conditions, estimatedReach } = req.body;
    const updatedSegment = await Segment.update(req.params.id, {
      name,
      description,
      audienceSize,
      conditions,
      estimatedReach,
    });

    if (!updatedSegment) {
      return res.status(404).json({ message: 'Segment not found' });
    }

    res.json(updatedSegment);
  } catch (error) {
    res.status(500).json({ message: 'Unable to update segment', error: error.message });
  }
};

const deleteSegment = async (req, res) => {
  try {
    const segment = await Segment.getById(req.params.id);
    if (!segment) {
      return res.status(404).json({ message: 'Segment not found' });
    }

    await Segment.deleteById(req.params.id);
    res.json({ message: 'Segment removed' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete segment', error: error.message });
  }
};

module.exports = {
  getSegments,
  getSegmentById,
  createSegment,
  updateSegment,
  deleteSegment,
};
""",
    'controllers/campaignController.js': """const Campaign = require('../models/Campaign');
const Customer = require('../models/Customer');
const Segment = require('../models/Segment');
const { sendBulkEmail } = require('../emailService');

const getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.getAll();
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch campaigns', error: error.message });
  }
};

const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.getById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch campaign', error: error.message });
  }
};

const createCampaign = async (req, res) => {
  try {
    const { campaignName, segment, channels, message, scheduleType, status, sentCount, openRate } = req.body;
    const createdCampaign = await Campaign.create({
      campaignName,
      segment,
      channels: Array.isArray(channels) ? channels : [],
      message,
      scheduleType,
      status,
      sentCount: sentCount ?? 0,
      openRate: openRate ?? 0,
    });
    res.status(201).json(createdCampaign);
  } catch (error) {
    res.status(500).json({ message: 'Unable to create campaign', error: error.message });
  }
};

const sendEmailCampaign = async (req, res) => {
  try {
    const { campaignName, message, segment } = req.body;

    if (!campaignName || !message || !segment) {
      return res.status(400).json({ success: false, message: 'campaignName, message, and segment are required' });
    }

    const safeSegment = (segment || '').trim();
    const segmentDoc = await Segment.getByName(safeSegment);

    let customers = [];

    const evaluateCondition = (customer, conditionStr) => {
      const lower = conditionStr.toLowerCase();

      if (lower.includes('city')) {
        const match = conditionStr.match(/city\s+(?:is|contains)?\s*(.*)/i);
        const cityVal = match ? match[1].trim().toLowerCase() : '';
        return (customer.city || '').toLowerCase().includes(cityVal);
      }

      if (lower.includes('total spend') || lower.includes('totalspend') || lower.includes('spend')) {
        const numMatch = conditionStr.match(/[\d,]+/);
        const amount = numMatch ? parseInt((numMatch[0] || '').replace(/,/g, ''), 10) : 0;
        const custSpend = customer.totalSpent || 0;
        if (lower.includes('greater') || lower.includes('more') || lower.includes('over') || lower.includes('>')) return custSpend > amount;
        if (lower.includes('less') || lower.includes('<')) return custSpend < amount;
        return custSpend === amount;
      }

      if (lower.includes('order') || lower.includes('purchase') || lower.includes('order count')) {
        const numMatch = conditionStr.match(/(\d+)/);
        const count = numMatch ? parseInt(numMatch[1], 10) : 0;
        const custOrders = customer.totalOrders || 0;
        if (lower.includes('greater')) return custOrders > count;
        if (lower.includes('less')) return custOrders < count;
        return custOrders === count;
      }

      if (lower.includes('last purchase') || lower.includes('in last')) {
        const daysMatch = conditionStr.match(/(\d+)\s*days?/i);
        const days = daysMatch ? parseInt(daysMatch[1], 10) : 0;
        if (!customer.lastPurchaseDate) return false;
        const last = new Date(customer.lastPurchaseDate);
        const daysAgo = Math.floor((Date.now() - last.getTime()) / (1000 * 60 * 60 * 24));
        if (lower.includes('in last')) return daysAgo <= days;
        if (lower.includes('greater')) return daysAgo > days;
        return false;
      }

      return true;
    };

    if (segmentDoc && Array.isArray(segmentDoc.conditions) && segmentDoc.conditions.length > 0) {
      const allCustomers = await Customer.findAllWithEmails();
      customers = allCustomers.filter(cust => segmentDoc.conditions.every(cond => evaluateCondition(cust, cond)));
    }

    if (!customers || customers.length === 0) {
      customers = await Customer.findBySegmentExact(safeSegment);
      if (!customers || customers.length === 0) {
        customers = await Customer.findBySegmentPartial(safeSegment);
      }
    }

    if (!customers || customers.length === 0) {
      return res.status(404).json({ success: false, message: 'No customers found for segment', matched: 0 });
    }

    const { sentCount, errors } = await sendBulkEmail({
      campaignName,
      messageTemplate: message,
      customers,
      segment,
    });

    await Campaign.create({
      campaignName,
      segment,
      channels: ['Email'],
      message,
      status: sentCount > 0 ? 'Completed' : 'Failed',
      sentCount,
      sentDate: new Date(),
    });

    res.json({ success: true, sent: sentCount, errors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Unable to send email campaign' });
  }
};

const updateCampaign = async (req, res) => {
  try {
    const { campaignName, segment, channels, message, scheduleType, status, sentCount, openRate } = req.body;
    const updatedCampaign = await Campaign.update(req.params.id, {
      campaignName,
      segment,
      channels: Array.isArray(channels) ? channels : undefined,
      message,
      scheduleType,
      status,
      sentCount,
      openRate,
    });

    if (!updatedCampaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    res.json(updatedCampaign);
  } catch (error) {
    res.status(500).json({ message: 'Unable to update campaign', error: error.message });
  }
};

const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.getById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    await Campaign.deleteById(req.params.id);
    res.json({ message: 'Campaign removed' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete campaign', error: error.message });
  }
};

module.exports = {
  getCampaigns,
  getCampaignById,
  createCampaign,
  sendEmailCampaign,
  updateCampaign,
  deleteCampaign,
};
""",
    'controllers/analyticsController.js': """const Customer = require('../models/Customer');
const Segment = require('../models/Segment');
const Campaign = require('../models/Campaign');

const getAnalyticsSummary = async (req, res) => {
  try {
    const totalCustomers = await Customer.getCount();
    const activeSegments = await Segment.getCount();
    const campaignsSent = await Campaign.getCountByStatus(['Sent', 'Completed', 'Delivered']);
    const avgOpenRate = await Campaign.getAverageOpenRate();

    res.json({
      totalCustomers,
      activeSegments,
      campaignsSent,
      avgOpenRate: Number(avgOpenRate.toFixed(2)),
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch analytics summary', error: error.message });
  }
};

module.exports = { getAnalyticsSummary };
""",
}
for rel, content in files.items():
    path = base / rel
    path.write_text(content, encoding='utf-8')
print('wrote files')
