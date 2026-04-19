import mongoose from 'mongoose';
import { deepfakeDB } from '../db.js';

const flaggedContentSchema = new mongoose.Schema({
  contentHash: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  contentType: {
    type: String,
    enum: ['url', 'audio', 'text']
  },
  preview: String,
  riskScore: {
    type: Number,
    min: 0,
    max: 1
  },
  label: String,
  explanation: String,
  detectedCount: {
    type: Number,
    default: 1
  },
  firstSeenAt: {
    type: Date,
    default: Date.now
  },
  lastSeenAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

flaggedContentSchema.statics.checkHash = async function(hash) {
  const doc = await this.findOne({ contentHash: hash });
  return doc && doc.isActive ? doc : null;
};

flaggedContentSchema.statics.recordDetection = async function(hash, data) {
  const existing = await this.findOne({ contentHash: hash });

  if (existing) {
    existing.detectedCount += 1;
    existing.lastSeenAt = new Date();
    return existing.save();
  } else {
    return this.create({
      contentHash: hash,
      contentType: data.contentType,
      preview: data.preview,
      riskScore: data.riskScore,
      label: data.label,
      explanation: data.explanation,
      detectedCount: 1,
      firstSeenAt: new Date(),
      lastSeenAt: new Date(),
      isActive: true
    });
  }
};

const FlaggedContent = deepfakeDB.model('FlaggedContent', flaggedContentSchema);

export default FlaggedContent;
