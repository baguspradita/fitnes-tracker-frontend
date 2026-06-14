import { useState, useEffect } from "react";
import { exerciseAPI } from "../../services/api";
import { FiPlus, FiSearch, FiTrash2, FiEdit2 } from "react-icons/fi";
import toast from "react-hot-toast";

const CATEGORIES = ["ALL", "PUSH", "PULL", "LEGS", "CORE", "CARDIO", "FULL_BODY"];

export default function ExercisesPage() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("ALL");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", category: "PUSH", muscleGroup: "", equipment: "" });

  const fetchExercises = () => {
    const params = {};
    if (category !== "ALL") params.category = category;
    if (search) params.search = search;
    exerciseAPI.getAll(params)
      .then((res) => setExercises(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchExercises(); }, [category]);

  const handleSearch = () => { fetchExercises(); };

  const handleSave = async () => {
    if (!form.name || !form.muscleGroup) {
      toast.error("Nama dan muscle group wajib diisi");
      return;
    }
    try {
      if (editingId) {
        await exerciseAPI.update(editingId, form);
        toast.success("Exercise diupdate");
      } else {
        await exerciseAPI.create(form);
        toast.success("Exercise ditambahkan");
      }
      setShowModal(false);
      setEditingId(null);
      setForm({ name: "", description: "", category: "PUSH", muscleGroup: "", equipment: "" });
      fetchExercises();
    } catch {
      toast.error("Gagal menyimpan exercise");
    }
  };

  const handleEdit = (ex) => {
    setForm({ name: ex.name, description: ex.description || "", category: ex.category, muscleGroup: ex.muscleGroup, equipment: ex.equipment || "" });
    setEditingId(ex.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus exercise ini?")) return;
    try {
      await exerciseAPI.delete(id);
      toast.success("Exercise dihapus");
      fetchExercises();
    } catch {
      toast.error("Gagal menghapus exercise");
    }
  };

  const categoryColor = (cat) => {
    const colors = { PUSH: "badge-primary", PULL: "badge-secondary", LEGS: "badge-accent", CORE: "badge-warning", CARDIO: "badge-info", FULL_BODY: "badge-success" };
    return colors[cat] || "badge-ghost";
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Exercise Library</h1>
          <p className="text-sm text-base-content/60 mt-1">{exercises.length} exercises tersedia</p>
        </div>
        <button
          onClick={() => { setShowModal(true); setEditingId(null); setForm({ name: "", description: "", category: "PUSH", muscleGroup: "", equipment: "" }); }}
          className="btn btn-primary btn-sm gap-2"
        >
          <FiPlus size={16} /> Custom Exercise
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
          <input
            type="text"
            placeholder="Cari exercise..."
            className="input input-bordered w-full pl-10 input-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`btn btn-xs ${category === cat ? "btn-primary" : "btn-ghost"}`}
            >
              {cat === "ALL" ? "Semua" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {exercises.map((ex) => (
          <div key={ex.id} className="bg-base-100 rounded-2xl border border-base-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-semibold text-sm">{ex.name}</p>
                <p className="text-xs text-base-content/50 mt-1">
                  {ex.muscleGroup} {ex.equipment && `· ${ex.equipment}`}
                </p>
              </div>
              <span className={`badge badge-xs ${categoryColor(ex.category)}`}>{ex.category}</span>
            </div>
            {ex.description && (
              <p className="text-xs text-base-content/40 mt-2">{ex.description}</p>
            )}
            {ex.isCustom && (
              <div className="flex gap-1 mt-3">
                <button onClick={() => handleEdit(ex)} className="btn btn-ghost btn-xs gap-1">
                  <FiEdit2 size={12} /> Edit
                </button>
                <button onClick={() => handleDelete(ex.id)} className="btn btn-ghost btn-xs text-error gap-1">
                  <FiTrash2 size={12} /> Hapus
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">{editingId ? "Edit" : "Tambah"} Custom Exercise</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nama *</label>
                <input
                  type="text"
                  className="input input-bordered w-full input-sm"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="contoh: Cable Fly"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Kategori *</label>
                  <select
                    className="select select-bordered w-full select-sm"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    {CATEGORIES.filter((c) => c !== "ALL").map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Muscle Group *</label>
                  <input
                    type="text"
                    className="input input-bordered w-full input-sm"
                    value={form.muscleGroup}
                    onChange={(e) => setForm({ ...form, muscleGroup: e.target.value })}
                    placeholder="contoh: Chest"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Equipment</label>
                <input
                  type="text"
                  className="input input-bordered w-full input-sm"
                  value={form.equipment}
                  onChange={(e) => setForm({ ...form, equipment: e.target.value })}
                  placeholder="contoh: Dumbbell"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deskripsi</label>
                <textarea
                  className="textarea textarea-bordered w-full textarea-sm"
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Deskripsi opsional..."
                />
              </div>
            </div>
            <div className="modal-action">
              <button onClick={() => { setShowModal(false); setEditingId(null); }} className="btn btn-ghost btn-sm">Batal</button>
              <button onClick={handleSave} className="btn btn-primary btn-sm">Simpan</button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => { setShowModal(false); setEditingId(null); }}></div>
        </div>
      )}
    </div>
  );
}