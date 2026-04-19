import crypto from 'crypto';
import axios from 'axios';
import ScanResult from '../models/ScanResult.js';
import FlaggedContent from '../models/FlaggedContent.js';

const computeHash = (content) => {
  return crypto.createHash('sha256').update(content).digest('hex');
};

export const scanText = async (req, res) => {
  try {
    const content = req.body.text || '';
    const hash = computeHash(content);

    let cachedResult = await FlaggedContent.checkHash(hash);
    if (cachedResult) {
      return res.json({
        riskScore: 1.0,
        label: 'Globally blocked',
        explanation: `Flagged by Neural-Nexus network. Seen ${cachedResult.detectedCount} times.`,
        fromCache: true
      });
    }

    const response = await axios.post(`${process.env.MODEL_SERVER_URL}/infer/text`, req.body);

    if (response.data.riskScore >= 0.75) {
      await FlaggedContent.recordDetection(hash, {
        contentType: 'text',
        preview: content.substring(0, 200),
        riskScore: response.data.riskScore,
        label: response.data.label,
        explanation: response.data.explanation
      });
    }

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
    const url = req.body.url || '';
    const hash = computeHash(url);

    let cachedResult = await FlaggedContent.checkHash(hash);
    if (cachedResult) {
      return res.json({
        riskScore: 1.0,
        label: 'Globally blocked',
        explanation: `Flagged by Neural-Nexus network. Seen ${cachedResult.detectedCount} times.`,
        fromCache: true
      });
    }

    const response = await axios.post(`${process.env.MODEL_SERVER_URL}/infer/url`, req.body);

    if (response.data.riskScore >= 0.75) {
      await FlaggedContent.recordDetection(hash, {
        contentType: 'url',
        preview: url,
        riskScore: response.data.riskScore,
        label: response.data.label,
        explanation: response.data.explanation
      });
    }

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
    const audioData = req.body.audio || '';
    const hash = computeHash(audioData);

    let cachedResult = await FlaggedContent.checkHash(hash);
    if (cachedResult) {
      return res.json({
        riskScore: 1.0,
        label: 'Globally blocked',
        explanation: `Flagged by Neural-Nexus network. Seen ${cachedResult.detectedCount} times.`,
        fromCache: true
      });
    }

    const response = await axios.post(`${process.env.MODEL_SERVER_URL}/infer/audio`, req.body);

    if (response.data.riskScore >= 0.75) {
      await FlaggedContent.recordDetection(hash, {
        contentType: 'audio',
        preview: 'audio blob',
        riskScore: response.data.riskScore,
        label: response.data.label,
        explanation: response.data.explanation
      });
    }

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
