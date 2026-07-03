import { useEffect, useMemo, useState } from 'react';

const emptyForm = {
  title: '',
  type: 'renewable',
  dateDebut: '',
  dateFin: '',
  userId: '',
  fournisseurId: '',
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

function ContractForm({
  initialContract,
  onSubmit,
  onCancelEdit,
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
      userId: initialContract.userId || '',
      fournisseurId: initialContract.fournisseurId || '',
    };
  }, [initialContract]);

  const [formData, setFormData] = useState(initialValues);

  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => {
      return { ...current, [name]: value };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    onSubmit({
      ...formData,
      dateDebut: formData.dateDebut || null,
      dateFin: formData.dateFin || null,
    });

    if (!initialContract) {
      setFormData(emptyForm);
    }
  }

  return (
    
    <form onSubmit={handleSubmit} className="rounded-6xl border border-slate-200 bg-white p-6 shadow-glow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
            Contract Builder
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-slate-950">
            {initialContract ? 'Edit contract' : 'Add contract'}
          </h2>
        </div>
        {initialContract ? (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel edit
          </button>
        ) : null}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Title</span>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Master services agreement"
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">Type</span>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white"
          >
            <option value="renewable">CDD renewable</option>
            <option value="active_to_terminer">CDD</option>
            <option value="cdi">CDI</option>
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">Date Debut</span>
          <input
            type="date"
            name="dateDebut"
            value={formData.dateDebut}
            onChange={handleChange}
            disabled={formData.type === 'cdi'}
            required={formData.type !== 'cdi'}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white disabled:cursor-not-allowed disabled:bg-slate-100"
        </label>
          <span className="text-xs text-slate-500">CDD contracts require an end date. CDI contracts do not.</span>
          <input
            type="date"
            name="dateFin"
            value={formData.dateFin}
            onChange={handleChange}
            required
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white"
          />
          <span className="text-xs text-slate-500">End date is required for both contract types.</span>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">user</span>
          <select
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            required
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white"
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">fournisseur</span>
          <select
            name="fournisseurId"
            value={formData.fournisseurId}
            onChange={handleChange}
            required
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white"
          >
            <option value="">Select a supplier</option>
            {fournisseurs.map((supplier) => (
              <option key={supplier._id} value={supplier._id}>
                {supplier.name} ({supplier.contactEmail})
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
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

export default ContractForm;
