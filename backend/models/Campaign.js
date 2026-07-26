const prisma = require('../config/prisma');

const normalizeCampaign = (row) => {
  if (!row) return null;
  return {
    _id: String(row.id),
    campaignName: row.campaignName,
    segment: row.segment,
    channels: row.channels || [],
    message: row.message,
    scheduleType: row.scheduleType,
    status: row.status,
    sentCount: row.sentCount,
    sentDate: row.sentDate,
    openRate: Number(row.openRate),
    createdAt: row.createdAt,
  };
};

const getAll = async () => {
  const rows = await prisma.campaign.findMany({ orderBy: { createdAt: 'desc' } });
  return rows.map(normalizeCampaign);
};

const getById = async (id) => {
  const row = await prisma.campaign.findUnique({ where: { id: Number(id) } });
  return normalizeCampaign(row);
};

const create = async (data) => {
  const row = await prisma.campaign.create({
    data: {
      campaignName: data.campaignName,
      segment: data.segment,
      channels: data.channels || [],
      message: data.message || null,
      scheduleType: data.scheduleType || 'Send Now',
      status: data.status || 'Draft',
      sentCount: data.sentCount ?? 0,
      sentDate: data.sentDate ? new Date(data.sentDate) : null,
      openRate: data.openRate ?? 0,
    },
  });
  return normalizeCampaign(row);
};

const update = async (id, fields) => {
  const data = {};
  if (fields.campaignName !== undefined) data.campaignName = fields.campaignName;
  if (fields.segment !== undefined) data.segment = fields.segment;
  if (fields.channels !== undefined) data.channels = fields.channels || [];
  if (fields.message !== undefined) data.message = fields.message;
  if (fields.scheduleType !== undefined) data.scheduleType = fields.scheduleType;
  if (fields.status !== undefined) data.status = fields.status;
  if (fields.sentCount !== undefined) data.sentCount = fields.sentCount;
  if (fields.sentDate !== undefined) data.sentDate = fields.sentDate ? new Date(fields.sentDate) : null;
  if (fields.openRate !== undefined) data.openRate = fields.openRate;

  if (Object.keys(data).length === 0) {
    return getById(id);
  }

  const row = await prisma.campaign.update({ where: { id: Number(id) }, data });
  return normalizeCampaign(row);
};

const deleteById = async (id) => {
  await prisma.campaign.delete({ where: { id: Number(id) } });
};

const getCountByStatus = async (statuses) => {
  return prisma.campaign.count({ where: { status: { in: statuses } } });
};

const getAverageOpenRate = async () => {
  const result = await prisma.campaign.aggregate({
    _avg: { openRate: true },
  });
  return Number(result._avg.openRate ?? 0);
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
