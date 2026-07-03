import { useEffect, useMemo, useState } from 'react';
import AlertBanner from './components/AlertBanner';
import ContractBuilderForm from './components/ContractBuilderForm';
import ContractList from './components/ContractList';
import Modal from './components/Modal';
import SiteFooter from './components/SiteFooter';
import SiteHeader from './components/SiteHeader';
import SupplierForm from './components/SupplierForm';
import {
  cancelContract,
  checkRenewals,
  continueContract,
  createContract,
  createFournisseur,
  deleteContract,
  fetchContracts,
  fetchFournisseurs,
  fetchUsers,
  updateContract,
} from './services/api';

function App() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [renewalAction, setRenewalAction] = useState('');
  const [error, setError] = useState('');
  const [editingContract, setEditingContract] = useState(null);
  const [users, setUsers] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [showContractModal, setShowContractModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [supplierSubmitting, setSupplierSubmitting] = useState(false);
  const [supplierError, setSupplierError] = useState('');

  const pendingContracts = useMemo(
    () => contracts.filter((contract) => contract.status === 'en_attente'),
    [contracts]
  );

  const dashboardStats = useMemo(
    () => ({
      total: contracts.length,
      active: contracts.filter((contract) => contract.status === 'active').length,
      pending: pendingContracts.length,
      terminated: contracts.filter((contract) => contract.status === 'terminer').length,
    }),
    [contracts, pendingContracts.length]
  );

  async function loadContracts({ runCheck = false } = {}) {
    setLoading(true);
    setError('');

    try {
      if (runCheck) {
        await checkRenewals();
      }

      const data = await fetchContracts();
      setContracts(data);
    } catch (fetchError) {
      setError(fetchError?.response?.data?.message || 'Failed to load contracts');
    } finally {
      setLoading(false);
    }
  }

  async function loadReferences() {
    const [usersData, suppliersData] = await Promise.all([fetchUsers(), fetchFournisseurs()]);
    setUsers(usersData);
    setFournisseurs(suppliersData);
  }

  useEffect(() => {
    Promise.all([loadContracts({ runCheck: true }), loadReferences()]).catch(() => {
      // Errors are surfaced by the individual loaders.
    });
  }, []);

  async function handleSubmit(formData) {
    setSubmitting(true);
    setError('');

    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('type', formData.type);
      payload.append('price', formData.price);
      if (formData.dateDebut) payload.append('dateDebut', formData.dateDebut);
      if (formData.type !== 'cdi' && formData.dateFin) payload.append('dateFin', formData.dateFin);
      payload.append('userId', formData.userId);
      payload.append('fournisseurId', formData.fournisseurId);
      if (formData.document) {
        payload.append('document', formData.document);
      }

      if (editingContract) {
        await updateContract(editingContract._id, payload);
      } else {
        await createContract(payload);
      }

      setEditingContract(null);
      setShowContractModal(false);
      await loadContracts();
    } catch (saveError) {
      const message = saveError?.response?.data?.errors?.join(', ') || saveError?.response?.data?.message || 'Failed to save contract';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCreateSupplier(formData) {
    setSupplierSubmitting(true);
    setSupplierError('');

    try {
      await createFournisseur(formData);
      await loadReferences();
      setShowSupplierModal(false);
    } catch (createError) {
      const message =
        createError?.response?.data?.errors?.join(', ') ||
        createError?.response?.data?.message ||
        'Failed to save supplier';
      setSupplierError(message);
    } finally {
      setSupplierSubmitting(false);
    }
  }

  async function handleDelete(contract) {
    const confirmed = window.confirm(`Delete contract "${contract.title}"?`);
    if (!confirmed) {
      return;
    }

    setError('');

    try {
      await deleteContract(contract._id);
      await loadContracts();
    } catch (deleteError) {
      setError(deleteError?.response?.data?.message || 'Failed to delete contract');
    }
  }

  function handleEditContract(contract) {
    setEditingContract(contract);
    setShowContractModal(true);
  }

  async function handleContinue(contract) {
    setRenewalAction('continue');
    setError('');

    try {
      await continueContract(contract._id);
      await loadContracts();
    } catch (actionError) {
      setError(actionError?.response?.data?.message || 'Failed to continue contract');
    } finally {
      setRenewalAction('');
    }
  }

  async function handleCancel(contract) {
    setRenewalAction('cancel');
    setError('');

    try {
      await cancelContract(contract._id);
      await loadContracts();
    } catch (actionError) {
      setError(actionError?.response?.data?.message || 'Failed to cancel contract');
    } finally {
      setRenewalAction('');
    }
  }

  const alertContract = pendingContracts[0] || null;

  return (
    <div id="top" className="min-h-screen bg-[#F6F4F0] text-slate-900 flex flex-col ">
      <div className="mt-12 -mb-12">
      <SiteHeader
        title="Our experts are ready to listen to you about any new project."
        primaryActionLabel="Nous contacter"
        primaryActionOnClick={() => {
          setEditingContract(null);
          setShowContractModal(true);
        }}
      />
      </div>

      <main className="mx-auto flex w-full max-w-9xl flex-col gap-8  py-10 sm:px-6 lg:px-8 flex-grow">

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
            {error}
          </div>
        ) : null}

        <section id="overview" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Total contracts', value: dashboardStats.total },
            { label: 'Active', value: dashboardStats.active },
            { label: 'Pending alerts', value: dashboardStats.pending },
            { label: 'Terminated', value: dashboardStats.terminated },
          ].map((stat) => (
            <article
              key={stat.label}
              className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-glow backdrop-blur-sm"
            >
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="mt-4 font-display text-4xl font-bold text-slate-950">{stat.value}</p>
            </article>
          ))}
        </section>

        <AlertBanner contract={alertContract} onContinue={handleContinue} onCancel={handleCancel} busyAction={renewalAction} />

        <section id="registry" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-glow">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Registry</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-slate-950">Contract list</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setEditingContract(null);
                  setShowContractModal(true);
                }}
                className="rounded-2xl bg-amber-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
              >
                Add contract
              </button>
              <button
                type="button"
                onClick={() => setShowSupplierModal(true)}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Add supplier
              </button>
              <button
                type="button"
                onClick={() => loadContracts({ runCheck: true })}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Refresh registry
              </button>
            </div>
          </div>

          <div className="mt-6">
            {loading ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                Loading contracts...
              </div>
            ) : (
              <ContractList contracts={contracts} onEdit={handleEditContract} onDelete={handleDelete} />
            )}
          </div>
        </section>

        {showContractModal ? (
          <Modal
            title={editingContract ? 'Edit contract' : 'Add contract'}
            onClose={() => { setShowContractModal(false); setEditingContract(null); }}
            widthClass="max-w-5xl"
          >
            <ContractBuilderForm
              initialContract={editingContract}
              onSubmit={handleSubmit}
              onCancel={() => { setShowContractModal(false); setEditingContract(null); }}
              isSubmitting={submitting}
              users={users}
              fournisseurs={fournisseurs}
            />
          </Modal>
        ) : null}

        {showSupplierModal ? (
          <Modal title="Add supplier" onClose={() => setShowSupplierModal(false)} widthClass="max-w-xl">
            {supplierError ? (
              <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
                {supplierError}
              </div>
            ) : null}
            <SupplierForm
              onSubmit={handleCreateSupplier}
              onCancel={() => setShowSupplierModal(false)}
              isSubmitting={supplierSubmitting}
            />
          </Modal>
        ) : null}

      </main>

      <SiteFooter />
    </div>
  );
}

export default App;
