const { query } = require('../config/db');

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
