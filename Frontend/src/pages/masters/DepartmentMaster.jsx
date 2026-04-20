import { useEffect, useState } from "react";
import { useMasterData } from "../../context/MasterDataContext";
import { useToast } from "../../context/ToastContext";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import EmptyState from "../../components/ui/EmptyState";
import { Plus, Pencil, Trash2, Building2 } from "lucide-react";

const empty = { serviceDeptName: "", campusId: 1, description: "", ccEmailToCSV: "", isRequestTitleDisable: false };

export default function DepartmentMaster() {
  const { departments, refresh, createDept, updateDept, deleteDept } = useMasterData();
  const { push } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { refresh(); }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  const openCreate = () => { setEditing(null); setForm(empty); setShowModal(true); };
  const openEdit   = (d) => { setEditing(d._id); setForm({ ...d }); setShowModal(true); };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) { await updateDept(editing, form); push("Department updated", "success"); }
      else         { await createDept(form);           push("Department created", "success"); }
      setShowModal(false);
    } catch (err) { push(err.response?.data?.message || "Failed", "error"); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    setLoading(true);
    try { await deleteDept(deleteId); push("Department deleted", "success"); setDeleteId(null); }
    catch { push("Failed to delete", "error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h2 className="page-title">Department Master</h2>
          <p className="page-subtitle">Manage service departments responsible for handling requests</p>
        </div>
        <button className="btn-primary" onClick={openCreate}><Plus size={16} /> Add Department</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((d) => (
          <div key={d._id} className="card p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 size={20} className="text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{d.serviceDeptName}</p>
                  <p className="text-xs text-gray-400">Campus {d.campusId}</p>
                </div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button className="btn-icon text-primary-600" onClick={() => openEdit(d)}><Pencil size={14} /></button>
                <button className="btn-icon text-red-500" onClick={() => setDeleteId(d._id)}><Trash2 size={14} /></button>
              </div>
            </div>
            {d.description && <p className="text-sm text-gray-500 border-t border-gray-100 pt-3">{d.description}</p>}
            {d.ccEmailToCSV && (
              <p className="text-xs text-gray-400">
                <span className="font-medium text-gray-600">CC: </span>{d.ccEmailToCSV}
              </p>
            )}
          </div>
        ))}
        {departments.length === 0 && (
          <div className="col-span-full table-wrapper">
            <EmptyState title="No departments yet" message="Add your first service department" icon={Building2} />
          </div>
        )}
      </div>

      <Modal show={showModal} title={editing ? "Edit Department" : "Add Department"} onClose={() => setShowModal(false)}>
        <form onSubmit={submit}>
          <div className="modal-body space-y-4">
            <div className="form-group">
              <label className="label">Department Name *</label>
              <input className="input" placeholder="e.g. IT Department" value={form.serviceDeptName} onChange={set("serviceDeptName")} required />
            </div>
            <div className="form-group">
              <label className="label">Campus ID</label>
              <input className="input" type="number" value={form.campusId} onChange={set("campusId")} />
            </div>
            <div className="form-group">
              <label className="label">Description</label>
              <textarea className="input" rows={2} placeholder="Brief description..." value={form.description} onChange={set("description")} />
            </div>
            <div className="form-group">
              <label className="label">CC Email(s)</label>
              <input className="input" placeholder="email1@co.com, email2@co.com" value={form.ccEmailToCSV} onChange={set("ccEmailToCSV")} />
              <p className="text-xs text-gray-400 mt-1">Comma-separated email addresses</p>
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.isRequestTitleDisable} onChange={set("isRequestTitleDisable")} className="w-4 h-4 accent-primary-600" />
              Disable custom request title
            </label>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog show={!!deleteId} title="Delete Department" message="This will remove the department. Requests linked to it may be affected."
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={loading} />
    </div>
  );
}
