import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  FiGrid,
  FiUsers,
  FiActivity,
  FiArrowLeft,
  FiLogOut,
  FiShield,
} from "react-icons/fi";

const adminLinks = [
  { to: "/admin", label: "Overview", icon: FiGrid, exact: true },
  { to: "/admin/users", label: "Users", icon: FiUsers },
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (link) =>
    link.exact ? location.pathname === link.to : location.pathname.startsWith(link.to);

  return (
    <div className="min-h-screen bg-base-200 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-base-100 border-r border-base-200 flex flex-col fixed h-full">
        <div className="p-5 border-b border-base-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-error rounded-lg flex items-center justify-center">
              <FiShield className="text-error-content" size={16} />
            </div>
            <div>
              <p className="font-bold text-sm">FitTrack Admin</p>
              <p className="text-xs text-base-content/50">{user?.name}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {adminLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors no-underline ${
                isActive(link)
                  ? "bg-error/10 text-error"
                  : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
              }`}
            >
              <link.icon size={18} />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-base-200 space-y-1">
          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-base-content/70 hover:bg-base-200 transition-colors no-underline"
          >
            <FiArrowLeft size={18} />
            Back to App
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-error hover:bg-error/10 transition-colors"
          >
            <FiLogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}