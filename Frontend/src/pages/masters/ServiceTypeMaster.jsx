import { useEffect, useState } from "react";
import { useMasterData } from "../../context/MasterDataContext";
import { useToast } from "../../context/ToastContext";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import EmptyState from "../../components/ui/EmptyState";
import { Plus, Pencil, Trash2, Layers } from "lucide-react";

const empty = { serviceTypeName: "", description: "", sequence: 0, isForStaff: true, isForStudent: false };

export default function ServiceTypeMaster() {
  const { serviceTypes, refresh, createServiceType, updateServiceType, deleteServiceType } = useMasterData();
  const { push } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { refresh(); }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  const openCreate = () => { setEditing(null); setForm(empty); setShowModal(true); };
  const openEdit   = (s) => { setEditing(s._id); setForm({ ...s }); setShowModal(true); };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) { await updateServiceType(editing, form); push("Service type updated", "success"); }
      else         { await createServiceType(form);           push("Service type created", "success"); }
      setShowModal(false);
    } catch (err) { push(err.response?.data?.message || "Failed", "error"); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    setLoading(true);
    try { await deleteServiceType(deleteId); push("Service type deleted", "success"); setDeleteId(null); }
    catch { push("Failed to delete", "error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h2 className="page-title">Service Type Master</h2>
          <p className="page-subtitle">Define broad service categories (e.g. Technical, Facility, Administrative)</p>
        </div>
        <button className="btn-primary" onClick={openCreate}><Plus size={16} /> Add Service Type</button>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead className="thead">
            <tr>
              <th className="th">Service Type</th>
              <th className="th">Sequence</th>
              <th className="th">For Staff</th>
              <th className="th">For Student</th>
              <th className="th">Description</th>
              <th className="th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {serviceTypes.map((st) => (
              <tr key={st._id} className="tr">
                <td className="td">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                      <Layers size={15} className="text-cyan-600" />
                    </div>
                    <span className="font-semibold text-gray-900">{st.serviceTypeName}</span>
                  </div>
                </td>
                <td className="td text-gray-500">{st.sequence}</td>
                <td className="td"><span className={st.isForStaff ? "badge-green badge" : "badge-gray badge"}>{st.isForStaff ? "Yes" : "No"}</span></td>
                <td className="td"><span className={st.isForStudent ? "badge-blue badge" : "badge-gray badge"}>{st.isForStudent ? "Yes" : "No"}</span></td>
                <td className="td text-sm text-gray-500 max-w-xs truncate">{st.description || "-"}</td>
                <td className="td">
                  <div className="flex gap-1">
                    <button className="btn-icon text-primary-600" onClick={() => openEdit(st)}><Pencil size={15} /></button>
                    <button className="btn-icon text-red-500" onClick={() => setDeleteId(st._id)}><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {serviceTypes.length === 0 && <tr><td colSpan={6}><EmptyState title="No service types" icon={Layers} /></td></tr>}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} title={editing ? "Edit Service Type" : "Add Service Type"} onClose={() => setShowModal(false)}>
        <form onSubmit={submit}>
          <div className="modal-body space-y-4">
            <div className="form-group">
              <label className="label">Service Type Name *</label>
              <input className="input" placeholder="e.g. Technical, Facility" value={form.serviceTypeName} onChange={set("serviceTypeName")} required />
            </div>
            <div className="form-group">
              <label className="label">Sequence</label>
              <input className="input" type="number" value={form.sequence} onChange={set("sequence")} />
            </div>
            <div className="form-group">
              <label className="label">Description</label>
              <textarea className="input" rows={2} value={form.description} onChange={set("description")} />
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.isForStaff} onChange={set("isForStaff")} className="w-4 h-4 accent-primary-600" />
                Available for Staff
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.isForStudent} onChange={set("isForStudent")} className="w-4 h-4 accent-primary-600" />
                Available for Students
              </label>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog show={!!deleteId} title="Delete Service Type" message="Delete this service type? Request types under it may be affected."
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={loading} />
    </div>
  );
}
