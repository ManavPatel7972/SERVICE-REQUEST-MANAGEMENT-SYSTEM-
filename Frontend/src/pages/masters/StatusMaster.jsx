import { useEffect, useState } from "react";
import { useMasterData } from "../../context/MasterDataContext";
import { useToast } from "../../context/ToastContext";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import EmptyState from "../../components/ui/EmptyState";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";

const empty = { serviceRequestStatusName: "", serviceRequestStatusSystemName: "", sequence: 0, description: "", cssClass: "badge-blue", isOpen: true, isAllowedForTechnician: false };

export default function StatusMaster() {
  const { statuses, refresh, createStatus, updateStatus, deleteStatus } = useMasterData();
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
      if (editing) { await updateStatus(editing, form); push("Status updated", "success"); }
      else         { await createStatus(form);            push("Status created", "success"); }
      setShowModal(false);
    } catch (err) { push(err.response?.data?.message || "Failed", "error"); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    setLoading(true);
    try { await deleteStatus(deleteId); push("Status deleted", "success"); setDeleteId(null); }
    catch { push("Failed to delete", "error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div><h2 className="page-title">Request Status Master</h2><p className="page-subtitle">Define and manage service request lifecycle statuses</p></div>
        <button className="btn-primary" onClick={openCreate}><Plus size={16} /> Add Status</button>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead className="thead">
            <tr>
              <th className="th">Name</th><th className="th">System Name</th><th className="th">Seq</th>
              <th className="th">Type</th><th className="th">Technician</th><th className="th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {statuses.map((s) => (
              <tr key={s._id} className="tr">
                <td className="td"><span className={`badge ${s.cssClass || "badge-blue"}`}>{s.serviceRequestStatusName}</span></td>
                <td className="td font-mono text-xs text-gray-500">{s.serviceRequestStatusSystemName}</td>
                <td className="td text-gray-500">{s.sequence}</td>
                <td className="td"><span className={s.isOpen ? "badge-green badge" : "badge-gray badge"}>{s.isOpen ? "Open" : "Closed"}</span></td>
                <td className="td"><span className={s.isAllowedForTechnician ? "badge-blue badge" : "badge-gray badge"}>{s.isAllowedForTechnician ? "Yes" : "No"}</span></td>
                <td className="td">
                  <div className="flex gap-1">
                    <button className="btn-icon text-primary-600" onClick={() => openEdit(s)}><Pencil size={15} /></button>
                    <button className="btn-icon text-red-500" onClick={() => setDeleteId(s._id)}><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {statuses.length === 0 && <tr><td colSpan={6}><EmptyState title="No statuses defined" icon={Tag} /></td></tr>}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} title={editing ? "Edit Status" : "Add Status"} onClose={() => setShowModal(false)}>
        <form onSubmit={submit}>
          <div className="modal-body space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group col-span-2">
                <label className="label">Status Name *</label>
                <input className="input" value={form.serviceRequestStatusName} onChange={set("serviceRequestStatusName")} required />
              </div>
              <div className="form-group col-span-2">
                <label className="label">System Name *</label>
                <input className="input" placeholder="e.g. IN_PROGRESS" value={form.serviceRequestStatusSystemName} onChange={set("serviceRequestStatusSystemName")} required />
              </div>
              <div className="form-group">
                <label className="label">Sequence</label>
                <input className="input" type="number" value={form.sequence} onChange={set("sequence")} />
              </div>
              <div className="form-group">
                <label className="label">CSS Class</label>
                <select className="input" value={form.cssClass} onChange={set("cssClass")}>
                  <option value="badge-blue">Blue</option><option value="badge-green">Green</option>
                  <option value="badge-red">Red</option><option value="badge-yellow">Yellow</option>
                  <option value="badge-gray">Gray</option><option value="badge-purple">Purple</option>
                </select>
              </div>
              <div className="form-group col-span-2">
                <label className="label">Description</label>
                <textarea className="input" rows={2} value={form.description} onChange={set("description")} />
              </div>
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.isOpen} onChange={set("isOpen")} className="w-4 h-4 accent-primary-600" />
                Is Open Status
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.isAllowedForTechnician} onChange={set("isAllowedForTechnician")} className="w-4 h-4 accent-primary-600" />
                Technician Can Use
              </label>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog show={!!deleteId} title="Delete Status" message="Delete this status? Requests using it may be affected."
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={loading} />
    </div>
  );
}
