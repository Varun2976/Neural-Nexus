import { authDB } from '../db.js';

const userSchema = new authDB.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  passwordHash: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = authDB.model('User', userSchema);

export default User;
