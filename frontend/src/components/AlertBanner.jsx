function AlertBanner({ contract, onContinue, onCancel, busyAction }) {
  if (!contract) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-amber-200 bg-amber-50/90 p-5 shadow-glow backdrop-blur-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">
            Contract Expiring
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-slate-950 md:text-3xl">
            Contract Expiring: Do you want to continue?
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-700">
            <span className="font-semibold text-slate-900">{contract.title}</span> is marked as{' '}
            <span className="font-semibold">en_attente</span> and needs a renewal decision.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => onContinue(contract)}
            disabled={busyAction === 'continue'}
            className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busyAction === 'continue' ? 'Continuing...' : 'Yes, Continue'}
          </button>
          <button
            type="button"
            onClick={() => onCancel(contract)}
            disabled={busyAction === 'cancel'}
            className="inline-flex items-center justify-center rounded-2xl border border-amber-300 bg-white px-5 py-3 text-sm font-semibold text-amber-800 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busyAction === 'cancel' ? 'Cancelling...' : 'No, Cancel'}
          </button>
        </div>
      </div>
    </section>
  );
}

export default AlertBanner;
