const prisma = require('../config/prisma');

const normalizeSegment = (row) => {
  if (!row) return null;
  return {
    _id: String(row.id),
    name: row.name,
    description: row.description,
    audienceSize: row.audienceSize,
    conditions: row.conditions || [],
    estimatedReach: row.estimatedReach,
    createdAt: row.createdAt,
  };
};

const getAll = async () => {
  const rows = await prisma.segment.findMany({ orderBy: { createdAt: 'desc' } });
  return rows.map(normalizeSegment);
};

const getById = async (id) => {
  const row = await prisma.segment.findUnique({ where: { id: Number(id) } });
  return normalizeSegment(row);
};

const getByName = async (name) => {
  const row = await prisma.segment.findFirst({ where: { name: { equals: name, mode: 'insensitive' } } });
  return normalizeSegment(row);
};

const create = async (data) => {
  const row = await prisma.segment.create({
    data: {
      name: data.name,
      description: data.description || '',
      audienceSize: data.audienceSize ?? data.estimatedReach ?? 0,
      conditions: data.conditions || [],
      estimatedReach: data.estimatedReach ?? data.audienceSize ?? 0,
    },
  });
  return normalizeSegment(row);
};

const update = async (id, fields) => {
  const data = {};
  if (fields.name !== undefined) data.name = fields.name;
  if (fields.description !== undefined) data.description = fields.description;
  if (fields.audienceSize !== undefined) data.audienceSize = fields.audienceSize;
  if (fields.conditions !== undefined) data.conditions = fields.conditions || [];
  if (fields.estimatedReach !== undefined) data.estimatedReach = fields.estimatedReach;

  if (Object.keys(data).length === 0) {
    return getById(id);
  }

  const row = await prisma.segment.update({ where: { id: Number(id) }, data });
  return normalizeSegment(row);
};

const deleteById = async (id) => {
  await prisma.segment.delete({ where: { id: Number(id) } });
};

const getCount = async () => {
  return prisma.segment.count({ where: { audienceSize: { gt: 0 } } });
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
