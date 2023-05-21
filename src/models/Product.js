const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    hash: {
      required: true,
      type: String,
    },
    name: {
      required: true,
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    transerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    origin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    destination: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    logs: [
      {
        origin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        destination: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        date: { type: Date },
      },
    ],
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', schema);
module.exports = Product;
