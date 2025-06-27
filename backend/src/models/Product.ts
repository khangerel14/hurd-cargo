import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    trackingCode: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: [
        'arrived_in_ereen',
        'shipped_to_ulaanbaatar',
        'arrived_in_ulaanbaatar',
        'action_of_devivery',
        'handed_over',
      ],
      default: 'arrived_in_ereen',
    },
    pickupType: {
      type: String,
      enum: ['pickup', 'delivery'],
      required: true,
    },
    price: { type: Number },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
