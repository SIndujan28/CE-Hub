import mongoose, { Schema } from 'mongoose';

const shopSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: 'Name of the shop is required',
  },
  description: {
    type: String,
    trim: true,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

export default mongoose.model('Shop', shopSchema)
;
