import mongoose from 'mongoose';

const authDB = mongoose.createConnection(process.env.AUTH_DB_URI);
const deepfakeDB = mongoose.createConnection(process.env.DEEPFAKE_DB_URI);

export { authDB, deepfakeDB };
