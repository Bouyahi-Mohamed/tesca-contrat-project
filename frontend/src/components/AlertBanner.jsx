function AlertBanner({ contracts, onContinue, onCancel, busyAction }) {
  if (!contracts || contracts.length === 0) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-glow">
      <h2 className="mb-4 font-display text-xl font-bold text-amber-900">Contract Expiring Alerts</h2>
      <div className="flex flex-col gap-4">
        {contracts.map((contract) => (
          <div key={contract._id} className="flex flex-col md:flex-row md:items-center justify-between rounded-xl bg-white p-4 shadow-sm border border-amber-100 gap-4">
            <div>
              <span className="font-semibold text-amber-900">Contract Expiring: Do you want to continue?</span>
              <span className="ml-2 text-sm text-slate-600">- <span className="font-semibold">{contract.title}</span> is marked as en_attente.</span>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onContinue(contract)}
                disabled={busyAction === `continue-${contract._id}`}
                className="rounded-lg bg-slate-950 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busyAction === `continue-${contract._id}` ? 'Continuing...' : 'Yes, Continue'}
              </button>
              <button
                type="button"
                onClick={() => onCancel(contract)}
                disabled={busyAction === `cancel-${contract._id}`}
                className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-sm font-semibold text-amber-800 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busyAction === `cancel-${contract._id}` ? 'Cancelling...' : 'No, Cancel'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AlertBanner;
