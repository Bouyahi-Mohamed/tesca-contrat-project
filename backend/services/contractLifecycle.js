const ALERT_WINDOW_DAYS = 15;

function normalizeContractType(type) {
  switch (type) {
    case 'renove':
    case 'renewable':
      return 'renewable';
    case 'permanente':
    case 'active_to_terminer':
      return 'active_to_terminer';
    case 'cdi':
      return 'cdi';
    default:
      return type;
  }
}

function toDateKey(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString().slice(0, 10);
}

function getLifecycleStatus(contract, referenceDate = new Date(), alertWindowDays = ALERT_WINDOW_DAYS) {
  const contractType = normalizeContractType(contract?.type);

  if (!contract) {
    return 'active';
  }

  if (contractType === 'cdi') {
    return 'active';
  }

  const endDateKey = toDateKey(contract.dateFin);
  if (!endDateKey) {
    return 'active';
  }

  const todayKey = toDateKey(referenceDate);
  const alertDate = new Date(referenceDate);
  alertDate.setDate(alertDate.getDate() + alertWindowDays);
  const alertDateKey = toDateKey(alertDate);

  if (endDateKey < todayKey) {
    return 'terminer';
  }

  if (contractType === 'renewable' && endDateKey <= alertDateKey) {
    return 'en_attente';
  }

  return 'active';
}

module.exports = {
  ALERT_WINDOW_DAYS,
  getLifecycleStatus,
  normalizeContractType,
  toDateKey,
};