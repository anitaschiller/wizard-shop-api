import mongoose from 'mongoose';

const customerSchema = {
  firstName: String,
  lastName: String,
  email: String,
  gender: String,
};
const Customer = mongoose.model('ShopCustomer', customerSchema);

export default Customer;
