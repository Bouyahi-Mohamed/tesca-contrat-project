const express = require('express');
const { createFournisseur, getFournisseurs, getUsers } = require('../controllers/referenceController');

const router = express.Router();

router.get('/users', getUsers);
router.get('/fournisseurs', getFournisseurs);
router.post('/fournisseurs', createFournisseur);

module.exports = router;
