import { useState, useMemo } from "react";
import { useServiceRequests } from "../../context/ServiceRequestContext";
import { useMasterData } from "../../context/MasterDataContext";
import { useToast } from "../../context/ToastContext";
import Modal from "../../components/ui/Modal";
import EmptyState from "../../components/ui/EmptyState";
import { PageLoader } from "../../components/ui/Spinner";
import { CheckCircle, XCircle, UserCheck, Activity, RefreshCw, Filter, Eye } from "lucide-react";

function RequestDetailModal({ request, statuses, users, onAssign, onStatus, onApprove, onClose }) {
  const technicians = users.filter((u) => u.role === "TECHNICIAN");
  const [assignTo, setAssignTo] = useState(request?.assignedToUserId?._id || "");
  const [statusId, setStatusId] = useState(request?.serviceRequestStatusId?._id || "");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAssign = async () => {
    if (!assignTo) return;
    setLoading(true);
    try { await onAssign(request._id, { assignedToUserId: assignTo }); }
    finally { setLoading(false); }
  };

  const handleStatus = async () => {
    if (!statusId) return;
    setLoading(true);
    try { await onStatus(request._id, { serviceRequestStatusId: statusId, serviceRequestStatusDescription: desc }); }
    finally { setLoading(false); }
  };

  const handleApprove = async (status) => {
    setLoading(true);
    try { await onApprove(request._id, { approvalStatus: status, approvalStatusDescription: desc }); onClose(); }
    finally { setLoading(false); }
  };

  if (!request) return null;
  return (
    <div className="modal-body space-y-5">
      {/* Info */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-2">
        <p className="font-mono text-xs text-primary-600 font-bold">{request.serviceRequestNo}</p>
        <p className="font-semibold text-gray-900">{request.serviceRequestTitle}</p>
        <p className="text-sm text-gray-500">{request.serviceRequestDescription}</p>
        <div className="flex flex-wrap gap-2 pt-1">
          <span className={`priority-${request.priorityLevel}`}>{request.priorityLevel}</span>
          <span className={`approval-${request.approvalStatus}`}>{request.approvalStatus}</span>
          {request.assignedToUserId && <span className="badge badge-blue">Assigned: {request.assignedToUserId.name}</span>}
        </div>
      </div>

      {/* Assign */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-700">Assign Technician</p>
        <div className="flex gap-2">
          <select className="input flex-1" value={assignTo} onChange={(e) => setAssignTo(e.target.value)}>
            <option value="">-- Select Technician --</option>
            {technicians.map((u) => <option key={u._id} value={u._id}>{u.name}</option>)}
          </select>
          <button className="btn-primary" onClick={handleAssign} disabled={loading || !assignTo}>Assign</button>
        </div>
      </div>

      {/* Status */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-700">Update Status</p>
        <div className="flex gap-2">
          <select className="input flex-1" value={statusId} onChange={(e) => setStatusId(e.target.value)}>
            <option value="">-- Select Status --</option>
            {statuses.map((s) => <option key={s._id} value={s._id}>{s.serviceRequestStatusName}</option>)}
          </select>
          <button className="btn-secondary" onClick={handleStatus} disabled={loading || !statusId}>Update</button>
        </div>
      </div>

      {/* Notes */}
      <div className="form-group">
        <label className="label">Notes / Description</label>
        <textarea className="input" rows={2} placeholder="Optional note..." value={desc} onChange={(e) => setDesc(e.target.value)} />
      </div>

      {/* Approval */}
      {request.approvalStatus === "PENDING" && (
        <div className="flex gap-3 pt-2">
          <button className="btn-success flex-1 justify-center" onClick={() => handleApprove("APPROVED")} disabled={loading}>
            <CheckCircle size={16} /> Approve
          </button>
          <button className="btn-danger flex-1 justify-center" onClick={() => handleApprove("REJECTED")} disabled={loading}>
            <XCircle size={16} /> Reject
          </button>
        </div>
      )}

      <div className="modal-footer">
        <button className="btn-secondary" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default function HODDashboard() {
  const { requests, stats, refreshRequests, loading, assignRequest, changeStatus, approveRequest } = useServiceRequests();
  const { statuses, users, refresh } = useMasterData();
  const { push } = useToast();
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("ALL");

  // Data auto-loads from context on login

  const filtered = useMemo(() => {
    if (filter === "ALL") return requests;
    if (filter === "PENDING") return requests.filter((r) => r.approvalStatus === "PENDING");
    if (filter === "UNASSIGNED") return requests.filter((r) => !r.assignedToUserId);
    return requests.filter((r) => r.approvalStatus === filter);
  }, [requests, filter]);

  const act = (fn, msg) => async (...args) => {
    try { await fn(...args); push(msg, "success"); await refreshRequests(); }
    catch (e) { push(e.response?.data?.message || "Action failed", "error"); }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h2 className="page-title">HOD Dashboard</h2>
          <p className="page-subtitle">Approve, assign and monitor all service requests</p>
        </div>
        <button className="btn-secondary" onClick={refreshRequests}><RefreshCw size={15} /> Refresh</button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total", val: stats.total, color: "bg-primary-50 text-primary-700" },
          { label: "Pending", val: stats.pending, color: "bg-amber-50 text-amber-700" },
          { label: "Approved", val: stats.approved, color: "bg-emerald-50 text-emerald-700" },
          { label: "Rejected", val: stats.rejected, color: "bg-red-50 text-red-700" },
        ].map((s) => (
          <div key={s.label} className={`card p-4 text-center ${s.color}`}>
            <p className="text-2xl font-bold">{s.val}</p>
            <p className="text-sm font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2 items-center">
        <Filter size={16} className="text-gray-400" />
        {["ALL", "PENDING", "APPROVED", "REJECTED", "UNASSIGNED"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filter === f ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Requests Table */}
      <div className="table-wrapper">
        <table className="table">
          <thead className="thead">
            <tr>
              <th className="th">Request</th>
              <th className="th">Raised By</th>
              <th className="th">Priority</th>
              <th className="th">Assigned To</th>
              <th className="th">Status</th>
              <th className="th">Approval</th>
              <th className="th">Date</th>
              <th className="th">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r._id} className="tr">
                <td className="td">
                  <p className="font-mono text-xs font-bold text-primary-700">{r.serviceRequestNo}</p>
                  <p className="text-sm font-medium text-gray-900 max-w-xs truncate">{r.serviceRequestTitle}</p>
                </td>
                <td className="td text-sm text-gray-600">{r.userId?.name || "-"}</td>
                <td className="td"><span className={`priority-${r.priorityLevel}`}>{r.priorityLevel}</span></td>
                <td className="td">
                  {r.assignedToUserId
                    ? <span className="badge badge-blue">{r.assignedToUserId.name}</span>
                    : <span className="badge badge-gray">Unassigned</span>}
                </td>
                <td className="td">
                  {r.serviceRequestStatusId
                    ? <span className="badge badge-purple">{r.serviceRequestStatusId.serviceRequestStatusName}</span>
                    : <span className="badge badge-gray">—</span>}
                </td>
                <td className="td"><span className={`approval-${r.approvalStatus}`}>{r.approvalStatus}</span></td>
                <td className="td text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</td>
                <td className="td">
                  <button className="btn-ghost p-1.5" onClick={() => setSelected(r)} title="Manage">
                    <Eye size={15} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8}><EmptyState title="No requests found" /></td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      <Modal show={!!selected} title="Manage Request" onClose={() => setSelected(null)} size="lg">
        {selected && (
          <RequestDetailModal
            request={selected}
            statuses={statuses}
            users={users}
            onAssign={act(assignRequest, "Assigned!")}
            onStatus={act(changeStatus, "Status updated!")}
            onApprove={act(approveRequest, "Done!")}
            onClose={() => setSelected(null)}
          />
        )}
      </Modal>
    </div>
  );
}
