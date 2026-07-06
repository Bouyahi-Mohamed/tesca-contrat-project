import { useState } from 'react';
import PdfViewerModal from './PdfViewerModal';

function formatDate(value) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function formatPrice(value) {
  if (value == null || value === '') return '—';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
}

function formatReference(reference, fallbackLabel) {
  if (!reference) {
    return fallbackLabel;
  }

  if (typeof reference === 'string') {
    return reference;
  }

  return reference.name || reference.email || fallbackLabel;
}

function formatContractType(type) {
  switch (type) {
    case 'renewable':
      return 'CDD renewable';
    case 'active_to_terminer':
      return 'CDD';
    case 'cdi':
      return 'CDI';
    default:
      return type || '—';
  }
}

function statusStyles(status) {
  switch (status) {
    case 'active':
      return 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200';
    case 'terminer':
      return 'bg-slate-100 text-slate-700 ring-1 ring-slate-200';
    case 'en_attente':
      return 'bg-amber-100 text-amber-900 ring-1 ring-amber-200';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');

function ContractList({ contracts, user, onEdit, onDelete }) {
  const [viewingPdfContract, setViewingPdfContract] = useState(null);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-glow">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Registry</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-slate-950">Contract list</h2>
        </div>
        <p className="text-sm text-slate-500">{contracts.length} records</p>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs uppercase tracking-[0.2em] text-slate-500">
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Start</th>
                <th className="px-4 py-3 font-semibold">End</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {contracts.length === 0 ? (
                <tr>
                  <td className="px-4 py-10 text-center text-sm text-slate-500" colSpan="7">
                    No contracts yet. Use Add contract to create the first record.
                  </td>
                </tr>
              ) : (
                contracts.map((contract) => (
                  <tr key={contract._id} className="align-top hover:bg-slate-50/60">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-950">{contract.title}</div>
                      <div className="mt-1 text-xs text-slate-500">
                        User: {formatReference(contract.userId, 'Unknown user')} | Fournisseur:{' '}
                        {formatReference(contract.fournisseurId, 'Unknown supplier')}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">{formatContractType(contract.type)}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${statusStyles(contract.status)}`}
                      >
                        {contract.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">{formatDate(contract.dateDebut)}</td>
                    <td className="px-4 py-4 text-sm text-slate-700">{formatDate(contract.dateFin)}</td>
                    <td className="px-4 py-4 text-sm text-slate-700 font-medium">{formatPrice(contract.price)}</td>
                    <td className="px-4 py-4">
                      <div className="flex  gap-1">
                        {contract.documentUrl && (
                          <button
                            type="button"
                            onClick={() => setViewingPdfContract(contract)}
                            className="rounded-xl border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-50 flex items-center"
                          >
                            View
                          </button>
                        )}
                        {(user?.role === 'admin' || user?.role === 'achat') && (
                          <button
                            type="button"
                            onClick={() => onEdit(contract)}
                            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                          >
                            Edit
                          </button>
                        )}
                        {user?.role === 'admin' && (
                          <button
                            type="button"
                            onClick={() => onDelete(contract)}
                            className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-50"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {viewingPdfContract && (
        <PdfViewerModal
          pdfUrl={`${API_BASE}${viewingPdfContract.documentUrl}`}
          onClose={() => setViewingPdfContract(null)}
          onReupload={(user?.role === 'admin' || user?.role === 'achat') ? () => {
            onEdit(viewingPdfContract);
            setViewingPdfContract(null);
          } : null}
        />
      )}
    </section>
  );
}

export default ContractList;
