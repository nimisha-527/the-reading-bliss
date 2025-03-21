const express = require('express');
const router = express.Router();
const { wrapAsync } = require('../utils');
const connectToCustomerController = require('../controllers/connectToCustomer');

router.post('/connectToCustomer', wrapAsync(connectToCustomerController.submitRequest));

module.exports = router;