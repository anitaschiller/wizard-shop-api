import mongoose from 'mongoose';

const shoppingCartSchema = {
  firstName: String,
  lastName: String,
  customerId: String,
  products: Array,
  totalPrice: Number,
};
const ShoppingCart = mongoose.model('ShoppingCart', shoppingCartSchema);

export default ShoppingCart;
