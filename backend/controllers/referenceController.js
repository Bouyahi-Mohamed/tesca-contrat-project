const User = require('../models/User');
const Fournisseur = require('../models/Fournisseur');
const bcrypt = require('bcryptjs');

async function getUsers(req, res) {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to load users' });
  }
}

async function getFournisseurs(req, res) {
  try {
    const fournisseurs = await Fournisseur.find().sort({ createdAt: -1 });
    return res.json(fournisseurs);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to load suppliers' });
  }
}

async function createFournisseur(req, res) {
  try {
    const fournisseur = await Fournisseur.create(req.body);
    return res.status(201).json(fournisseur);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation failed',
        errors: Object.values(error.errors).map((entry) => entry.message),
      });
    }

    return res.status(500).json({ message: error.message || 'Failed to create supplier' });
  }
}

async function createUser(req, res) {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });
    
    const userObject = user.toObject();
    delete userObject.password;
    return res.status(201).json(userObject);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation failed',
        errors: Object.values(error.errors).map((entry) => entry.message),
      });
    }
    return res.status(500).json({ message: error.message || 'Failed to create user' });
  }
}

async function deleteFournisseur(req, res) {
  try {
    const deleted = await Fournisseur.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    return res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to delete supplier' });
  }
}

module.exports = {
  getUsers,
  getFournisseurs,
  createFournisseur,
  deleteFournisseur,
  createUser,
};
