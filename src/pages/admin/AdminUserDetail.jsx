import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { adminAPI } from "../../services/api";
import { FiArrowLeft, FiActivity, FiCoffee, FiTarget, FiBarChart2, FiUserX, FiUserCheck, FiShield } from "react-icons/fi";
import toast from "react-hot-toast";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = () => {
    adminAPI.getUser(id)
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUser(); }, [id]);

  const handleToggleActive = async () => {
    try {
      await adminAPI.updateUser(id, { isActive: !data.user.isActive });
      toast.success(data.user.isActive ? "User dinonaktifkan" : "User diaktifkan");
      fetchUser();
    } catch (err) {
      toast.error(err.response?.data?.error || "Gagal");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-dots loading-lg text-error"></span>
      </div>
    );
  }

  if (!data) {
    return <div className="text-center py-20 text-base-content/50">User tidak ditemukan</div>;
  }

  const { user, recentWorkouts, recentNutrition, goals, latestBody, weeklyWorkouts } = data;

  const weeklyChart = weeklyWorkouts?.length ? {
    labels: weeklyWorkouts.map((w) =>
      new Date(w.weekStart).toLocaleDateString("id-ID", { day: "numeric", month: "short" })
    ),
    datasets: [{
      label: "Workouts",
      data: weeklyWorkouts.map((w) => w.count),
      backgroundColor: "rgba(99, 102, 241, 0.6)",
      borderRadius: 6,
    }],
  } : null;

  return (
    <div className="space-y-6">
      <button onClick={() => navigate("/admin/users")} className="btn btn-ghost btn-sm gap-2">
        <FiArrowLeft size={16} /> Kembali
      </button>

      {/* User Info */}
      <div className="bg-base-100 rounded-2xl border border-base-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-error/10 rounded-full flex items-center justify-center text-xl font-bold text-error">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                {user.name}
                {user.role === "ADMIN" && <FiShield className="text-error" size={18} />}
              </h1>
              <p className="text-sm text-base-content/60">{user.email}</p>
              <p className="text-xs text-base-content/40 mt-1">
                Bergabung: {new Date(user.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleToggleActive}
              className={`btn btn-sm gap-1 ${user.isActive ? "btn-warning" : "btn-success"}`}
            >
              {user.isActive ? <><FiUserX size={14} /> Ban</> : <><FiUserCheck size={14} /> Activate</>}
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: "Workouts", value: user._count.workouts, icon: FiActivity, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Custom Ex.", value: user._count.exercises, icon: FiActivity, color: "text-violet-600", bg: "bg-violet-50" },
          { label: "Nutrition Logs", value: user._count.nutritionLogs, icon: FiCoffee, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Body Measures", value: user._count.bodyMeasurements, icon: FiBarChart2, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Goals", value: user._count.goals, icon: FiTarget, color: "text-rose-600", bg: "bg-rose-50" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4`}>
            <p className="text-xs font-medium text-base-content/50 uppercase">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color} mt-1`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Workout Chart */}
        <div className="bg-base-100 rounded-2xl border border-base-200 p-6">
          <h2 className="font-semibold text-sm mb-4">Aktivitas Workout (8 Minggu)</h2>
          <div className="h-48">
            {weeklyChart ? (
              <Bar data={weeklyChart} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} />
            ) : (
              <p className="text-center text-base-content/50 py-12">Belum ada data</p>
            )}
          </div>
        </div>

        {/* Latest Body */}
        <div className="bg-base-100 rounded-2xl border border-base-200 p-6">
          <h2 className="font-semibold text-sm mb-4">Body Measurement Terakhir</h2>
          {latestBody ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-base-content/50">Berat</p>
                <p className="text-lg font-bold">{parseFloat(latestBody.weightKg)} kg</p>
              </div>
              {latestBody.bodyFatPct && (
                <div>
                  <p className="text-xs text-base-content/50">Body Fat</p>
                  <p className="text-lg font-bold">{parseFloat(latestBody.bodyFatPct)}%</p>
                </div>
              )}
              {latestBody.muscleMassKg && (
                <div>
                  <p className="text-xs text-base-content/50">Muscle Mass</p>
                  <p className="text-lg font-bold">{parseFloat(latestBody.muscleMassKg)} kg</p>
                </div>
              )}
              {latestBody.waistCm && (
                <div>
                  <p className="text-xs text-base-content/50">Pinggang</p>
                  <p className="text-lg font-bold">{parseFloat(latestBody.waistCm)} cm</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-base-content/50 text-sm">Belum ada data</p>
          )}
        </div>
      </div>

      {/* Recent Workouts */}
      <div className="bg-base-100 rounded-2xl border border-base-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-base-200">
          <h2 className="font-semibold text-sm">Workout Terakhir</h2>
        </div>
        {recentWorkouts.length === 0 ? (
          <div className="p-6 text-center text-base-content/50 text-sm">Belum ada workout</div>
        ) : (
          <div className="divide-y divide-base-200">
            {recentWorkouts.map((w) => (
              <div key={w.id} className="flex items-center justify-between px-6 py-3">
                <div>
                  <p className="text-sm font-medium">{w.name || "Unnamed"}</p>
                  <p className="text-xs text-base-content/50">
                    {new Date(w.date).toLocaleDateString("id-ID")} - {w._count.workoutExercises} exercises
                  </p>
                </div>
                {w.completed ? (
                  <span className="badge badge-success badge-sm">Selesai</span>
                ) : (
                  <span className="badge badge-ghost badge-sm">Draft</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Goals */}
      {goals.length > 0 && (
        <div className="bg-base-100 rounded-2xl border border-base-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-base-200">
            <h2 className="font-semibold text-sm">Goals</h2>
          </div>
          <div className="divide-y divide-base-200">
            {goals.map((g) => (
              <div key={g.id} className="flex items-center justify-between px-6 py-3">
                <div>
                  <p className="text-sm font-medium">{g.type} - Target: {parseFloat(g.targetValue)}</p>
                  {g.exercise && <p className="text-xs text-base-content/50">{g.exercise.name}</p>}
                </div>
                {g.achieved ? (
                  <span className="badge badge-success badge-sm">Tercapai</span>
                ) : (
                  <span className="badge badge-ghost badge-sm">Aktif</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}