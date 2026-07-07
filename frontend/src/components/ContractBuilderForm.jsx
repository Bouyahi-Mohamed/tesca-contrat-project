import { useEffect, useMemo, useState } from 'react';

const emptyForm = {
  title: '',
  type: 'renewable',
  dateDebut: '',
  dateFin: '',
  price: '',
  fournisseurId: '',
  document: null,
};

function toDateInputValue(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toISOString().slice(0, 10);
}

function ContractBuilderForm({
  initialContract,
  onSubmit,
  onCancel,
  isSubmitting,
  users = [],
  fournisseurs = [],
}) {
  const initialValues = useMemo(() => {
    if (!initialContract) {
      return emptyForm;
    }

    return {
      title: initialContract.title || '',
      type: initialContract.type || 'renewable',
      dateDebut: toDateInputValue(initialContract.dateDebut),
      dateFin: toDateInputValue(initialContract.dateFin),
      price: initialContract.price ?? '',
      fournisseurId: initialContract.fournisseurId?._id || initialContract.fournisseurId || '',
      document: null,
    };
  }, [initialContract]);

  const [formData, setFormData] = useState(initialValues);

  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  function handleChange(event) {
    const { name, value, type, files } = event.target;

    setFormData((current) => {
      return { ...current, [name]: type === 'file' ? files[0] : value };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    onSubmit(formData);

    if (!initialContract) {
      setFormData(emptyForm);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid min-w-0 gap-2">
          <span className="text-sm font-medium text-slate-700">Title</span>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Master services agreement"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
          />
        </label>

        <label className="grid min-w-0 gap-2">
          <span className="text-sm font-medium text-slate-700">Price (€)</span>
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
            placeholder="0.00"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid min-w-0 gap-2">
          <span className="text-sm font-medium text-slate-700">Type</span>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
          >
            <option value="renewable">CDD renewable</option>
            <option value="active_to_terminer">CDD</option>
            <option value="cdi">CDI</option>
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid min-w-0 gap-2">
          <span className="text-sm font-medium text-slate-700">Date Debut</span>
          <input
            type="date"
            name="dateDebut"
            value={formData.dateDebut}
            onChange={handleChange}
            required
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
          />
        </label>

        <label className="grid min-w-0 gap-2">
          <span className="text-sm font-medium text-slate-700">Date Fin</span>
          <input
            type="date"
            name="dateFin"
            value={formData.dateFin}
            onChange={handleChange}
            required={formData.type !== 'cdi'}
            disabled={formData.type === 'cdi'}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white disabled:cursor-not-allowed disabled:bg-slate-100"
          />
          <span className="text-xs text-slate-500">
            End date is required for CDD contracts. CDI contracts do not require an end date.
          </span>
        </label>
      </div>

      <div className="grid gap-4">
        <label className="grid min-w-0 gap-2">
          <span className="text-sm font-medium text-slate-700">Contract Document (PDF)</span>
          <input
            type="file"
            name="document"
            accept="application/pdf"
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white file:mr-4 file:rounded-xl file:border-0 file:bg-slate-200 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-300"
          />
          {initialContract?.documentUrl && !formData.document && (
            <span className="text-xs text-slate-500">
              A document is already attached. Upload a new PDF to replace it.
            </span>
          )}
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-1">

        <label className="grid min-w-0 gap-2">
          <span className="text-sm font-medium text-slate-700">supplier</span>
          <select
            name="fournisseurId"
            value={formData.fournisseurId}
            onChange={handleChange}
            required
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
          >
            <option value="">Select a supplier</option>
            {fournisseurs.map((supplier) => (
              <option key={supplier._id} value={supplier._id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-auto flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Saving...' : initialContract ? 'Update contract' : 'Create contract'}
        </button>
      </div>
    </form>
  );
}

export default ContractBuilderForm;
