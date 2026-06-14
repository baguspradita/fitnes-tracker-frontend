import { useState, useEffect } from "react";
import { workoutAPI } from "../../services/api";
import { Link } from "react-router-dom";
import { FiPlus, FiActivity, FiTrash2, FiChevronRight } from "react-icons/fi";
import toast from "react-hot-toast";

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkouts = () => {
    workoutAPI.getAll()
      .then((res) => setWorkouts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchWorkouts(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Hapus workout ini?")) return;
    try {
      await workoutAPI.delete(id);
      toast.success("Workout dihapus");
      fetchWorkouts();
    } catch {
      toast.error("Gagal menghapus workout");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-dots loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Workouts</h1>
          <p className="text-sm text-base-content/60 mt-1">Daftar semua workout kamu</p>
        </div>
        <Link to="/workouts/new" className="btn btn-primary btn-sm gap-2">
          <FiPlus size={16} /> Workout Baru
        </Link>
      </div>

      {workouts.length === 0 ? (
        <div className="text-center py-16 bg-base-100 rounded-2xl border border-base-200">
          <FiActivity size={48} className="mx-auto mb-3 text-base-content/20" />
          <p className="text-base-content/50 mb-4">Belum ada workout</p>
          <Link to="/workouts/new" className="btn btn-primary btn-sm gap-2">
            <FiPlus size={16} /> Buat Workout Pertama
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {workouts.map((w) => (
            <div
              key={w.id}
              className="bg-base-100 rounded-2xl border border-base-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <Link to={`/workouts/${w.id}`} className="flex items-center gap-3 flex-1 no-underline">
                  <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center">
                    <FiActivity className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-base-content text-sm">
                      {w.name || "Unnamed Workout"}
                    </p>
                    <p className="text-xs text-base-content/50">
                      {new Date(w.date).toLocaleDateString("id-ID", {
                        weekday: "long", day: "numeric", month: "long", year: "numeric",
                      })}
                    </p>
                  </div>
                </Link>
                <div className="flex items-center gap-2">
                  {w.completed ? (
                    <span className="badge badge-success badge-sm">Selesai</span>
                  ) : (
                    <span className="badge badge-ghost badge-sm">Draft</span>
                  )}
                  <span className="text-xs text-base-content/40">
                    {w.workoutExercises?.length || 0} ex
                  </span>
                  <button
                    onClick={() => handleDelete(w.id)}
                    className="btn btn-ghost btn-xs btn-square text-error/60 hover:text-error"
                  >
                    <FiTrash2 size={14} />
                  </button>
                  <Link to={`/workouts/${w.id}`}>
                    <FiChevronRight className="text-base-content/30" size={18} />
                  </Link>
                </div>
              </div>
              {w.notes && (
                <p className="text-xs text-base-content/50 mt-2 ml-14">{w.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}