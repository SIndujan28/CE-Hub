import mongoose, { Schema } from 'mongoose';

const cartItemSchema = new Schema({
  product: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Product',
  },
  quantity: Number,
  shop: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Shop',
  },
  status: {
    type: String,
    default: 'Not processed',
    enum: ['Not processed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
  },
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

const orderSchema = new Schema({
  products: [cartItemSchema],
  customer_name: {
    type: String,
    trim: true,
    required: 'Name is required',
  },
  customer_email: {
    type: String,
    trim: true,
    required: 'Email is required',
  },
  delivery_address: {
    street: { type: String, required: 'Street is required' },
    city: { type: String, required: 'City is required' },
    state: { type: String },
    zipcode: { type: String, required: 'Zip Code is required' },
    country: { type: String, required: 'Country is required' },
  },
  payment_id: {},
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
  },
});

const Order = mongoose.model('Order', orderSchema);

export { CartItem, Order };
