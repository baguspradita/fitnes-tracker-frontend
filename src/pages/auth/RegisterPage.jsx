import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";
import { FiActivity, FiUser, FiMail, FiLock, FiArrowRight } from "react-icons/fi";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Konfirmasi password tidak cocok");
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success("Registrasi berhasil!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registrasi gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12">
        <div className="max-w-md text-primary-content">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary-content/20 rounded-xl flex items-center justify-center">
              <FiActivity size={24} />
            </div>
            <span className="text-2xl font-bold">FitTrack</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Mulai perjalanan<br />fitness kamu hari ini.
          </h2>
          <p className="text-primary-content/70 text-lg">
            Buat akun gratis dan mulai catat setiap set, reps, dan progres latihan kamu.
          </p>
          <ul className="mt-8 space-y-3 text-sm">
            {["Catat workout dengan mudah", "Lihat grafik progres otomatis", "Track nutrisi & body measurement"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="w-5 h-5 bg-primary-content/20 rounded-full flex items-center justify-center text-xs">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right side — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-base-200">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <FiActivity className="text-primary-content" size={20} />
            </div>
            <span className="text-xl font-bold text-base-content">FitTrack</span>
          </div>

          <h1 className="text-2xl font-bold text-base-content mb-1">Buat akun baru</h1>
          <p className="text-base-content/60 mb-8">Gratis, tanpa subscription</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-base-content mb-2">Nama</label>
              <label className="input input-bordered w-full flex items-center gap-3">
                <FiUser className="text-base-content/40 shrink-0" size={18} />
                <input
                  type="text"
                  placeholder="Nama lengkap"
                  className="grow"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-base-content mb-2">Email</label>
              <label className="input input-bordered w-full flex items-center gap-3">
                <FiMail className="text-base-content/40 shrink-0" size={18} />
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="grow"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-base-content mb-2">Password</label>
              <label className="input input-bordered w-full flex items-center gap-3">
                <FiLock className="text-base-content/40 shrink-0" size={18} />
                <input
                  type="password"
                  placeholder="Minimal 6 karakter"
                  className="grow"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-base-content mb-2">Konfirmasi Password</label>
              <label className="input input-bordered w-full flex items-center gap-3">
                <FiLock className="text-base-content/40 shrink-0" size={18} />
                <input
                  type="password"
                  placeholder="Ulangi password"
                  className="grow"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </label>
            </div>

            <button
              type="submit"
              className={`btn btn-primary w-full gap-2 ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {!loading && <FiArrowRight size={18} />}
              {loading ? "Memproses..." : "Daftar"}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-base-content/60">
            Sudah punya akun?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}