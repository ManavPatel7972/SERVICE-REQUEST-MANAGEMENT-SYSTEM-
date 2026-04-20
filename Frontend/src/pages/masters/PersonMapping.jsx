import { useEffect, useState } from "react";
import { useMasterData } from "../../context/MasterDataContext";
import { useToast } from "../../context/ToastContext";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import EmptyState from "../../components/ui/EmptyState";
import { Plus, Trash2, GitBranch } from "lucide-react";

const today = () => new Date().toISOString().split("T")[0];
const empty = { serviceRequestTypeId: "", userId: "", fromDate: today(), toDate: "", description: "" };

export default function PersonMapping() {
  const { typePersons, requestTypes, users, refresh, createTypePerson, deleteTypePerson } = useMasterData();
  const { push } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { refresh(); }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createTypePerson(form);
      push("Person mapped to request type", "success");
      setShowModal(false);
      setForm(empty);
    } catch (err) { push(err.response?.data?.message || "Failed", "error"); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    setLoading(true);
    try { await deleteTypePerson(deleteId); push("Mapping removed", "success"); setDeleteId(null); }
    catch { push("Failed", "error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h2 className="page-title">Type-Person Mapping</h2>
          <p className="page-subtitle">Map service request types to responsible personnel for auto-assignment</p>
        </div>
        <button className="btn-primary" onClick={() => { setForm(empty); setShowModal(true); }}>
          <Plus size={16} /> Add Mapping
        </button>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead className="thead">
            <tr>
              <th className="th">Request Type</th>
              <th className="th">Person</th>
              <th className="th">Role</th>
              <th className="th">From</th>
              <th className="th">To</th>
              <th className="th">Description</th>
              <th className="th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {typePersons.map((tp) => (
              <tr key={tp._id} className="tr">
                <td className="td">
                  <span className="badge badge-indigo" style={{ backgroundColor: "#e0e7ff", color: "#3730a3" }}>
                    {tp.serviceRequestTypeId?.serviceRequestTypeName || "-"}
                  </span>
                </td>
                <td className="td">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-primary-700">
                        {(tp.userId?.name || "")[0]?.toUpperCase() || "?"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{tp.userId?.name || "-"}</p>
                      <p className="text-xs text-gray-400">{tp.userId?.email || ""}</p>
                    </div>
                  </div>
                </td>
                <td className="td"><span className="badge badge-blue">{tp.userId?.role || "-"}</span></td>
                <td className="td text-sm text-gray-500">{tp.fromDate ? new Date(tp.fromDate).toLocaleDateString() : "-"}</td>
                <td className="td text-sm text-gray-500">{tp.toDate ? new Date(tp.toDate).toLocaleDateString() : <span className="text-emerald-600 text-xs font-medium">Active</span>}</td>
                <td className="td text-sm text-gray-500">{tp.description || "-"}</td>
                <td className="td">
                  <button className="btn-icon text-red-500" onClick={() => setDeleteId(tp._id)}><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
            {typePersons.length === 0 && <tr><td colSpan={7}><EmptyState title="No mappings defined" icon={GitBranch} /></td></tr>}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} title="Map Person to Request Type" onClose={() => setShowModal(false)}>
        <form onSubmit={submit}>
          <div className="modal-body space-y-4">
            <div className="form-group">
              <label className="label">Request Type *</label>
              <select className="input" value={form.serviceRequestTypeId} onChange={set("serviceRequestTypeId")} required>
                <option value="">-- Select Request Type --</option>
                {requestTypes.map((rt) => <option key={rt._id} value={rt._id}>{rt.serviceRequestTypeName}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="label">Person *</label>
              <select className="input" value={form.userId} onChange={set("userId")} required>
                <option value="">-- Select Person --</option>
                {users.map((u) => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="label">From Date *</label>
                <input className="input" type="date" value={form.fromDate} onChange={set("fromDate")} required />
              </div>
              <div className="form-group">
                <label className="label">To Date</label>
                <input className="input" type="date" value={form.toDate} onChange={set("toDate")} />
              </div>
            </div>
            <div className="form-group">
              <label className="label">Description</label>
              <textarea className="input" rows={2} value={form.description} onChange={set("description")} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? "Saving..." : "Map Person"}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog show={!!deleteId} title="Remove Mapping" message="Remove this type-person mapping?"
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={loading} />
    </div>
  );
}
