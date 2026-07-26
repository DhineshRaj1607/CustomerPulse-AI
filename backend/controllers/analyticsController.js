const Customer = require('../models/Customer');
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
