const User = require('../models/User');
const Fournisseur = require('../models/Fournisseur');

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

module.exports = {
  getUsers,
  getFournisseurs,
  createFournisseur,
};
