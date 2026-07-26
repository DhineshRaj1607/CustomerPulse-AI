const Campaign = require('../models/Campaign');
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
