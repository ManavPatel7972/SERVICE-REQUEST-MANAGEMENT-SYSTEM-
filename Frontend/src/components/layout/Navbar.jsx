import { Menu, Bell } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";

const routeTitles = {
  "/": "Dashboard",
  "/dashboard/requestor": "My Requests",
  "/dashboard/hod": "HOD Dashboard",
  "/dashboard/technician": "Technician Dashboard",
  "/masters/status": "Request Status Master",
  "/masters/department": "Department Master",
  "/masters/person": "Staff Mapping",
  "/masters/service-type": "Service Type Master",
  "/masters/request-type": "Request Type Master",
  "/masters/mapping": "Type-Person Mapping",
  "/masters/users": "User Management",
};

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const title = routeTitles[pathname] || "Service Request Management";

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button className="btn-icon lg:hidden" onClick={onMenuClick}>
          <Menu size={20} />
        </button>
        <h1 className="text-base font-semibold text-gray-800">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button className="btn-icon relative">
          <Bell size={18} className="text-gray-500" />
        </button>
        <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xs">
              {user?.name?.[0]?.toUpperCase() || "?"}
            </span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800 leading-tight">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
