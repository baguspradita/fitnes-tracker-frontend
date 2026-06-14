import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";
import { FiActivity, FiMail, FiLock, FiArrowRight, FiBarChart2, FiAward } from "react-icons/fi";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Login berhasil!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || "Login gagal");
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
            Track your workouts,<br />see your progress.
          </h2>
          <p className="text-primary-content/70 text-lg">
            Catat latihan, lihat grafik progres, dan capai target fitness kamu — semuanya dalam satu tempat.
          </p>
          <div className="mt-10 flex gap-6">
            <div>
              <p className="text-2xl font-bold">41+</p>
              <p className="text-xs text-primary-content/60">Exercises</p>
            </div>
            <div>
              <FiBarChart2 size={28} className="mb-1" />
              <p className="text-xs text-primary-content/60">Progress Charts</p>
            </div>
            <div>
              <FiAward size={28} className="mb-1" />
              <p className="text-xs text-primary-content/60">Personal Records</p>
            </div>
          </div>
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

          <h1 className="text-2xl font-bold text-base-content mb-1">Selamat datang kembali</h1>
          <p className="text-base-content/60 mb-8">Masuk ke akun kamu untuk lanjut tracking</p>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  placeholder="••••••••"
                  className="grow"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-base-content/60">
            Belum punya akun?{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}