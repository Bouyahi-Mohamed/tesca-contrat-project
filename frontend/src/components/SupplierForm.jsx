import { useState } from 'react';

const emptyForm = {
  name: '',
  contactEmail: '',
};

function SupplierForm({ fournisseurs = [], initialSupplier, onSubmit, onDelete, onCancel, isSubmitting }) {
  const [formData, setFormData] = useState(initialSupplier || emptyForm);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(formData);
    if (!initialSupplier) {
      setFormData(emptyForm);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {fournisseurs.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-700 border-b border-slate-200 pb-2 mb-3">Existing suppliers</h3>
          <ul className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2">
            {fournisseurs.map(f => (
              <li key={f._id} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white">
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">{f.name}</span>
                  <span className="text-xs text-slate-500">{f.contactEmail}</span>
                </div>
                {onDelete && (
                  <button type="button" onClick={() => onDelete(f)} className="text-rose-600 hover:bg-rose-50 p-2 rounded-lg text-xs font-semibold transition">
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-slate-700 border-b border-slate-200 pb-2 mb-4">Add new supplier</h3>
        <form onSubmit={handleSubmit} className="grid gap-4">
      <label className="grid gap-2">
        <span className="text-sm font-medium text-slate-700">Supplier name</span>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Acme Supplier"
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-medium text-slate-700">Contact email</span>
        <input
          type="email"
          name="contactEmail"
          value={formData.contactEmail}
          onChange={handleChange}
          required
          placeholder="supplier@example.com"
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white"
        />
      </label>

      <div className="mt-2 flex items-center justify-end gap-3">
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
          {isSubmitting ? 'Saving...' : 'Add supplier'}
        </button>
      </div>
    </form>
    </div>
  </div>
  );
}

export default SupplierForm;
