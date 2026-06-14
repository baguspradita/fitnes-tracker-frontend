import { useState, useEffect } from "react";
import { goalAPI } from "../../services/api";
import { FiPlus, FiTrash2, FiTarget, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";

const TYPE_LABELS = { WEIGHT: "Berat Badan", STRENGTH: "Kekuatan", BODY_FAT: "Body Fat", CUSTOM: "Custom" };
const TYPE_COLORS = { WEIGHT: "bg-blue-50 text-blue-700", STRENGTH: "bg-red-50 text-red-700", BODY_FAT: "bg-purple-50 text-purple-700", CUSTOM: "bg-gray-50 text-gray-700" };

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ type: "WEIGHT", targetValue: "", deadline: "" });

  const fetchData = () => {
    goalAPI.getAll()
      .then((res) => setGoals(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async () => {
    if (!form.targetValue) { toast.error("Target value wajib diisi"); return; }
    try {
      await goalAPI.create({
        type: form.type,
        targetValue: parseFloat(form.targetValue),
        deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
      });
      toast.success("Goal ditambahkan");
      setShowModal(false);
      setForm({ type: "WEIGHT", targetValue: "", deadline: "" });
      fetchData();
    } catch {
      toast.error("Gagal menambah goal");
    }
  };

  const handleAchieve = async (id) => {
    try {
      await goalAPI.update(id, { achieved: true });
      toast.success("Goal tercapai!");
      fetchData();
    } catch {
      toast.error("Gagal update goal");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus goal ini?")) return;
    try {
      await goalAPI.delete(id);
      toast.success("Goal dihapus");
      fetchData();
    } catch {
      toast.error("Gagal menghapus goal");
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
          <h1 className="text-2xl font-bold">Goals</h1>
          <p className="text-sm text-base-content/60 mt-1">Target fitness yang ingin kamu capai</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary btn-sm gap-2">
          <FiPlus size={16} /> Goal Baru
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-16 bg-base-100 rounded-2xl border border-base-200">
          <FiTarget size={48} className="mx-auto mb-3 text-base-content/20" />
          <p className="text-base-content/50">Belum ada goal. Buat target pertamamu!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {goals.map((goal) => (
            <div key={goal.id} className={`bg-base-100 rounded-2xl border border-base-200 p-5 ${goal.achieved ? "opacity-60" : ""}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${TYPE_COLORS[goal.type]}`}>
                    <FiTarget size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{TYPE_LABELS[goal.type]}</p>
                    <p className="text-xs text-base-content/50">
                      Target: {parseFloat(goal.targetValue)}
                      {goal.exercise && ` · ${goal.exercise.name}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {goal.achieved ? (
                    <span className="badge badge-success badge-sm gap-1"><FiCheck size={12} /> Tercapai</span>
                  ) : (
                    <button onClick={() => handleAchieve(goal.id)} className="btn btn-success btn-xs gap-1">
                      <FiCheck size={12} /> Tandai
                    </button>
                  )}
                  <button onClick={() => handleDelete(goal.id)} className="btn btn-ghost btn-xs text-error/50 hover:text-error">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
              {goal.deadline && (
                <p className="text-xs text-base-content/40 mt-3 ml-13">
                  Deadline: {new Date(goal.deadline).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Goal Baru</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tipe Goal</label>
                <select className="select select-bordered w-full select-sm" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  {Object.entries(TYPE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Target Value *</label>
                <input type="number" step="0.01" className="input input-bordered w-full input-sm" value={form.targetValue} onChange={(e) => setForm({ ...form, targetValue: e.target.value })} placeholder="65" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deadline</label>
                <input type="date" className="input input-bordered w-full input-sm" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
              </div>
            </div>
            <div className="modal-action">
              <button onClick={() => setShowModal(false)} className="btn btn-ghost btn-sm">Batal</button>
              <button onClick={handleCreate} className="btn btn-primary btn-sm">Simpan</button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowModal(false)}></div>
        </div>
      )}
    </div>
  );
}