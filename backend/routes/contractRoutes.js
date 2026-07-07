const express = require('express');
const {
  cancelContractAction,
  continueContractAction,
  createContract,
  deleteContract,
  getContracts,
  runRenewalCheck,
  updateContract,
  validateContractAction,
  rejectContractAction,
  getNotificationsAction,
} = require('../controllers/contractController');
const upload = require('../middleware/upload');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, getContracts);
router.post('/', requireAuth, requireRole(['admin', 'achat']), upload.single('document'), createContract);
router.put('/:id', requireAuth, requireRole(['admin', 'achat']), upload.single('document'), updateContract);
router.delete('/:id', requireAuth, requireRole(['admin']), deleteContract);
router.post('/check-renewals', requireAuth, runRenewalCheck);
router.put('/:id/continue', requireAuth, requireRole(['admin', 'achat']), continueContractAction);
router.put('/:id/cancel', requireAuth, requireRole(['admin', 'achat']), cancelContractAction);

router.get('/notifications', requireAuth, requireRole(['admin']), getNotificationsAction);
router.put('/:id/validate', requireAuth, requireRole(['admin']), validateContractAction);
router.put('/:id/reject', requireAuth, requireRole(['admin']), rejectContractAction);

module.exports = router;
