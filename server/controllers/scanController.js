import axios from 'axios';
import ScanResult from '../models/ScanResult.js';

export const scanText = async (req, res) => {
  try {
    const response = await axios.post(`${process.env.MODEL_SERVER_URL}/infer/text`, req.body);

    const scanResult = new ScanResult({
      type: 'text',
      riskScore: response.data.riskScore,
      label: response.data.label,
      explanation: response.data.explanation,
      ...req.body
    });

    const saved = await scanResult.save();
    res.json(saved);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const scanUrl = async (req, res) => {
  try {
    const response = await axios.post(`${process.env.MODEL_SERVER_URL}/infer/url`, req.body);

    const scanResult = new ScanResult({
      type: 'url',
      riskScore: response.data.riskScore,
      label: response.data.label,
      explanation: response.data.explanation,
      ...req.body
    });

    const saved = await scanResult.save();
    res.json(saved);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const scanAudio = async (req, res) => {
  try {
    const response = await axios.post(`${process.env.MODEL_SERVER_URL}/infer/audio`, req.body);

    const scanResult = new ScanResult({
      type: 'audio',
      riskScore: response.data.riskScore,
      label: response.data.label,
      explanation: response.data.explanation,
      ...req.body
    });

    const saved = await scanResult.save();
    res.json(saved);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
