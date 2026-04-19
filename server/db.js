import mongoose from 'mongoose';

const connectionOptions = {
  // Required for Node.js v24+ with MongoDB Atlas
  tls: true,
  tlsAllowInvalidCertificates: true,
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,
};

const authDB = mongoose.createConnection(process.env.AUTH_DB_URI, connectionOptions);
const deepfakeDB = mongoose.createConnection(process.env.DEEPFAKE_DB_URI, connectionOptions);

export { authDB, deepfakeDB };
