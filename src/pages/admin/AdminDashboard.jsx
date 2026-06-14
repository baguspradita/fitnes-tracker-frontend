import { useState, useEffect } from "react";
import { adminAPI } from "../../services/api";
import { FiUsers, FiActivity, FiBook, FiLayers, FiTrendingUp, FiUserPlus, FiCalendar } from "react-icons/fi";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend, Filler } from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend, Filler);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats()
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-dots loading-lg text-error"></span>
      </div>
    );
  }

  const cards = [
    { label: "Total Users", value: stats?.totalUsers || 0, icon: FiUsers, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Workouts", value: stats?.totalWorkouts || 0, icon: FiActivity, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Total Exercises", value: stats?.totalExercises || 0, icon: FiBook, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Total Sets", value: stats?.totalSets || 0, icon: FiLayers, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Active Users (7d)", value: stats?.activeUsersLast7Days || 0, icon: FiTrendingUp, color: "text-rose-600", bg: "bg-rose-50" },
    { label: "New Users (Bulan Ini)", value: stats?.newUsersThisMonth || 0, icon: FiUserPlus, color: "text-cyan-600", bg: "bg-cyan-50" },
    { label: "Workouts (7d)", value: stats?.workoutsLast7Days || 0, icon: FiActivity, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Workouts (30d)", value: stats?.workoutsLast30Days || 0, icon: FiCalendar, color: "text-teal-600", bg: "bg-teal-50" },
  ];

  const userGrowthChart = stats?.userGrowth ? {
    labels: stats.userGrowth.map((w) =>
      new Date(w.weekStart).toLocaleDateString("id-ID", { day: "numeric", month: "short" })
    ),
    datasets: [{
      label: "New Users",
      data: stats.userGrowth.map((w) => w.count),
      borderColor: "rgb(59, 130, 246)",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      fill: true,
      tension: 0.3,
      pointRadius: 4,
    }],
  } : null;

  const workoutActivityChart = stats?.workoutActivity ? {
    labels: stats.workoutActivity.map((d) =>
      new Date(d.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })
    ),
    datasets: [{
      label: "Workouts",
      data: stats.workoutActivity.map((d) => d.count),
      backgroundColor: "rgba(16, 185, 129, 0.6)",
      borderRadius: 6,
    }],
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Admin Overview</h1>
        <p className="text-sm text-base-content/60 mt-1">Monitoring aktivitas seluruh user</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-base-100 rounded-2xl p-5 border border-base-200">
            <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
              <card.icon className={card.color} size={20} />
            </div>
            <p className="text-xs font-medium text-base-content/50 uppercase tracking-wide">{card.label}</p>
            <p className="text-2xl font-bold text-base-content mt-1">{card.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-base-100 rounded-2xl border border-base-200 p-6">
          <h2 className="font-semibold text-sm mb-4">User Growth (8 Minggu)</h2>
          <div className="h-56">
            {userGrowthChart ? <Line data={userGrowthChart} options={chartOptions} /> : <p className="text-center text-base-content/50 py-16">Belum ada data</p>}
          </div>
        </div>
        <div className="bg-base-100 rounded-2xl border border-base-200 p-6">
          <h2 className="font-semibold text-sm mb-4">Workout Activity (14 Hari)</h2>
          <div className="h-56">
            {workoutActivityChart ? <Bar data={workoutActivityChart} options={chartOptions} /> : <p className="text-center text-base-content/50 py-16">Belum ada data</p>}
          </div>
        </div>
      </div>
    </div>
  );
}