const express = require('express');
const { createFournisseur, deleteFournisseur, getFournisseurs, getUsers, createUser } = require('../controllers/referenceController');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/users', requireAuth, getUsers);
router.post('/users', requireAuth, requireRole(['admin']), createUser);

router.get('/fournisseurs', requireAuth, getFournisseurs);
router.post('/fournisseurs', requireAuth, requireRole(['admin']), createFournisseur);
router.delete('/fournisseurs/:id', requireAuth, requireRole(['admin']), deleteFournisseur);

module.exports = router;
