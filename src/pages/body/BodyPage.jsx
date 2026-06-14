import { useState, useEffect } from "react";
import { bodyAPI } from "../../services/api";
import { FiPlus, FiTrash2, FiActivity } from "react-icons/fi";
import toast from "react-hot-toast";

export default function BodyPage() {
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ weightKg: "", bodyFatPct: "", muscleMassKg: "", waistCm: "" });

  const fetchData = () => {
    bodyAPI.getAll()
      .then((res) => setMeasurements(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async () => {
    if (!form.weightKg) { toast.error("Berat badan wajib diisi"); return; }
    try {
      await bodyAPI.create({
        weightKg: parseFloat(form.weightKg),
        bodyFatPct: form.bodyFatPct ? parseFloat(form.bodyFatPct) : null,
        muscleMassKg: form.muscleMassKg ? parseFloat(form.muscleMassKg) : null,
        waistCm: form.waistCm ? parseFloat(form.waistCm) : null,
      });
      toast.success("Data ditambahkan");
      setShowModal(false);
      setForm({ weightKg: "", bodyFatPct: "", muscleMassKg: "", waistCm: "" });
      fetchData();
    } catch {
      toast.error("Gagal menyimpan data");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus data ini?")) return;
    try {
      await bodyAPI.delete(id);
      toast.success("Data dihapus");
      fetchData();
    } catch {
      toast.error("Gagal menghapus");
    }
  };

  const latest = measurements[0];
  const previous = measurements[1];
  const weightDiff = latest && previous ? (parseFloat(latest.weightKg) - parseFloat(previous.weightKg)).toFixed(1) : null;

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
          <h1 className="text-2xl font-bold">Body Measurement</h1>
          <p className="text-sm text-base-content/60 mt-1">Pantau perubahan tubuh kamu</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary btn-sm gap-2">
          <FiPlus size={16} /> Input Baru
        </button>
      </div>

      {/* Current Stats */}
      {latest && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-blue-50 rounded-2xl p-4">
            <p className="text-xs font-medium text-base-content/50 uppercase">Berat Badan</p>
            <p className="text-2xl font-bold text-blue-700 mt-1">{parseFloat(latest.weightKg)} <span className="text-sm font-normal">kg</span></p>
            {weightDiff && (
              <p className={`text-xs mt-1 ${parseFloat(weightDiff) > 0 ? "text-red-500" : "text-emerald-500"}`}>
                {parseFloat(weightDiff) > 0 ? "+" : ""}{weightDiff} kg dari sebelumnya
              </p>
            )}
          </div>
          {latest.bodyFatPct && (
            <div className="bg-purple-50 rounded-2xl p-4">
              <p className="text-xs font-medium text-base-content/50 uppercase">Body Fat</p>
              <p className="text-2xl font-bold text-purple-700 mt-1">{parseFloat(latest.bodyFatPct)}<span className="text-sm font-normal">%</span></p>
            </div>
          )}
          {latest.muscleMassKg && (
            <div className="bg-emerald-50 rounded-2xl p-4">
              <p className="text-xs font-medium text-base-content/50 uppercase">Muscle Mass</p>
              <p className="text-2xl font-bold text-emerald-700 mt-1">{parseFloat(latest.muscleMassKg)} <span className="text-sm font-normal">kg</span></p>
            </div>
          )}
          {latest.waistCm && (
            <div className="bg-amber-50 rounded-2xl p-4">
              <p className="text-xs font-medium text-base-content/50 uppercase">Lingkar Pinggang</p>
              <p className="text-2xl font-bold text-amber-700 mt-1">{parseFloat(latest.waistCm)} <span className="text-sm font-normal">cm</span></p>
            </div>
          )}
        </div>
      )}

      {/* History Table */}
      <div className="bg-base-100 rounded-2xl border border-base-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-base-200">
          <h2 className="font-semibold text-sm">Riwayat Pengukuran</h2>
        </div>
        {measurements.length === 0 ? (
          <div className="text-center py-12">
            <FiActivity size={40} className="mx-auto mb-3 text-base-content/20" />
            <p className="text-base-content/50">Belum ada data pengukuran</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr className="text-xs text-base-content/50">
                  <th>Tanggal</th>
                  <th>Berat (kg)</th>
                  <th>Body Fat %</th>
                  <th>Muscle (kg)</th>
                  <th>Pinggang (cm)</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {measurements.map((m) => (
                  <tr key={m.id} className="text-sm hover">
                    <td>{new Date(m.date).toLocaleDateString("id-ID")}</td>
                    <td className="font-medium">{parseFloat(m.weightKg)}</td>
                    <td>{m.bodyFatPct ? parseFloat(m.bodyFatPct) : "-"}</td>
                    <td>{m.muscleMassKg ? parseFloat(m.muscleMassKg) : "-"}</td>
                    <td>{m.waistCm ? parseFloat(m.waistCm) : "-"}</td>
                    <td>
                      <button onClick={() => handleDelete(m.id)} className="btn btn-ghost btn-xs text-error/50 hover:text-error">
                        <FiTrash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Input Pengukuran Baru</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Berat Badan (kg) *</label>
                <input type="number" step="0.1" className="input input-bordered w-full input-sm" value={form.weightKg} onChange={(e) => setForm({ ...form, weightKg: e.target.value })} placeholder="70.5" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Body Fat %</label>
                  <input type="number" step="0.1" className="input input-bordered w-full input-sm" value={form.bodyFatPct} onChange={(e) => setForm({ ...form, bodyFatPct: e.target.value })} placeholder="18" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Muscle (kg)</label>
                  <input type="number" step="0.1" className="input input-bordered w-full input-sm" value={form.muscleMassKg} onChange={(e) => setForm({ ...form, muscleMassKg: e.target.value })} placeholder="35" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Pinggang (cm)</label>
                  <input type="number" step="0.1" className="input input-bordered w-full input-sm" value={form.waistCm} onChange={(e) => setForm({ ...form, waistCm: e.target.value })} placeholder="82" />
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