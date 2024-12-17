const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    minlength: [3, 'Product name must be at least 3 characters long'],
    maxlength: [255, 'Product name cannot exceed 255 characters'],
    required: [true, 'Product name is required']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative'],
    default: 0
  },
  image_url: {
    type: String
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  tags: [{
    type: Schema.Types.ObjectId,
    ref: 'Tag'
  }]
}, { timestamps: true });

module.exports = model('Product', productSchema, 'products');