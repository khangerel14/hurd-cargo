// models/User.ts
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  name: { type: String, required: true },
});

export default mongoose.model('User', userSchema);
