import { useState } from "react";
import { settingsAPI } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { FiUser, FiLock, FiLogOut } from "react-icons/fi";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ name: user?.name || "", email: user?.email || "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    try {
      await settingsAPI.updateProfile(profile);
      toast.success("Profil diupdate");
    } catch (err) {
      toast.error(err.response?.data?.error || "Gagal update profil");
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Password baru tidak cocok");
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }
    setLoadingPassword(true);
    try {
      await settingsAPI.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      toast.success("Password berhasil diganti");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.error || "Gagal ganti password");
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-base-content/60 mt-1">Kelola profil dan keamanan akun</p>
      </div>

      {/* Profile */}
      <div className="bg-base-100 rounded-2xl border border-base-200 p-6">
        <h2 className="font-semibold text-sm mb-4 flex items-center gap-2">
          <FiUser className="text-primary" size={18} /> Profil
        </h2>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nama</label>
            <input
              type="text"
              className="input input-bordered w-full input-sm"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="input input-bordered w-full input-sm"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </div>
          <button type="submit" className={`btn btn-primary btn-sm ${loadingProfile ? "loading" : ""}`} disabled={loadingProfile}>
            {loadingProfile ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>
      </div>

      {/* Password */}
      <div className="bg-base-100 rounded-2xl border border-base-200 p-6">
        <h2 className="font-semibold text-sm mb-4 flex items-center gap-2">
          <FiLock className="text-error" size={18} /> Ganti Password
        </h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Password Sekarang</label>
            <input
              type="password"
              className="input input-bordered w-full input-sm"
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password Baru</label>
            <input
              type="password"
              className="input input-bordered w-full input-sm"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              minLength={6}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Konfirmasi Password Baru</label>
            <input
              type="password"
              className="input input-bordered w-full input-sm"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              required
            />
          </div>
          <button type="submit" className={`btn btn-error btn-sm ${loadingPassword ? "loading" : ""}`} disabled={loadingPassword}>
            {loadingPassword ? "Menyimpan..." : "Ganti Password"}
          </button>
        </form>
      </div>

      {/* Logout */}
      <div className="bg-base-100 rounded-2xl border border-base-200 p-6">
        <h2 className="font-semibold text-sm mb-4 flex items-center gap-2">
          <FiLogOut className="text-error" size={18} /> Sesi
        </h2>
        <p className="text-sm text-base-content/60 mb-4">
          Login sebagai <span className="font-medium text-base-content">{user?.email}</span>
        </p>
        <button onClick={handleLogout} className="btn btn-error btn-sm gap-2">
          <FiLogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
}