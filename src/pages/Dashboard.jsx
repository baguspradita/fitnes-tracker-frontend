import { useState, useEffect } from "react";
import { dashboardAPI, workoutAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { FiActivity, FiTrendingUp, FiAward, FiCalendar, FiPlus, FiBookOpen, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([dashboardAPI.summary(), workoutAPI.getAll()])
      .then(([sumRes, wkRes]) => {
        setSummary(sumRes.data);
        setRecentWorkouts(wkRes.data.slice(0, 5));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-dots loading-lg text-primary"></span>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Workouts",
      value: summary?.totalWorkouts || 0,
      icon: FiActivity,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Streak",
      value: `${summary?.streak || 0} hari`,
      icon: FiCalendar,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Volume Minggu Ini",
      value: `${(summary?.weeklyVolume || 0).toLocaleString()} kg`,
      icon: FiTrendingUp,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      label: "Personal Records",
      value: summary?.personalRecords?.length || 0,
      icon: FiAward,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-base-content">
            Halo, {user?.name}! 
          </h1>
          <p className="text-sm text-base-content/60 mt-1">
            Ringkasan progress fitness kamu
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/workouts/new" className="btn btn-primary btn-sm gap-2">
            <FiPlus size={16} /> Workout Baru
          </Link>
          <Link to="/exercises" className="btn btn-ghost btn-sm gap-2">
            <FiBookOpen size={16} /> Exercises
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-base-100 rounded-2xl p-5 border border-base-200 hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className={stat.color} size={20} />
            </div>
            <p className="text-xs font-medium text-base-content/50 uppercase tracking-wide">
              {stat.label}
            </p>
            <p className="text-2xl font-bold text-base-content mt-1">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Workouts */}
        <div className="lg:col-span-2 bg-base-100 rounded-2xl border border-base-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-base-200">
            <h2 className="font-semibold text-base-content">Workout Terakhir</h2>
            <Link to="/workouts" className="text-sm text-primary hover:underline flex items-center gap-1">
              Lihat semua <FiChevronRight size={14} />
            </Link>
          </div>
          <div className="p-4">
            {recentWorkouts.length === 0 ? (
              <div className="text-center py-12">
                <FiActivity size={40} className="mx-auto mb-3 text-base-content/20" />
                <p className="text-sm text-base-content/50">
                  Belum ada workout. Mulai workout pertamamu!
                </p>
                <Link to="/workouts/new" className="btn btn-primary btn-sm mt-4 gap-2">
                  <FiPlus size={16} /> Buat Workout
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {recentWorkouts.map((w) => (
                  <Link
                    key={w.id}
                    to={`/workouts/${w.id}`}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-base-200/50 transition-colors no-underline group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <FiActivity className="text-primary" size={18} />
                      </div>
                      <div>
                        <p className="font-medium text-base-content text-sm">
                          {w.name || "Unnamed Workout"}
                        </p>
                        <p className="text-xs text-base-content/50">
                          {new Date(w.date).toLocaleDateString("id-ID", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          })}{" "}
                          · {w.workoutExercises?.length || 0} exercises
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {w.completed ? (
                        <span className="badge badge-success badge-sm">Selesai</span>
                      ) : (
                        <span className="badge badge-ghost badge-sm">Draft</span>
                      )}
                      <FiChevronRight
                        size={16}
                        className="text-base-content/30 group-hover:text-primary transition-colors"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Personal Records */}
        <div className="bg-base-100 rounded-2xl border border-base-200">
          <div className="px-6 py-4 border-b border-base-200">
            <h2 className="font-semibold text-base-content flex items-center gap-2">
              <FiAward className="text-amber-500" size={18} /> Personal Records
            </h2>
          </div>
          <div className="p-4">
            {!summary?.personalRecords?.length ? (
              <div className="text-center py-8">
                <FiAward size={32} className="mx-auto mb-2 text-base-content/20" />
                <p className="text-sm text-base-content/50">
                  Selesaikan workout untuk mendapat PR
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {summary.personalRecords.map((pr, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-amber-50/50 border border-amber-100"
                  >
                    <p className="text-xs font-medium text-base-content/60">
                      {pr.exercise}
                    </p>
                    <p className="text-xl font-bold text-amber-700">
                      {pr.e1RM} <span className="text-sm font-normal">kg</span>
                    </p>
                    <p className="text-xs text-base-content/50">
                      {pr.weightKg} kg × {pr.reps} reps (est. 1RM)
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}