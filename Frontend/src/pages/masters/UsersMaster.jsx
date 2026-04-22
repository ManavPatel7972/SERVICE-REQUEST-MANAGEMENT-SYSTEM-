import { useEffect, useState } from "react";
import { useMasterData } from "../../context/MasterDataContext";
import { useToast } from "../../context/ToastContext";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import EmptyState from "../../components/ui/EmptyState";
import { Plus, Pencil, Trash2, Users, Shield } from "lucide-react";

const empty = { name: "", email: "", phone: "", password: "", role: "USER" };
const roleColors = { ADMIN: "badge-red", HOD: "badge-purple", TECHNICIAN: "badge-blue", USER: "badge-gray" };

export default function UsersMaster() {
  const { users, refresh, createUser, updateUser, deleteUser } = useMasterData();
  const { push } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { refresh(); }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const openCreate = () => { setEditing(null); setForm(empty); setShowModal(true); };
  const openEdit   = (u) => { setEditing(u._id); setForm({ name: u.name, email: u.email, phone: u.phone || "", role: u.role, password: "" }); setShowModal(true); };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      if (editing && !payload.password) delete payload.password;
      if (editing) { await updateUser(editing, payload); push("User updated", "success"); }
      else         { await createUser(payload);            push("User created", "success"); }
      setShowModal(false);
    } catch (err) { push(err.response?.data?.message || "Failed", "error"); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    setLoading(true);
    try { await deleteUser(deleteId); push("User deactivated", "success"); setDeleteId(null); }
    catch { push("Failed", "error"); }
    finally { setLoading(false); }
  };

  // Group by role for summary
  const roleCounts = users.reduce((acc, u) => ({ ...acc, [u.role]: (acc[u.role] || 0) + 1 }), {});

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h2 className="page-title">User Management</h2>
          <p className="page-subtitle">Manage system users and their roles</p>
        </div>
        <button className="btn-primary" onClick={openCreate}><Plus size={16} /> Add User</button>
      </div>

      {/* Role summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {["ADMIN", "HOD", "TECHNICIAN", "USER"].map((role) => (
          <div key={role} className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
              <Shield size={18} className="text-primary-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{roleCounts[role] || 0}</p>
              <p className="text-xs text-gray-500 font-medium">{role}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead className="thead">
            <tr>
              <th className="th">User</th>
              <th className="th">Role</th>
              <th className="th">Phone</th>
              <th className="th">Status</th>
              <th className="th">Joined</th>
              <th className="th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="tr">
                <td className="td">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-700 font-bold text-sm">{u.name[0]?.toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{u.name}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="td"><span className={`badge ${roleColors[u.role] || "badge-gray"}`}>{u.role}</span></td>
                <td className="td text-sm text-gray-500">{u.phone || "-"}</td>
                <td className="td">
                  <span className={u.isActive ? "badge badge-green" : "badge badge-red"}>
                    {u.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="td text-xs text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="td">
                  <div className="flex gap-1">
                    <button className="btn-icon text-primary-600" onClick={() => openEdit(u)}><Pencil size={15} /></button>
                    <button className="btn-icon text-red-500" onClick={() => setDeleteId(u._id)}><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && <tr><td colSpan={6}><EmptyState title="No users found" icon={Users} /></td></tr>}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} title={editing ? "Edit User" : "Add User"} onClose={() => setShowModal(false)}>
        <form onSubmit={submit}>
          <div className="modal-body space-y-4">
            <div className="form-group">
              <label className="label">Full Name *</label>
              <input className="input" placeholder="John Doe" value={form.name} onChange={set("name")} required />
            </div>
            <div className="form-group">
              <label className="label">Email *</label>
              <input className="input" type="email" placeholder="john@example.com" value={form.email} onChange={set("email")} required disabled={!!editing} />
              {editing && <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>}
            </div>
            <div className="form-group">
              <label className="label">Phone</label>
              <input className="input" placeholder="+91 98765 43210" value={form.phone} onChange={set("phone")} />
            </div>
            <div className="form-group">
              <label className="label">Role *</label>
              <select className="input" value={form.role} onChange={set("role")} required>
                <option value="USER">User (Requestor)</option>
                <option value="TECHNICIAN">Technician</option>
                <option value="HOD">HOD</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div className="form-group">
              <label className="label">{editing ? "New Password (leave blank to keep)" : "Password *"}</label>
              <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={set("password")} required={!editing} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog show={!!deleteId} title="Deactivate User" message="This will deactivate the user account. They will not be able to log in."
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={loading} />
    </div>
  );
}
