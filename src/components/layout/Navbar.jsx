import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  FiHome,
  FiActivity,
  FiBook,
  FiCoffee,
  FiBarChart2,
  FiTarget,
  FiTrendingUp,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX
} from "react-icons/fi";
import { useState, useRef, useEffect } from "react";

const navLinks = [
  { to: "/dashboard", label: "Dashboard", icon: FiHome },
  { to: "/workouts", label: "Workouts", icon: FiActivity },
  { to: "/exercises", label: "Exercises", icon: FiBook },
  { to: "/nutrition", label: "Nutrition", icon: FiCoffee },
  { to: "/body", label: "Body", icon: FiBarChart2 },
  { to: "/goals", label: "Goals", icon: FiTarget },
  { to: "/progress", label: "Progress", icon: FiTrendingUp },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => {
    if (path === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setAvatarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="navbar bg-base-100 border-b border-base-300 px-4 sm:px-6 sticky top-0 z-50">
      <div className="navbar-start">
        <button
          className="btn btn-ghost btn-square lg:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
        <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold text-primary no-underline ml-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <FiActivity className="text-primary-content" size={18} />
          </div>
          <span className="hidden sm:inline">FitTrack</span>
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="flex gap-1">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors no-underline ${
                  isActive(link.to)
                    ? "bg-primary/10 text-primary"
                    : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                }`}
              >
                <link.icon size={16} />
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="navbar-end gap-2">
        <button
          onClick={handleLogout}
          className="btn btn-ghost btn-sm gap-1.5 text-base-content/60 hover:text-error hidden sm:flex"
          title="Logout"
        >
          <FiLogOut size={16} />
          <span className="text-sm">Logout</span>
        </button>

        <div className="relative" ref={avatarRef}>
          <button
            onClick={() => setAvatarOpen(!avatarOpen)}
            className="w-9 h-9 bg-primary text-primary-content rounded-full flex items-center justify-center text-sm font-bold hover:ring-2 hover:ring-primary/30 transition-all cursor-pointer"
          >
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </button>

          {avatarOpen && (
            <div className="absolute right-0 top-12 w-56 bg-base-100 rounded-xl shadow-lg border border-base-200 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-base-200">
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="text-xs text-base-content/50">{user?.email}</p>
              </div>
              <div className="p-2">
                <Link
                  to="/settings"
                  onClick={() => setAvatarOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-base-200 transition-colors no-underline text-base-content"
                >
                  <FiSettings size={16} />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-error hover:bg-error/10 transition-colors"
                >
                  <FiLogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-base-100 border-b border-base-200 shadow-lg lg:hidden z-40">
          <ul className="menu p-4 space-y-1">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`${isActive(link.to) ? "active font-semibold" : ""}`}
                >
                  <link.icon size={18} />
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-2 border-t border-base-200 pt-2">
              <button onClick={handleLogout} className="text-error">
                <FiLogOut size={18} />
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}