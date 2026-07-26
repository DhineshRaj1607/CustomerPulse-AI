const { query } = require('../config/db');

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
