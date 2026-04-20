import { useEffect, useState } from "react";
import { useMasterData } from "../../context/MasterDataContext";
import { useToast } from "../../context/ToastContext";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import EmptyState from "../../components/ui/EmptyState";
import { Plus, Trash2, UserCheck } from "lucide-react";

const today = () => new Date().toISOString().split("T")[0];
const empty = { serviceDeptId: "", userId: "", fromDate: today(), toDate: "", description: "", isHODStaff: false };

export default function PersonMaster() {
  const { deptPersons, departments, users, refresh, createDeptPerson, deleteDeptPerson } = useMasterData();
  const { push } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { refresh(); }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createDeptPerson(form);
      push("Staff assigned to department", "success");
      setShowModal(false);
      setForm(empty);
    } catch (err) { push(err.response?.data?.message || "Failed", "error"); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    setLoading(true);
    try { await deleteDeptPerson(deleteId); push("Mapping removed", "success"); setDeleteId(null); }
    catch { push("Failed", "error"); }
    finally { setLoading(false); }
  };

  const getName = (id) => users.find((u) => u._id === id)?.name || "-";
  const getDept = (id) => departments.find((d) => d._id === id)?.serviceDeptName || "-";

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h2 className="page-title">Staff Department Mapping</h2>
          <p className="page-subtitle">Assign staff members to service departments with HOD designation</p>
        </div>
        <button className="btn-primary" onClick={() => { setForm(empty); setShowModal(true); }}>
          <Plus size={16} /> Assign Staff
        </button>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead className="thead">
            <tr>
              <th className="th">Staff Member</th>
              <th className="th">Department</th>
              <th className="th">Role</th>
              <th className="th">From</th>
              <th className="th">To</th>
              <th className="th">Description</th>
              <th className="th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {deptPersons.map((dp) => (
              <tr key={dp._id} className="tr">
                <td className="td">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-700 text-xs font-bold">
                        {(dp.userId?.name || getName(dp.userId))[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{dp.userId?.name || getName(dp.userId)}</p>
                      <p className="text-xs text-gray-400">{dp.userId?.email || ""}</p>
                    </div>
                  </div>
                </td>
                <td className="td font-medium">{dp.serviceDeptId?.serviceDeptName || getDept(dp.serviceDeptId)}</td>
                <td className="td">
                  {dp.isHODStaff
                    ? <span className="badge badge-purple">HOD</span>
                    : <span className="badge badge-gray">Staff</span>}
                </td>
                <td className="td text-sm text-gray-500">{dp.fromDate ? new Date(dp.fromDate).toLocaleDateString() : "-"}</td>
                <td className="td text-sm text-gray-500">{dp.toDate ? new Date(dp.toDate).toLocaleDateString() : <span className="text-emerald-600 text-xs font-medium">Active</span>}</td>
                <td className="td text-sm text-gray-500">{dp.description || "-"}</td>
                <td className="td">
                  <button className="btn-icon text-red-500" onClick={() => setDeleteId(dp._id)}><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
            {deptPersons.length === 0 && (
              <tr><td colSpan={7}><EmptyState title="No staff mappings" icon={UserCheck} /></td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} title="Assign Staff to Department" onClose={() => setShowModal(false)}>
        <form onSubmit={submit}>
          <div className="modal-body space-y-4">
            <div className="form-group">
              <label className="label">Department *</label>
              <select className="input" value={form.serviceDeptId} onChange={set("serviceDeptId")} required>
                <option value="">-- Select Department --</option>
                {departments.map((d) => <option key={d._id} value={d._id}>{d.serviceDeptName}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="label">Staff Member *</label>
              <select className="input" value={form.userId} onChange={set("userId")} required>
                <option value="">-- Select User --</option>
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
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.isHODStaff} onChange={set("isHODStaff")} className="w-4 h-4 accent-primary-600" />
              Designate as HOD for this department
            </label>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? "Saving..." : "Assign"}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog show={!!deleteId} title="Remove Mapping" message="Remove this staff-department assignment?"
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={loading} />
    </div>
  );
}
