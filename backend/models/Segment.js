const { query } = require('../config/db');

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
