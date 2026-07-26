const Customer = require('../models/Customer');

const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.getAll();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch customers', error: error.message });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.getById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch customer', error: error.message });
  }
};

const createCustomer = async (req, res) => {
  try {
    const { name, email, phone, city, totalOrders, totalSpend, lastPurchaseDate, segment, status } = req.body;
    const createdCustomer = await Customer.create({
      name,
      email,
      phone,
      city,
      totalOrders,
      totalSpent: totalSpend,
      lastPurchaseDate,
      segment,
      status,
    });
    res.status(201).json(createdCustomer);
  } catch (error) {
    res.status(500).json({ message: 'Unable to create customer', error: error.message });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { name, email, phone, city, totalOrders, totalSpend, lastPurchaseDate, segment, status } = req.body;
    const updatedCustomer = await Customer.update(req.params.id, {
      name,
      email,
      phone,
      city,
      totalOrders,
      totalSpent: totalSpend,
      lastPurchaseDate,
      segment,
      status,
    });

    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ message: 'Unable to update customer', error: error.message });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.getById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    await Customer.deleteById(req.params.id);
    res.json({ message: 'Customer removed' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete customer', error: error.message });
  }
};

module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
