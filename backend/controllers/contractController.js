const Contract = require('../models/Contract');
const Notification = require('../models/Notification');
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
    const contractData = { ...req.body };
    if (req.file) {
      contractData.documentUrl = `/uploads/${req.file.filename}`;
    }
    if (req.user && req.user.role === 'achat') {
      contractData.verificationStatus = 'pending_validation';
    } else {
      contractData.verificationStatus = 'verified';
    }

    const contract = await Contract.create(contractData);

    if (contract.verificationStatus === 'pending_validation') {
      await Notification.create({
        message: 'Nouveau contrat à valider',
        contractId: contract._id
      });
    }

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

    const updateData = { ...req.body };
    if (req.file) {
      updateData.documentUrl = `/uploads/${req.file.filename}`;
    }

    if (req.user && req.user.role === 'achat') {
      updateData.verificationStatus = 'pending_validation';
    } else if (req.user && req.user.role === 'admin') {
      updateData.verificationStatus = 'verified';
    }

    Object.assign(contract, updateData);
    const updated = await contract.save();

    if (updated.verificationStatus === 'pending_validation') {
      await Notification.create({
        message: 'Contrat mis à jour à valider',
        contractId: updated._id
      });
    }

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

async function validateContractAction(req, res) {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) return res.status(404).json({ message: 'Contract not found' });
    
    contract.verificationStatus = 'verified';
    contract.adminApprovalDate = new Date();
    contract.adminWhoValidated = req.user._id;
    contract.validationHistory.push({
      status: 'verified',
      admin: req.user._id,
      date: new Date()
    });
    const updated = await contract.save();
    
    await Notification.updateMany({ contractId: contract._id }, { read: true });
    
    return res.json(updated);
  } catch (error) {
    return handleError(res, error);
  }
}

async function rejectContractAction(req, res) {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) return res.status(404).json({ message: 'Contract not found' });
    
    contract.verificationStatus = 'unverified';
    contract.adminApprovalDate = new Date();
    contract.adminWhoValidated = req.user._id;
    contract.validationHistory.push({
      status: 'unverified',
      admin: req.user._id,
      date: new Date()
    });
    const updated = await contract.save();
    
    await Notification.updateMany({ contractId: contract._id }, { read: true });
    
    return res.json(updated);
  } catch (error) {
    return handleError(res, error);
  }
}

async function getNotificationsAction(req, res) {
  try {
    const notifications = await Notification.find({ read: false, forRole: req.user.role })
      .populate('contractId')
      .sort({ createdAt: -1 });
    return res.json(notifications);
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
  validateContractAction,
  rejectContractAction,
  getNotificationsAction,
};
