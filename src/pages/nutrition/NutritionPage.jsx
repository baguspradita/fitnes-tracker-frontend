import { useState, useEffect } from "react";
import { nutritionAPI } from "../../services/api";
import { FiPlus, FiTrash2, FiCoffee } from "react-icons/fi";
import toast from "react-hot-toast";

const MEAL_TYPES = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"];
const MEAL_LABELS = { BREAKFAST: "Sarapan", LUNCH: "Makan Siang", DINNER: "Makan Malam", SNACK: "Snack" };
const MEAL_ICONS = { BREAKFAST: "S", LUNCH: "M", DINNER: "N", SNACK: "K" };

export default function NutritionPage() {
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ mealType: "BREAKFAST", foodName: "", calories: "", proteinG: "", carbsG: "", fatG: "", servingQty: 1 });

  const fetchData = () => {
    Promise.all([
      nutritionAPI.getAll({ date: selectedDate }),
      nutritionAPI.getSummary(selectedDate),
    ])
      .then(([logsRes, sumRes]) => {
        setLogs(logsRes.data);
        setSummary(sumRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [selectedDate]);

  const handleCreate = async () => {
    if (!form.foodName || !form.calories) {
      toast.error("Nama makanan dan kalori wajib diisi");
      return;
    }
    try {
      await nutritionAPI.create({
        ...form,
        calories: parseInt(form.calories),
        proteinG: parseFloat(form.proteinG) || 0,
        carbsG: parseFloat(form.carbsG) || 0,
        fatG: parseFloat(form.fatG) || 0,
        date: new Date(selectedDate).toISOString(),
      });
      toast.success("Log ditambahkan");
      setShowModal(false);
      setForm({ mealType: "BREAKFAST", foodName: "", calories: "", proteinG: "", carbsG: "", fatG: "", servingQty: 1 });
      fetchData();
    } catch {
      toast.error("Gagal menambah log");
    }
  };

  const handleDelete = async (id) => {
    try {
      await nutritionAPI.delete(id);
      toast.success("Log dihapus");
      fetchData();
    } catch {
      toast.error("Gagal menghapus");
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Nutrition</h1>
          <p className="text-sm text-base-content/60 mt-1">Catat makanan harian kamu</p>
        </div>
        <div className="flex gap-2">
          <input
            type="date"
            className="input input-bordered input-sm"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <button onClick={() => setShowModal(true)} className="btn btn-primary btn-sm gap-2">
            <FiPlus size={16} /> Tambah
          </button>
        </div>
      </div>

      {/* Daily Summary */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Kalori", value: summary.calories, unit: "kcal", color: "text-orange-600", bg: "bg-orange-50" },
            { label: "Protein", value: summary.proteinG.toFixed(1), unit: "g", color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Karbo", value: summary.carbsG.toFixed(1), unit: "g", color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Lemak", value: summary.fatG.toFixed(1), unit: "g", color: "text-purple-600", bg: "bg-purple-50" },
          ].map((macro) => (
            <div key={macro.label} className={`${macro.bg} rounded-2xl p-4 border border-transparent`}>
              <p className="text-xs font-medium text-base-content/50 uppercase">{macro.label}</p>
              <p className={`text-2xl font-bold ${macro.color} mt-1`}>
                {macro.value}<span className="text-sm font-normal ml-1">{macro.unit}</span>
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Logs by Meal Type */}
      {MEAL_TYPES.map((meal) => {
        const mealLogs = logs.filter((l) => l.mealType === meal);
        if (mealLogs.length === 0) return null;
        return (
          <div key={meal} className="bg-base-100 rounded-2xl border border-base-200 overflow-hidden">
            <div className="px-5 py-3 bg-base-200/30 flex items-center gap-2">
              <span>{MEAL_ICONS[meal]}</span>
              <span className="font-semibold text-sm">{MEAL_LABELS[meal]}</span>
              <span className="text-xs text-base-content/50">({mealLogs.length} item)</span>
            </div>
            <div className="divide-y divide-base-200">
              {mealLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium">{log.foodName}</p>
                    <p className="text-xs text-base-content/50">
                      {log.calories} kcal · P: {parseFloat(log.proteinG)}g · C: {parseFloat(log.carbsG)}g · F: {parseFloat(log.fatG)}g
                    </p>
                  </div>
                  <button onClick={() => handleDelete(log.id)} className="btn btn-ghost btn-xs text-error/50 hover:text-error">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {logs.length === 0 && (
        <div className="text-center py-12 bg-base-100 rounded-2xl border border-base-200">
          <FiCoffee size={40} className="mx-auto mb-3 text-base-content/20" />
          <p className="text-base-content/50">Belum ada log makanan untuk tanggal ini</p>
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Tambah Makanan</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Jenis Makan</label>
                <select className="select select-bordered w-full select-sm" value={form.mealType} onChange={(e) => setForm({ ...form, mealType: e.target.value })}>
                  {MEAL_TYPES.map((m) => <option key={m} value={m}>{MEAL_LABELS[m]}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nama Makanan *</label>
                <input type="text" className="input input-bordered w-full input-sm" value={form.foodName} onChange={(e) => setForm({ ...form, foodName: e.target.value })} placeholder="contoh: Nasi Goreng" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Kalori *</label>
                  <input type="number" className="input input-bordered w-full input-sm" value={form.calories} onChange={(e) => setForm({ ...form, calories: e.target.value })} placeholder="450" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Protein (g)</label>
                  <input type="number" step="0.1" className="input input-bordered w-full input-sm" value={form.proteinG} onChange={(e) => setForm({ ...form, proteinG: e.target.value })} placeholder="15" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Karbo (g)</label>
                  <input type="number" step="0.1" className="input input-bordered w-full input-sm" value={form.carbsG} onChange={(e) => setForm({ ...form, carbsG: e.target.value })} placeholder="60" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Lemak (g)</label>
                  <input type="number" step="0.1" className="input input-bordered w-full input-sm" value={form.fatG} onChange={(e) => setForm({ ...form, fatG: e.target.value })} placeholder="18" />
                </div>
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