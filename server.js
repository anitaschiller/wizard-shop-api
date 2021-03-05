import express, { request, response } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import Product from './models/product.models.js';
import Customer from './models/customer.models.js';
import ShoppingCart from './models/shoppingCart.models.js';

const connectionString = 'mongodb://localhost:27017/products';

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const server = express();

server.use(bodyParser.json());

server.get('/', (request, response) => {
  response.json({ status: 'Server is up and running' });
});

//PRODUCTS

server.get('/products', (request, response) => {
  Product.find().then((products) =>
    response.json(products.length ? products : 'No products available')
  );
});

server.get('/products/:productId', (request, response) => {
  const productId = request.params.productId;

  Product.findById(productId)
    .then((product) => response.json(product))
    .catch(() =>
      response.json(`The product with ID ${productId} is not available`)
    );
});

server.post('/products', (request, response) => {
  const newProduct = new Product({
    name: request.body.name,
    category: request.body.category,
    price: request.body.price,
  });

  if (newProduct.name && newProduct.category && newProduct.price) {
    newProduct
      .save()
      .then((product) =>
        response.json(`The product ${product.name} has been added.`)
      )
      .catch((error) => response.json(error));
  } else {
    response.json('Please fill out all properties');
  }
});

//CUSTOMERS

server.get('/customers', (request, response) => {
  Customer.find().then((customers) =>
    response.json(
      customers.length
        ? customers
        : 'There are no registered customers at the moment'
    )
  );
});

server.get('/customers/:customerId', (request, response) => {
  const customerId = request.params.customerId;

  Customer.findById(customerId)
    .then((customer) => response.json(customer))
    .catch(() =>
      response.json(`The customer with ID ${customerId} is not available`)
    );
});

server.post('/customers', (request, response) => {
  const newCustomer = new Customer({
    firstName: request.body.firstName,
    lastName: request.body.lastName,
    email: request.body.email,
    gender: request.body.gender,
  });

  if (
    newCustomer.firstName &&
    newCustomer.lastName &&
    newCustomer.email &&
    newCustomer.gender
  ) {
    newCustomer
      .save()
      .then((customer) =>
        response.json(
          `Welcome, ${newCustomer.gender === 'female' ? 'Mrs' : 'Mr'} ${
            customer.firstName
          } ${customer.lastName}. Your registration was successful.`
        )
      )
      .catch((error) => response.json(error));
  } else {
    response.json('Please fill out all properties');
  }
});

// SHOPPING CART

server.get('/shopping-cart/:customerId', (request, response) => {
  const customerId = request.params.customerId;

  ShoppingCart.find({ customerId })
    .then((shoppingCart) =>
      response.json(
        shoppingCart
          ? shoppingCart
          : `The customer with the ID ${customerId} has no shopping cart`
      )
    )
    .catch(() =>
      response.json(`The customer with the ID ${customerId} is not available`)
    );
});

server.post('/shopping-cart/:customerId', (request, response) => {
  const customerId = request.params.customerId;
  Customer.findById(customerId)
    .then((customer) => {
      const newShoppingCart = new ShoppingCart({
        firstName: customer.firstName,
        lastName: customer.lastName,
        customerId: customer._id,
        products: [],
        totalPrice: 0,
      });

      newShoppingCart
        .save()
        .then((shoppingCart) => response.json(shoppingCart));
    })
    .catch(() =>
      response.json(`The customer with the ID ${customerId} is not available`)
    );
});

server.listen(4000, () => console.log('Server started'));
