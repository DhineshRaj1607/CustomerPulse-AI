const Segment = require('../models/Segment');

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
