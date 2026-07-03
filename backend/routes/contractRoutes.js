const express = require('express');
const {
  cancelContractAction,
  continueContractAction,
  createContract,
  deleteContract,
  getContracts,
  runRenewalCheck,
  updateContract,
} = require('../controllers/contractController');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/', upload.single('document'), createContract);
router.get('/', getContracts);
router.put('/:id', upload.single('document'), updateContract);
router.delete('/:id', deleteContract);
router.post('/check-renewals', runRenewalCheck);
router.put('/:id/continue', continueContractAction);
router.put('/:id/cancel', cancelContractAction);

module.exports = router;
