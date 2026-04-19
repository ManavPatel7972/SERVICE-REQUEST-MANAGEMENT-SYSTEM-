import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useServiceRequests } from "../../context/ServiceRequestContext";
import { useMasterData } from "../../context/MasterDataContext";
import { useToast } from "../../context/ToastContext";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import EmptyState from "../../components/ui/EmptyState";
import { PageLoader } from "../../components/ui/Spinner";
import { Plus, MessageSquare, Trash2, ClipboardList, RefreshCw, AlertCircle } from "lucide-react";

// ── New Request Form ──────────────────────────────────────────────────────────
function RequestForm({ onSubmit, onCancel, requestTypes, loading }) {
  const [form, setForm] = useState({
    serviceRequestTypeId: "",
    serviceRequestTitle: "",
    serviceRequestDescription: "",
    priorityLevel: "MEDIUM",
  });
  const set = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}>
      <div className="modal-body space-y-4">
        {requestTypes.length === 0 && (
          <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            <span>No request types are set up yet. Ask your admin to create request types first.</span>
          </div>
        )}
        <div className="form-group">
          <label className="label">Request Type *</label>
          <select className="input" value={form.serviceRequestTypeId} onChange={set("serviceRequestTypeId")} required disabled={requestTypes.length === 0}>
            <option value="">-- Select Request Type --</option>
            {requestTypes.map((rt) => (
              <option key={rt._id} value={rt._id}>{rt.serviceRequestTypeName}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="label">Title *</label>
          <input className="input" placeholder="Brief summary of your issue" value={form.serviceRequestTitle} onChange={set("serviceRequestTitle")} required />
        </div>
        <div className="form-group">
          <label className="label">Description *</label>
          <textarea className="input" rows={4} placeholder="Describe your issue in detail..." value={form.serviceRequestDescription} onChange={set("serviceRequestDescription")} required />
        </div>
        <div className="form-group">
          <label className="label">Priority</label>
          <select className="input" value={form.priorityLevel} onChange={set("priorityLevel")}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={loading || requestTypes.length === 0}>
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </div>
    </form>
  );
}

// ── Reply Thread ──────────────────────────────────────────────────────────────
function ReplyThread({ requestId, onClose }) {
  const { user } = useAuth();
  const { getReplies, addReply, deleteReply } = useServiceRequests();
  const { push } = useToast();
  const [replies, setReplies] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    setFetching(true);
    getReplies(requestId)
      .then(setReplies)
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [requestId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      await addReply({ serviceRequestId: requestId, replyDescription: text });
      setText("");
      const fresh = await getReplies(requestId);
      setReplies(fresh);
      push("Reply sent", "success");
    } catch {
      push("Failed to send reply", "error");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    try {
      await deleteReply(id);
      setReplies(prev => prev.filter(r => r._id !== id));
      push("Reply deleted", "success");
    } catch {
      push("Failed to delete", "error");
    }
  };

  return (
    <>
      <div className="modal-body space-y-4">
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {fetching && <p className="text-sm text-gray-400 text-center py-4">Loading replies...</p>}
          {!fetching && replies.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-6">No replies yet. Be the first to write one.</p>
          )}
          {replies.map((r) => {
            const isMe = (r.userId?._id || r.userId) === user?.id;
            return (
              <div key={r._id} className={`p-3 rounded-xl text-sm border ${isMe ? "bg-primary-50 border-primary-100 ml-6" : "bg-gray-50 border-gray-100 mr-6"}`}>
                <div className="flex justify-between items-center gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800">{r.userId?.name || "User"}</span>
                    {r.userId?.role && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{r.userId.role}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleString()}</span>
                    {isMe && (
                      <button onClick={() => remove(r._id)} className="text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-gray-700">{r.replyDescription}</p>
              </div>
            );
          })}
        </div>
        <form onSubmit={submit} className="flex gap-2">
          <input
            className="input flex-1"
            placeholder="Write a reply..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit" className="btn-primary" disabled={loading || !text.trim()}>
            {loading ? "..." : "Send"}
          </button>
        </form>
      </div>
      <div className="modal-footer">
        <button className="btn-secondary" onClick={onClose}>Close</button>
      </div>
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function RequestorDashboard() {
  const { user } = useAuth();
  const { requests, refreshRequests, createRequest, deleteRequest, loading } = useServiceRequests();
  const { requestTypes, refresh } = useMasterData();
  const { push } = useToast();

  const [showCreate, setShowCreate] = useState(false);
  const [replyFor, setReplyFor]     = useState(null);
  const [deleteFor, setDeleteFor]   = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting]     = useState(false);

  useEffect(() => {
    refreshRequests();
    refresh();
  }, []);

  // Fix: compare string IDs properly
  const myRequests = requests.filter((r) => {
    const rid = r.userId?._id?.toString() || r.userId?.toString() || "";
    return rid === user?.id?.toString() || rid === user?._id?.toString();
  });

  const handleCreate = async (form) => {
    setSubmitting(true);
    try {
      await createRequest(form);
      push("Request submitted successfully!", "success");
      setShowCreate(false);
    } catch (e) {
      push(e.response?.data?.message || "Failed to create request", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteRequest(deleteFor);
      push("Request deleted", "success");
      setDeleteFor(null);
    } catch {
      push("Failed to delete request", "error");
    } finally {
      setDeleting(false);
    }
  };

  if (loading && requests.length === 0) return <PageLoader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">My Service Requests</h2>
          <p className="page-subtitle">Create and track your support tickets</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary" onClick={refreshRequests} title="Refresh">
            <RefreshCw size={15} />
          </button>
          <button className="btn-primary" onClick={() => setShowCreate(true)}>
            <Plus size={16} /> New Request
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total",    val: myRequests.length,                                            color: "text-primary-600 bg-primary-50" },
          { label: "Pending",  val: myRequests.filter(r => r.approvalStatus === "PENDING").length,  color: "text-amber-600 bg-amber-50" },
          { label: "Approved", val: myRequests.filter(r => r.approvalStatus === "APPROVED").length, color: "text-emerald-600 bg-emerald-50" },
          { label: "Rejected", val: myRequests.filter(r => r.approvalStatus === "REJECTED").length, color: "text-red-600 bg-red-50" },
        ].map(s => (
          <div key={s.label} className={`card p-4 text-center ${s.color}`}>
            <p className="text-2xl font-bold">{s.val}</p>
            <p className="text-sm font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="table">
          <thead className="thead">
            <tr>
              <th className="th">Request No</th>
              <th className="th">Title</th>
              <th className="th">Type</th>
              <th className="th">Priority</th>
              <th className="th">Approval</th>
              <th className="th">Status</th>
              <th className="th">Date</th>
              <th className="th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {myRequests.map((r) => (
              <tr key={r._id} className="tr">
                <td className="td">
                  <span className="font-mono text-xs font-bold text-primary-700">{r.serviceRequestNo}</span>
                </td>
                <td className="td">
                  <p className="font-medium text-gray-900 max-w-[200px] truncate">{r.serviceRequestTitle}</p>
                  <p className="text-xs text-gray-400 max-w-[200px] truncate">{r.serviceRequestDescription}</p>
                </td>
                <td className="td">
                  <span className="text-xs text-gray-500">{r.serviceRequestTypeId?.serviceRequestTypeName || "—"}</span>
                </td>
                <td className="td">
                  <span className={`priority-${r.priorityLevel}`}>{r.priorityLevel}</span>
                </td>
                <td className="td">
                  <span className={`approval-${r.approvalStatus}`}>{r.approvalStatus}</span>
                </td>
                <td className="td">
                  {r.serviceRequestStatusId
                    ? <span className="badge badge-blue">{r.serviceRequestStatusId.serviceRequestStatusName}</span>
                    : <span className="badge badge-gray">No Status</span>}
                </td>
                <td className="td text-xs text-gray-400">
                  {new Date(r.createdAt).toLocaleDateString()}
                </td>
                <td className="td">
                  <div className="flex gap-1">
                    <button
                      className="btn-ghost p-1.5 text-gray-500 hover:text-primary-600"
                      onClick={() => setReplyFor(r._id)}
                      title="View Replies"
                    >
                      <MessageSquare size={15} />
                    </button>
                    <button
                      className="btn-ghost p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50"
                      onClick={() => setDeleteFor(r._id)}
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {myRequests.length === 0 && (
              <tr>
                <td colSpan={8}>
                  <EmptyState
                    title="No requests yet"
                    message="Click '+ New Request' to raise your first service request"
                    icon={ClipboardList}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      <Modal show={showCreate} title="New Service Request" onClose={() => setShowCreate(false)}>
        <RequestForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreate(false)}
          requestTypes={requestTypes}
          loading={submitting}
        />
      </Modal>

      {/* Replies Modal */}
      <Modal show={!!replyFor} title="Request Replies" onClose={() => setReplyFor(null)} size="lg">
        {replyFor && <ReplyThread requestId={replyFor} onClose={() => setReplyFor(null)} />}
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        show={!!deleteFor}
        title="Delete Request"
        message="Are you sure you want to delete this service request? This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteFor(null)}
        loading={deleting}
      />
    </div>
  );
}
