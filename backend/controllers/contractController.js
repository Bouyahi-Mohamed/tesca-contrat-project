const Contract = require('../models/Contract');
const { ALERT_WINDOW_DAYS } = require('../services/contractLifecycle');
const {
  cancelContract,
  checkRenewals,
  continueContract,
  refreshContractStatuses,
} = require('../services/renewalService');

function handleError(res, error) {
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation failed',
      errors: Object.values(error.errors).map((entry) => entry.message),
    });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid contract id' });
  }

  return res.status(500).json({ message: error.message || 'Internal server error' });
}

async function createContract(req, res) {
  try {
    const contract = await Contract.create(req.body);
    return res.status(201).json(contract);
  } catch (error) {
    return handleError(res, error);
  }
}

async function getContracts(req, res) {
  try {
    await refreshContractStatuses();
    const contracts = await Contract.find()
      .populate('userId', 'name email')
      .populate('fournisseurId', 'name contactEmail')
      .sort({ createdAt: -1 });
    return res.json(contracts);
  } catch (error) {
    return handleError(res, error);
  }
}

async function updateContract(req, res) {
  try {
    const contract = await Contract.findById(req.params.id);

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    Object.assign(contract, req.body);
    const updated = await contract.save();

    return res.json(updated);
  } catch (error) {
    return handleError(res, error);
  }
}

async function deleteContract(req, res) {
  try {
    const deleted = await Contract.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    return res.json({ message: 'Contract deleted successfully' });
  } catch (error) {
    return handleError(res, error);
  }
}

async function runRenewalCheck(req, res) {
  try {
    const result = await checkRenewals({
      daysThreshold: Number(req.query.daysThreshold) || ALERT_WINDOW_DAYS,
    });

    return res.json({
      message: 'Renewal check completed',
      ...result,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

async function continueContractAction(req, res) {
  try {
    const updated = await continueContract(req.params.id, {
      extensionMonths: Number(req.body.extensionMonths) || 12,
    });

    if (!updated) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    return res.json(updated);
  } catch (error) {
    return handleError(res, error);
  }
}

async function cancelContractAction(req, res) {
  try {
    const updated = await cancelContract(req.params.id);

    if (!updated) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    return res.json(updated);
  } catch (error) {
    return handleError(res, error);
  }
}

module.exports = {
  createContract,
  getContracts,
  updateContract,
  deleteContract,
  runRenewalCheck,
  continueContractAction,
  cancelContractAction,
};
