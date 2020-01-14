import mongoose, { Schema } from 'mongoose';

const productSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: 'Name of the product is required',
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  description: {
    type: String,
    trim: true,
  },
  quantity: {
    type: Number,
    required: 'Total quantity of the product is required',
  },
  price: {
    type: Number,
    required: 'Price of the product is required',
  },
  category: {
    type: String,
  },
  shop: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Shop',
  },
}, { timestamps: true });

export default mongoose.model('Product', productSchema)
;
