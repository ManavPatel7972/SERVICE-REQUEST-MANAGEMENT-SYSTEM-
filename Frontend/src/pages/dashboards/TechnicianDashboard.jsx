import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useServiceRequests } from "../../context/ServiceRequestContext";
import { useMasterData } from "../../context/MasterDataContext";
import { useToast } from "../../context/ToastContext";
import Modal from "../../components/ui/Modal";
import EmptyState from "../../components/ui/EmptyState";
import { PageLoader } from "../../components/ui/Spinner";
import { RefreshCw, MessageSquare, CheckSquare, Trash2 } from "lucide-react";

function ReplyPanel({ requestId, currentUser, getReplies, addReply, deleteReply, statuses }) {
  const { push } = useToast();
  const [replies, setReplies] = useState([]);
  const [text, setText] = useState("");
  const [statusId, setStatusId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { getReplies(requestId).then(setReplies).catch(() => {}); }, [requestId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      await addReply({ serviceRequestId: requestId, replyDescription: text, serviceRequestStatusId: statusId || undefined });
      setText(""); setStatusId("");
      const fresh = await getReplies(requestId);
      setReplies(fresh);
      push("Reply posted", "success");
    } catch { push("Failed", "error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-body space-y-4">
      <div className="max-h-64 overflow-y-auto space-y-3">
        {replies.length === 0 && <p className="text-sm text-gray-400 text-center py-6">No replies yet</p>}
        {replies.map((r) => (
          <div key={r._id} className={`p-3 rounded-xl text-sm border ${r.userId?._id === currentUser?.id ? "bg-primary-50 border-primary-100 ml-8" : "bg-gray-50 border-gray-100 mr-8"}`}>
            <div className="flex justify-between mb-1">
              <span className="font-semibold text-gray-800">{r.userId?.name}</span>
              <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleString()}</span>
            </div>
            <p className="text-gray-600">{r.replyDescription}</p>
            {r.serviceRequestStatusId && <span className="badge badge-blue mt-1">{r.serviceRequestStatusId.serviceRequestStatusName}</span>}
          </div>
        ))}
      </div>
      <form onSubmit={submit} className="space-y-3">
        <select className="input" value={statusId} onChange={(e) => setStatusId(e.target.value)}>
          <option value="">-- Update Status (optional) --</option>
          {statuses.map((s) => <option key={s._id} value={s._id}>{s.serviceRequestStatusName}</option>)}
        </select>
        <div className="flex gap-2">
          <input className="input flex-1" placeholder="Write your update..." value={text} onChange={(e) => setText(e.target.value)} />
          <button type="submit" className="btn-primary" disabled={loading || !text.trim()}>Post</button>
        </div>
      </form>
      <div className="modal-footer">
        <button className="btn-secondary" onClick={() => {}}>Close</button>
      </div>
    </div>
  );
}

export default function TechnicianDashboard() {
  const { user } = useAuth();
  const { requests, refreshRequests, loading, getReplies, addReply, deleteReply } = useServiceRequests();
  const { statuses, refresh } = useMasterData();
  const [replyFor, setReplyFor] = useState(null);

  // Data auto-loads from context on login

  const assigned = requests.filter((r) => r.assignedToUserId?._id === user?.id || r.assignedToUserId === user?.id);

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h2 className="page-title">My Assigned Requests</h2>
          <p className="page-subtitle">View and update your assigned service tickets</p>
        </div>
        <button className="btn-secondary" onClick={refreshRequests}><RefreshCw size={15} /> Refresh</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 text-center bg-primary-50">
          <p className="text-2xl font-bold text-primary-700">{assigned.length}</p>
          <p className="text-sm text-primary-600 mt-1">Total Assigned</p>
        </div>
        <div className="card p-4 text-center bg-amber-50">
          <p className="text-2xl font-bold text-amber-700">{assigned.filter((r) => r.approvalStatus === "PENDING").length}</p>
          <p className="text-sm text-amber-600 mt-1">Pending</p>
        </div>
        <div className="card p-4 text-center bg-emerald-50">
          <p className="text-2xl font-bold text-emerald-700">{assigned.filter((r) => r.approvalStatus === "APPROVED").length}</p>
          <p className="text-sm text-emerald-600 mt-1">Approved</p>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {assigned.length === 0 && <div className="table-wrapper"><EmptyState title="No requests assigned" message="Requests assigned to you will appear here" /></div>}
        {assigned.map((r) => (
          <div key={r._id} className="card p-5 flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-primary-700">{r.serviceRequestNo}</span>
                <span className={`priority-${r.priorityLevel}`}>{r.priorityLevel}</span>
                <span className={`approval-${r.approvalStatus}`}>{r.approvalStatus}</span>
                {r.serviceRequestStatusId && <span className="badge badge-blue">{r.serviceRequestStatusId.serviceRequestStatusName}</span>}
              </div>
              <h4 className="font-semibold text-gray-900">{r.serviceRequestTitle}</h4>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{r.serviceRequestDescription}</p>
              <p className="text-xs text-gray-400 mt-2">Raised by: {r.userId?.name || "Unknown"} · {new Date(r.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex sm:flex-col gap-2 justify-end">
              <button className="btn-primary text-xs" onClick={() => setReplyFor(r._id)}>
                <MessageSquare size={14} /> Replies
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal show={!!replyFor} title="Request Thread" onClose={() => setReplyFor(null)} size="lg">
        {replyFor && (
          <ReplyPanel
            requestId={replyFor}
            currentUser={user}
            getReplies={getReplies}
            addReply={addReply}
            deleteReply={deleteReply}
            statuses={statuses}
          />
        )}
      </Modal>
    </div>
  );
}
