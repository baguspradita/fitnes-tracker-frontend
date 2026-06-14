import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { workoutAPI, exerciseAPI } from "../../services/api";
import { FiArrowLeft, FiPlus, FiTrash2, FiCheck, FiX, FiAward } from "react-icons/fi";
import toast from "react-hot-toast";

export default function WorkoutDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [showSetForm, setShowSetForm] = useState(null);
  const [setForm, setSetForm] = useState({ reps: "", weightKg: "", rpe: "", isWarmup: false });
  const [search, setSearch] = useState("");

  const fetchWorkout = () => {
    workoutAPI.getById(id)
      .then((res) => setWorkout(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchWorkout();
    exerciseAPI.getAll().then((res) => setExercises(res.data)).catch(console.error);
  }, [id]);

  const handleAddExercise = async (exerciseId) => {
    try {
      await workoutAPI.addExercise(id, { exerciseId });
      toast.success("Exercise ditambahkan");
      setShowExerciseModal(false);
      fetchWorkout();
    } catch {
      toast.error("Gagal menambah exercise");
    }
  };

  const handleRemoveExercise = async (weId) => {
    if (!confirm("Hapus exercise ini?")) return;
    try {
      await workoutAPI.removeExercise(id, weId);
      toast.success("Exercise dihapus");
      fetchWorkout();
    } catch {
      toast.error("Gagal menghapus exercise");
    }
  };

  const handleAddSet = async (weId) => {
    try {
      const data = {
        reps: parseInt(setForm.reps),
        weightKg: setForm.weightKg ? parseFloat(setForm.weightKg) : null,
        rpe: setForm.rpe ? parseFloat(setForm.rpe) : null,
        isWarmup: setForm.isWarmup,
      };
      await workoutAPI.addSet(weId, data);
      toast.success("Set ditambahkan");
      setShowSetForm(null);
      setSetForm({ reps: "", weightKg: "", rpe: "", isWarmup: false });
      fetchWorkout();
    } catch {
      toast.error("Gagal menambah set");
    }
  };

  const handleDeleteSet = async (setId) => {
    try {
      await workoutAPI.deleteSet(setId);
      toast.success("Set dihapus");
      fetchWorkout();
    } catch {
      toast.error("Gagal menghapus set");
    }
  };

  const handleComplete = async () => {
    try {
      await workoutAPI.update(id, { completed: true });
      toast.success("Workout selesai!");
      fetchWorkout();
    } catch {
      toast.error("Gagal menyelesaikan workout");
    }
  };

  const filteredExercises = exercises.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-dots loading-lg text-primary"></span>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="text-center py-20">
        <p className="text-base-content/50">Workout tidak ditemukan</p>
        <Link to="/workouts" className="btn btn-primary btn-sm mt-4">Kembali</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button onClick={() => navigate("/workouts")} className="btn btn-ghost btn-sm gap-2">
        <FiArrowLeft size={16} /> Kembali
      </button>

      {/* Header */}
      <div className="bg-base-100 rounded-2xl border border-base-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{workout.name || "Unnamed Workout"}</h1>
            <p className="text-sm text-base-content/60 mt-1">
              {new Date(workout.date).toLocaleDateString("id-ID", {
                weekday: "long", day: "numeric", month: "long", year: "numeric",
              })}
              {workout.durationMin && ` · ${workout.durationMin} menit`}
            </p>
          </div>
          {workout.completed ? (
            <span className="badge badge-success gap-1"><FiCheck size={14} /> Selesai</span>
          ) : (
            <button onClick={handleComplete} className="btn btn-success btn-sm gap-1">
              <FiCheck size={14} /> Selesai
            </button>
          )}
        </div>
        {workout.notes && (
          <p className="text-sm text-base-content/60 mt-3 bg-base-200/50 rounded-lg p-3">{workout.notes}</p>
        )}
      </div>

      {/* Exercises */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Exercises</h2>
          <button onClick={() => setShowExerciseModal(true)} className="btn btn-primary btn-sm gap-2">
            <FiPlus size={16} /> Tambah Exercise
          </button>
        </div>

        {workout.workoutExercises?.length === 0 ? (
          <div className="text-center py-12 bg-base-100 rounded-2xl border border-base-200">
            <p className="text-base-content/50">Belum ada exercise. Tambahkan exercise dari library.</p>
          </div>
        ) : (
          workout.workoutExercises?.map((we) => (
            <div key={we.id} className="bg-base-100 rounded-2xl border border-base-200 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 bg-base-200/30">
                <div>
                  <p className="font-semibold text-sm">{we.exercise.name}</p>
                  <p className="text-xs text-base-content/50">
                    {we.exercise.muscleGroup} · {we.exercise.category}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveExercise(we.id)}
                  className="btn btn-ghost btn-xs text-error/60 hover:text-error"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>

              <div className="p-4">
                {/* Sets Table */}
                {we.sets?.length > 0 && (
                  <div className="mb-3">
                    <table className="table table-sm">
                      <thead>
                        <tr className="text-xs text-base-content/50">
                          <th className="w-10">#</th>
                          <th>Reps</th>
                          <th>Berat (kg)</th>
                          <th>RPE</th>
                          <th>Tipe</th>
                          <th className="w-10"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {we.sets.map((set) => (
                          <tr key={set.id} className="text-sm">
                            <td className="font-medium">{set.setNumber}</td>
                            <td>{set.reps}</td>
                            <td>{set.weightKg ? `${set.weightKg} kg` : "-"}</td>
                            <td>{set.rpe || "-"}</td>
                            <td>
                              {set.isWarmup ? (
                                <span className="badge badge-ghost badge-xs">Warm-up</span>
                              ) : (
                                <span className="badge badge-primary badge-xs">Working</span>
                              )}
                            </td>
                            <td>
                              <button
                                onClick={() => handleDeleteSet(set.id)}
                                className="btn btn-ghost btn-xs text-error/50 hover:text-error"
                              >
                                <FiX size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Add Set Form */}
                {showSetForm === we.id ? (
                  <div className="bg-base-200/50 rounded-xl p-4 space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-medium">Reps *</label>
                        <input
                          type="number"
                          min="1"
                          placeholder="10"
                          className="input input-bordered input-sm w-full"
                          value={setForm.reps}
                          onChange={(e) => setSetForm({ ...setForm, reps: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium">Berat (kg)</label>
                        <input
                          type="number"
                          step="0.5"
                          placeholder="60"
                          className="input input-bordered input-sm w-full"
                          value={setForm.weightKg}
                          onChange={(e) => setSetForm({ ...setForm, weightKg: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium">RPE</label>
                        <input
                          type="number"
                          step="0.5"
                          min="1"
                          max="10"
                          placeholder="8"
                          className="input input-bordered input-sm w-full"
                          value={setForm.rpe}
                          onChange={(e) => setSetForm({ ...setForm, rpe: e.target.value })}
                        />
                      </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={setForm.isWarmup}
                        onChange={(e) => setSetForm({ ...setForm, isWarmup: e.target.checked })}
                      />
                      <span className="text-sm">Warm-up set</span>
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddSet(we.id)}
                        className="btn btn-primary btn-sm"
                        disabled={!setForm.reps}
                      >
                        Simpan Set
                      </button>
                      <button
                        onClick={() => setShowSetForm(null)}
                        className="btn btn-ghost btn-sm"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowSetForm(we.id)}
                    className="btn btn-outline btn-sm w-full gap-2"
                  >
                    <FiPlus size={14} /> Tambah Set
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Exercise Picker Modal */}
      {showExerciseModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-lg">
            <h3 className="font-bold text-lg mb-4">Pilih Exercise</h3>
            <input
              type="text"
              placeholder="Cari exercise..."
              className="input input-bordered w-full mb-4"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="max-h-80 overflow-y-auto space-y-1">
              {filteredExercises.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => handleAddExercise(ex.id)}
                  className="w-full text-left p-3 rounded-xl hover:bg-base-200 transition-colors"
                >
                  <p className="font-medium text-sm">{ex.name}</p>
                  <p className="text-xs text-base-content/50">
                    {ex.muscleGroup} · {ex.category} {ex.isCustom && "· Custom"}
                  </p>
                </button>
              ))}
            </div>
            <div className="modal-action">
              <button onClick={() => setShowExerciseModal(false)} className="btn btn-ghost">Tutup</button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowExerciseModal(false)}></div>
        </div>
      )}
    </div>
  );
}