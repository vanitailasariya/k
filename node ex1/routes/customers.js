const Joi = require('@hapi/joi')
const express = require('express');
const mongoose  = require('mongoose');
const router = express.Router();

const Customer = mongoose.model('Customer', new mongoose.Schema({
    FirstName: {
      type: String,
      required : true,
      minlength: 3,
      maxlength: 25
    },
    LastName: {
        type: String,
        required : true,
        minlength: 3,
        maxlength: 25
    }   
}));



router.get('/', async(req, res) => {
    const customers = await Customer.find().sort('FirstName');
    res.send(customers);
});
  
  router.post('/', async (req, res) => {
    const { error } = validateCustomer(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    let customer = new Customer(
        {
            FirstName:req.body.FirstName, 
            LastName: req.body.LastName});
        customer = await customer.save();
        res.send(customer);
  });
  
  router.get('/:id', async(req, res) => {
      const customer = await Customer.findById(req.params.id);

      if (!customer) return res.status(404).send('The customer with the given ID was not found.');
      res.send(customer);
    });
    
    function validateCustomer(customer) {
      const schema = {
        FirstName: Joi.string().min(3).required(),
        LastName: Joi.string().min(3).required()
      };
    
      return Joi.validate(customer, schema);
    }

    module.exports = router;
    
