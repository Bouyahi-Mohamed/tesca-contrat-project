function Modal({ title, children, onClose, widthClass = 'max-w-3xl' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <button
        type="button"
        aria-label="Close modal overlay"
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={`relative z-10 w-full ${widthClass} rounded-[2rem] border border-white/70 bg-white shadow-glow`}>
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Registry Modal</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-slate-950">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Close
          </button>
        </div>
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
