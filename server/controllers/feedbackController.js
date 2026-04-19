import ScanResult from '../models/ScanResult.js';

export const submitFeedback = async (req, res) => {
  try {
    const { scanId, userVerdict } = req.body;

    const updated = await ScanResult.findByIdAndUpdate(
      scanId,
      { userVerdict },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
