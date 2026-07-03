const User = require('../models/User');
const Fournisseur = require('../models/Fournisseur');
const Contract = require('../models/Contract');

async function ensureSeedData() {
  const [userCount, fournisseurCount, contractCount] = await Promise.all([
    User.estimatedDocumentCount(),
    Fournisseur.estimatedDocumentCount(),
    Contract.estimatedDocumentCount(),
  ]);

  let user = await User.findOne();
  let fournisseur = await Fournisseur.findOne();

  if (userCount === 0) {
    user = await User.create({
      name: 'Demo User',
      email: 'demo.user@example.com',
    });
  }

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
      userId: user._id,
      fournisseurId: fournisseur._id,
    });

    await Contract.create({
      title: 'Demo Employment Agreement',
      type: 'cdi',
      status: 'active',
      dateDebut: new Date(),
      dateFin: null,
      userId: user._id,
      fournisseurId: fournisseur._id,
    });
  }
}

module.exports = {
  ensureSeedData,
};
