// models/User.ts or models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['user', 'admin'], // You can customize roles
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
