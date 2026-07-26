const prisma = require('../config/prisma');

const normalizeCustomer = (row) => {
  if (!row) return null;
  return {
    _id: String(row.id),
    name: row.name,
    email: row.email,
    phone: row.phone,
    city: row.city,
    totalOrders: row.totalOrders,
    totalSpent: Number(row.totalSpent),
    lastPurchaseDate: row.lastPurchaseDate,
    segment: row.segment,
    status: row.status,
    createdAt: row.createdAt,
  };
};

const getAll = async () => {
  const rows = await prisma.customer.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return rows.map(normalizeCustomer);
};

const getById = async (id) => {
  const row = await prisma.customer.findUnique({ where: { id: Number(id) } });
  return normalizeCustomer(row);
};

const create = async (data) => {
  const row = await prisma.customer.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      city: data.city || null,
      totalOrders: data.totalOrders ?? 0,
      totalSpent: data.totalSpent ?? 0,
      lastPurchaseDate: data.lastPurchaseDate ? new Date(data.lastPurchaseDate) : null,
      segment: data.segment || null,
      status: data.status || 'active',
    },
  });
  return normalizeCustomer(row);
};

const update = async (id, fields) => {
  const data = {};
  if (fields.name !== undefined) data.name = fields.name;
  if (fields.email !== undefined) data.email = fields.email;
  if (fields.phone !== undefined) data.phone = fields.phone;
  if (fields.city !== undefined) data.city = fields.city;
  if (fields.totalOrders !== undefined) data.totalOrders = fields.totalOrders;
  if (fields.totalSpent !== undefined) data.totalSpent = fields.totalSpent;
  if (fields.lastPurchaseDate !== undefined) data.lastPurchaseDate = fields.lastPurchaseDate ? new Date(fields.lastPurchaseDate) : null;
  if (fields.segment !== undefined) data.segment = fields.segment;
  if (fields.status !== undefined) data.status = fields.status;

  if (Object.keys(data).length === 0) {
    return getById(id);
  }

  const row = await prisma.customer.update({ where: { id: Number(id) }, data });
  return normalizeCustomer(row);
};

const deleteById = async (id) => {
  await prisma.customer.delete({ where: { id: Number(id) } });
};

const getCount = async () => {
  return prisma.customer.count();
};

const findAllWithEmails = async () => {
  const rows = await prisma.customer.findMany({
    where: { email: { not: '' } },
    orderBy: { createdAt: 'desc' },
  });
  return rows.map(normalizeCustomer);
};

const findBySegmentExact = async (segment) => {
  const rows = await prisma.customer.findMany({
    where: {
      segment: segment,
      email: { not: '' },
    },
    orderBy: { createdAt: 'desc' },
  });
  return rows.map(normalizeCustomer);
};

const findBySegmentPartial = async (segment) => {
  const rows = await prisma.customer.findMany({
    where: {
      segment: { contains: segment, mode: 'insensitive' },
      email: { not: '' },
    },
    orderBy: { createdAt: 'desc' },
  });
  return rows.map(normalizeCustomer);
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
