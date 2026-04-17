import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard, ClipboardList, Users, Building2, UserCheck,
  Layers, FileText, GitBranch, Tag, X, Ticket, LogOut,
} from "lucide-react";

const NavItem = ({ to, icon: Icon, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
    }
  >
    <Icon size={18} />
    <span>{label}</span>
  </NavLink>
);

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const isAdmin = ["ADMIN", "HOD"].includes(user?.role);

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-40
          flex flex-col transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Ticket size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-tight">SRM System</p>
              <p className="text-xs text-gray-400">Service Requests</p>
            </div>
          </div>
          <button className="lg:hidden btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          <NavItem to="/" icon={LayoutDashboard} label="Dashboard" onClick={onClose} />

          <p className="sidebar-section">Dashboards</p>
          <NavItem to="/dashboard/requestor" icon={ClipboardList} label="My Requests" onClick={onClose} />
          {isAdmin && (
            <NavItem to="/dashboard/hod" icon={UserCheck} label="HOD Dashboard" onClick={onClose} />
          )}
          {["ADMIN", "HOD", "TECHNICIAN"].includes(user?.role) && (
            <NavItem to="/dashboard/technician" icon={Layers} label="Technician View" onClick={onClose} />
          )}

          {isAdmin && (
            <>
              <p className="sidebar-section">Master Setup</p>
              <NavItem to="/masters/status"       icon={Tag}       label="Request Status"  onClick={onClose} />
              <NavItem to="/masters/department"   icon={Building2} label="Departments"     onClick={onClose} />
              <NavItem to="/masters/person"       icon={Users}     label="Staff Mapping"   onClick={onClose} />
              <NavItem to="/masters/service-type" icon={FileText}  label="Service Types"   onClick={onClose} />
              <NavItem to="/masters/request-type" icon={FileText}  label="Request Types"   onClick={onClose} />
              <NavItem to="/masters/mapping"      icon={GitBranch} label="Type-Person Map" onClick={onClose} />
              <NavItem to="/masters/users"        icon={Users}     label="Users"           onClick={onClose} />
            </>
          )}
        </nav>

        {/* User info & logout */}
        <div className="border-t border-gray-200 p-3">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg mb-1">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary-700 font-bold text-sm">
                {user?.name?.[0]?.toUpperCase() || "?"}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={17} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
