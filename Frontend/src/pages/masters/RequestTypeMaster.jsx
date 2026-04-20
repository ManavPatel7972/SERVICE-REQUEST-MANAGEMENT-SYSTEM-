import { useEffect, useState } from "react";
import { useMasterData } from "../../context/MasterDataContext";
import { useToast } from "../../context/ToastContext";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import EmptyState from "../../components/ui/EmptyState";
import { Plus, Pencil, Trash2, FileText } from "lucide-react";

const empty = { serviceTypeId: "", serviceDeptId: "", serviceRequestTypeName: "", description: "", sequence: 0, defaultPriorityLevel: "MEDIUM", reminderDaysAfterAssignment: 3 };

export default function RequestTypeMaster() {
  const { requestTypes, serviceTypes, departments, refresh, createRequestType, updateRequestType, deleteRequestType } = useMasterData();
  const { push } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { refresh(); }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const openCreate = () => { setEditing(null); setForm(empty); setShowModal(true); };
  const openEdit   = (rt) => {
    setEditing(rt._id);
    setForm({
      ...rt,
      serviceTypeId: rt.serviceTypeId?._id || rt.serviceTypeId || "",
      serviceDeptId: rt.serviceDeptId?._id || rt.serviceDeptId || "",
    });
    setShowModal(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) { await updateRequestType(editing, form); push("Request type updated", "success"); }
      else         { await createRequestType(form);           push("Request type created", "success"); }
      setShowModal(false);
    } catch (err) { push(err.response?.data?.message || "Failed", "error"); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    setLoading(true);
    try { await deleteRequestType(deleteId); push("Request type deleted", "success"); setDeleteId(null); }
    catch { push("Failed to delete", "error"); }
    finally { setLoading(false); }
  };

  const priorityColors = { LOW: "badge-gray", MEDIUM: "badge-blue", HIGH: "badge-yellow", CRITICAL: "badge-red" };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h2 className="page-title">Request Type Master</h2>
          <p className="page-subtitle">Define specific request types under each service category</p>
        </div>
        <button className="btn-primary" onClick={openCreate}><Plus size={16} /> Add Request Type</button>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead className="thead">
            <tr>
              <th className="th">Request Type</th>
              <th className="th">Service Type</th>
              <th className="th">Department</th>
              <th className="th">Default Priority</th>
              <th className="th">Reminder Days</th>
              <th className="th">Stats</th>
              <th className="th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requestTypes.map((rt) => (
              <tr key={rt._id} className="tr">
                <td className="td">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText size={14} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{rt.serviceRequestTypeName}</p>
                      {rt.description && <p className="text-xs text-gray-400 truncate max-w-xs">{rt.description}</p>}
                    </div>
                  </div>
                </td>
                <td className="td text-sm text-gray-600">{rt.serviceTypeId?.serviceTypeName || "-"}</td>
                <td className="td text-sm text-gray-600">{rt.serviceDeptId?.serviceDeptName || "-"}</td>
                <td className="td"><span className={`badge ${priorityColors[rt.defaultPriorityLevel] || "badge-gray"}`}>{rt.defaultPriorityLevel}</span></td>
                <td className="td text-gray-500">{rt.reminderDaysAfterAssignment} days</td>
                <td className="td">
                  <div className="flex gap-1 text-xs">
                    <span className="badge badge-gray">T:{rt.requestTotal}</span>
                    <span className="badge badge-yellow">P:{rt.requestPending}</span>
                    <span className="badge badge-green">C:{rt.requestClosed}</span>
                  </div>
                </td>
                <td className="td">
                  <div className="flex gap-1">
                    <button className="btn-icon text-primary-600" onClick={() => openEdit(rt)}><Pencil size={15} /></button>
                    <button className="btn-icon text-red-500" onClick={() => setDeleteId(rt._id)}><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {requestTypes.length === 0 && <tr><td colSpan={7}><EmptyState title="No request types" icon={FileText} /></td></tr>}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} title={editing ? "Edit Request Type" : "Add Request Type"} onClose={() => setShowModal(false)} size="lg">
        <form onSubmit={submit}>
          <div className="modal-body grid grid-cols-2 gap-4">
            <div className="form-group col-span-2">
              <label className="label">Request Type Name *</label>
              <input className="input" placeholder="e.g. Computer Issue, AC Repair" value={form.serviceRequestTypeName} onChange={set("serviceRequestTypeName")} required />
            </div>
            <div className="form-group">
              <label className="label">Service Type *</label>
              <select className="input" value={form.serviceTypeId} onChange={set("serviceTypeId")} required>
                <option value="">-- Select Service Type --</option>
                {serviceTypes.map((st) => <option key={st._id} value={st._id}>{st.serviceTypeName}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="label">Department *</label>
              <select className="input" value={form.serviceDeptId} onChange={set("serviceDeptId")} required>
                <option value="">-- Select Department --</option>
                {departments.map((d) => <option key={d._id} value={d._id}>{d.serviceDeptName}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="label">Default Priority</label>
              <select className="input" value={form.defaultPriorityLevel} onChange={set("defaultPriorityLevel")}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
            <div className="form-group">
              <label className="label">Reminder Days After Assignment</label>
              <input className="input" type="number" min={1} value={form.reminderDaysAfterAssignment} onChange={set("reminderDaysAfterAssignment")} />
            </div>
            <div className="form-group">
              <label className="label">Sequence</label>
              <input className="input" type="number" value={form.sequence} onChange={set("sequence")} />
            </div>
            <div className="form-group col-span-2">
              <label className="label">Description</label>
              <textarea className="input" rows={2} value={form.description} onChange={set("description")} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog show={!!deleteId} title="Delete Request Type" message="Delete this request type? Active requests using it may be affected."
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={loading} />
    </div>
  );
}
