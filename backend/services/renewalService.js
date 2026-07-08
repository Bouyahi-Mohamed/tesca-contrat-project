const Contract = require('../models/Contract');
const { ALERT_WINDOW_DAYS, getLifecycleStatus, normalizeContractType } = require('./contractLifecycle');

function addMonths(date, months) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

async function refreshContractStatuses({ referenceDate = new Date(), alertWindowDays = ALERT_WINDOW_DAYS } = {}) {
  const contracts = await Contract.find();

  if (contracts.length === 0) {
    return { matched: 0, updated: 0, contracts: [] };
  }

  let updated = 0;

  for (const contract of contracts) {
    const nextStatus = getLifecycleStatus(contract, referenceDate, alertWindowDays);

    if (contract.status !== nextStatus) {
      contract.status = nextStatus;
      await contract.save();
      updated += 1;
    }
  }

  const refreshedContracts = await Contract.find().lean();
  return { matched: contracts.length, updated, contracts: refreshedContracts };
}

async function checkRenewals({ daysThreshold = ALERT_WINDOW_DAYS } = {}) {
  return refreshContractStatuses({ alertWindowDays: daysThreshold });
}

async function continueContract(contractId, { extensionMonths = 12 } = {}) {
  const contract = await Contract.findById(contractId);

  if (!contract) {
    return null;
  }

  if (normalizeContractType(contract.type) !== 'renewable') {
    throw new Error('Only renewable contracts can be continued');
  }

  const currentEndDate = contract.dateFin || new Date();
  contract.status = 'active';
  contract.dateFin = addMonths(currentEndDate, extensionMonths);
  await contract.save();

  return contract.toObject();
}

async function cancelContract(contractId) {
  const contract = await Contract.findById(contractId);

  if (!contract) {
    return null;
  }

  // User chose not to renew, so it becomes a standard non-renewable CDD.
  contract.type = 'active_to_terminer';
  contract.status = getLifecycleStatus(contract);
  await contract.save();

  return contract.toObject();
}

function startRenewalMonitor({ intervalMs = 3600000, daysThreshold = ALERT_WINDOW_DAYS } = {}) {
  if (intervalMs <= 0) {
    return null;
  }

  const runCheck = () => {
    refreshContractStatuses({ alertWindowDays: daysThreshold }).catch((error) => {
      console.error('Renewal monitor failed:', error.message);
    });
  };

  runCheck();
  return setInterval(runCheck, intervalMs);
}

module.exports = {
  checkRenewals,
  refreshContractStatuses,
  continueContract,
  cancelContract,
  startRenewalMonitor,
};
