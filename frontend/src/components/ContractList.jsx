import { useState, useMemo } from 'react';
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

function verificationStyles(status) {
  switch (status) {
    case 'verified':
      return 'bg-blue-100 text-blue-800 ring-1 ring-blue-200';
    case 'unverified':
      return 'bg-red-100 text-red-800 ring-1 ring-red-200';
    case 'pending_validation':
      return 'bg-purple-100 text-purple-800 ring-1 ring-purple-200';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');

function ContractList({ contracts, user, onEdit, onDelete }) {
  const [viewingPdfContract, setViewingPdfContract] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterValidation, setFilterValidation] = useState('');
  const [filterDateDebut, setFilterDateDebut] = useState('');
  const [filterDateFin, setFilterDateFin] = useState('');

  const filteredContracts = useMemo(() => {
    return contracts.filter((contract) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const titleMatch = contract.title?.toLowerCase().includes(query);
        const userMatch = (contract.userId?.name || contract.userId?.email || '').toLowerCase().includes(query);
        const supplierMatch = (contract.fournisseurId?.name || contract.fournisseurId?.email || '').toLowerCase().includes(query);
        if (!titleMatch && !userMatch && !supplierMatch) return false;
      }

      if (showAdvanced) {
        if (filterStatus && contract.status !== filterStatus) return false;
        if (filterType && contract.type !== filterType) return false;
        if (filterValidation && contract.verificationStatus !== filterValidation) return false;
        
        if (filterDateDebut) {
          const filterDate = new Date(filterDateDebut).getTime();
          const contractDate = contract.dateDebut ? new Date(contract.dateDebut).getTime() : null;
          if (!contractDate || contractDate < filterDate) return false;
        }
        
        if (filterDateFin) {
          const filterDate = new Date(filterDateFin).getTime();
          const contractDate = contract.dateFin ? new Date(contract.dateFin).getTime() : null;
          if (!contractDate || contractDate > filterDate) return false;
        }
      }

      return true;
    });
  }, [contracts, searchQuery, showAdvanced, filterStatus, filterType, filterValidation, filterDateDebut, filterDateFin]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-glow">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Registry</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-slate-950">Contract list</h2>
        </div>
        <p className="text-sm text-slate-500">Showing {filteredContracts.length} of {contracts.length} records</p>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search contracts, users, suppliers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
          />
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`whitespace-nowrap rounded-2xl border px-4 py-3 text-sm font-semibold transition ${showAdvanced ? 'bg-slate-950 text-white border-slate-950' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
          >
            Recherche avancée
          </button>
        </div>

        {showAdvanced && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-inner grid gap-4 md:grid-cols-3">
            <label className="grid gap-1">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Status</span>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none">
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="en_attente">En attente</option>
                <option value="terminer">Terminer</option>
              </select>
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Type</span>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none">
                <option value="">All Types</option>
                <option value="renewable">CDD renewable</option>
                <option value="active_to_terminer">CDD</option>
                <option value="cdi">CDI</option>
              </select>
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Validation</span>
              <select value={filterValidation} onChange={(e) => setFilterValidation(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none">
                <option value="">All Validation</option>
                <option value="verified">Verified</option>
                <option value="pending_validation">Pending</option>
                <option value="unverified">Unverified</option>
              </select>
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Date de début (on or after)</span>
              <input type="date" value={filterDateDebut} onChange={(e) => setFilterDateDebut(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none" />
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Date de fin (on or before)</span>
              <input type="date" value={filterDateFin} onChange={(e) => setFilterDateFin(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none" />
            </label>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => {
                  setFilterStatus('');
                  setFilterType('');
                  setFilterValidation('');
                  setFilterDateDebut('');
                  setFilterDateFin('');
                }}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
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
              {filteredContracts.length === 0 ? (
                <tr>
                  <td className="px-4 py-10 text-center text-sm text-slate-500" colSpan="7">
                    No contracts found matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredContracts.map((contract) => (
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
                      <div className="flex flex-col gap-2 items-start">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${statusStyles(contract.status)}`}
                        >
                          {contract.status}
                        </span>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${verificationStyles(contract.verificationStatus)}`}
                        >
                          {contract.verificationStatus === 'pending_validation' ? 'pending' : contract.verificationStatus}
                        </span>
                      </div>
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
