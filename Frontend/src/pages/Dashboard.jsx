import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useServiceRequests } from "../context/ServiceRequestContext";
import { useMasterData } from "../context/MasterDataContext";
import { ClipboardList, CheckCircle, XCircle, Clock, Users, Building2, FileText, ArrowRight } from "lucide-react";
import { PageLoader } from "../components/ui/Spinner";

function StatCard({ label, value, icon: Icon, iconColor, iconBg }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${iconBg}`}>
        <Icon size={22} className={iconColor} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value ?? 0}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { stats, requests, loading } = useServiceRequests();
  const { departments, users, requestTypes } = useMasterData();

  const isAdmin = ["ADMIN", "HOD"].includes(user?.role);

  if (loading && requests.length === 0) return <PageLoader />;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold">Welcome back, {user?.name}! 👋</h2>
        <p className="text-primary-200 mt-1 text-sm">
          {isAdmin
            ? "Here's an overview of all service requests across the system."
            : "Here's a summary of your service requests."}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            to="/dashboard/requestor"
            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <ClipboardList size={16} /> My Requests <ArrowRight size={14} />
          </Link>
          {isAdmin && (
            <Link
              to="/dashboard/hod"
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              <Users size={16} /> HOD Dashboard <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>

      {/* Request Stats */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Request Overview</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Requests"    value={stats.total}    icon={ClipboardList} iconColor="text-primary-600"  iconBg="bg-primary-50" />
          <StatCard label="Pending Approval"  value={stats.pending}  icon={Clock}         iconColor="text-amber-600"    iconBg="bg-amber-50" />
          <StatCard label="Approved"          value={stats.approved} icon={CheckCircle}   iconColor="text-emerald-600"  iconBg="bg-emerald-50" />
          <StatCard label="Rejected"          value={stats.rejected} icon={XCircle}       iconColor="text-red-600"      iconBg="bg-red-50" />
        </div>
      </div>

      {/* System overview for admins */}
      {isAdmin && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">System Overview</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard label="Departments"   value={departments.length}  icon={Building2} iconColor="text-purple-600" iconBg="bg-purple-50" />
            <StatCard label="Request Types" value={requestTypes.length} icon={FileText}  iconColor="text-cyan-600"   iconBg="bg-cyan-50" />
            <StatCard label="Users"         value={users.length}        icon={Users}     iconColor="text-orange-600" iconBg="bg-orange-50" />
          </div>
        </div>
      )}

      {/* Recent Requests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Recent Requests</h3>
          <Link to="/dashboard/requestor" className="text-sm text-primary-600 hover:underline font-medium">
            View all →
          </Link>
        </div>
        <div className="table-wrapper">
          <table className="table">
            <thead className="thead">
              <tr>
                <th className="th">Request No</th>
                <th className="th">Title</th>
                <th className="th">Priority</th>
                <th className="th">Approval</th>
                <th className="th">Date</th>
              </tr>
            </thead>
            <tbody>
              {requests.slice(0, 5).map((r) => (
                <tr key={r._id} className="tr">
                  <td className="td font-mono text-xs font-bold text-primary-700">{r.serviceRequestNo}</td>
                  <td className="td font-medium text-gray-900">{r.serviceRequestTitle}</td>
                  <td className="td"><span className={`priority-${r.priorityLevel}`}>{r.priorityLevel}</span></td>
                  <td className="td"><span className={`approval-${r.approvalStatus}`}>{r.approvalStatus}</span></td>
                  <td className="td text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={5} className="td text-center text-gray-400 py-12">
                    No requests yet. <Link to="/dashboard/requestor" className="text-primary-600 underline">Raise your first request</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
