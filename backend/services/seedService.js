const User = require('../models/User');
const Fournisseur = require('../models/Fournisseur');
const Contract = require('../models/Contract');
const bcrypt = require('bcryptjs');

async function ensureSeedData() {
  const [fournisseurCount, contractCount] = await Promise.all([
    Fournisseur.estimatedDocumentCount(),
    Contract.estimatedDocumentCount(),
  ]);

  // For this RBAC rollout, we want to clear old users and insert the 3 specific ones
  await User.deleteMany({});
  const hashedPassword = await bcrypt.hash('Tesca2026!', 10);
  
  const users = await User.insertMany([
    { name: 'Tarek Ferchichi', email: 'tarek.ferchichi@tescagroup.com', password: hashedPassword, role: 'admin' },
    { name: 'Safa', email: 'safa@tescagroup.com', password: hashedPassword, role: 'achat' },
    { name: 'Bouyahi Mohamed', email: 'bouyahi.mohamed@testgoup.com', password: hashedPassword, role: 'other' }
  ]);

  let user = users[0];
  let fournisseur = await Fournisseur.findOne();

  // Re-assign orphaned contracts to the new admin user
  await Contract.updateMany(
    { userId: { $nin: users.map(u => u._id) } }, 
    { $set: { userId: user._id } }
  );

  if (fournisseurCount === 0) {
    fournisseur = await Fournisseur.create({
      name: 'Demo Supplier',
      contactEmail: 'demo.supplier@example.com',
    });
  }

  if (contractCount === 0 && user && fournisseur) {
    await Contract.create({
      title: 'Demo Service Agreement',
      type: 'renewable',
      status: 'active',
      dateDebut: new Date(),
      dateFin: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      price: 1500,
      userId: user._id,
      fournisseurId: fournisseur._id,
    });

    await Contract.create({
      title: 'Demo Employment Agreement',
      type: 'cdi',
      status: 'active',
      dateDebut: new Date(),
      dateFin: null,
      price: 2500.50,
      userId: user._id,
      fournisseurId: fournisseur._id,
    });
  }
}

module.exports = {
  ensureSeedData,
};
