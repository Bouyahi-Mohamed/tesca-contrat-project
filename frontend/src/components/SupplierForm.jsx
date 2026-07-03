import { useState } from 'react';

const emptyForm = {
  name: '',
  contactEmail: '',
};

function SupplierForm({ initialSupplier, onSubmit, onCancel, isSubmitting }) {
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
  );
}

export default SupplierForm;
