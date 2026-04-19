import mongoose from 'mongoose';
import { deepfakeDB } from '../db.js';

const scanResultSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['text', 'url', 'audio', 'image'],
      required: true
    },
    source: {
      type: String,
      default: 'unknown'
    },
    msgId: String,
    inputRef: String,
    riskScore: {
      type: Number,
      min: 0,
      max: 1,
      required: true
    },
    label: String,
    explanation: String,
    userVerdict: {
      type: String,
      enum: ['confirmed', 'safe', null],
      default: null
    }
  },
  { timestamps: true }
);

const ScanResult = deepfakeDB.model('ScanResult', scanResultSchema);

export default ScanResult;
