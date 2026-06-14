import { useState } from "react";
import { workoutAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import toast from "react-hot-toast";

export default function CreateWorkout() {
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await workoutAPI.create({ name, notes, date: new Date().toISOString() });
      toast.success("Workout berhasil dibuat!");
      navigate(`/workouts/${res.data.id}`);
    } catch {
      toast.error("Gagal membuat workout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm gap-2 mb-6">
        <FiArrowLeft size={16} /> Kembali
      </button>

      <div className="bg-base-100 rounded-2xl border border-base-200 p-6">
        <h1 className="text-xl font-bold mb-6">Workout Baru</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Nama Workout</label>
            <input
              type="text"
              placeholder="contoh: Push Day A"
              className="input input-bordered w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Catatan</label>
            <textarea
              placeholder="Catatan opsional..."
              className="textarea textarea-bordered w-full"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className={`btn btn-primary flex-1 ${loading ? "loading" : ""}`} disabled={loading}>
              {loading ? "Membuat..." : "Buat Workout"}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn btn-ghost">
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}