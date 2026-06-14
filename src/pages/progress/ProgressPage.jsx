import { useState, useEffect } from "react";
import { dashboardAPI, exerciseAPI } from "../../services/api";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler } from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { FiTrendingUp } from "react-icons/fi";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler);

export default function ProgressPage() {
  const [volumeData, setVolumeData] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [strengthData, setStrengthData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dashboardAPI.volume(),
      exerciseAPI.getAll(),
    ])
      .then(([volRes, exRes]) => {
        setVolumeData(volRes.data);
        setExercises(exRes.data.filter((e) => !e.isCustom));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedExercise) {
      dashboardAPI.strength(selectedExercise)
        .then((res) => setStrengthData(res.data))
        .catch(console.error);
    }
  }, [selectedExercise]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-dots loading-lg text-primary"></span>
      </div>
    );
  }

  const volumeChart = volumeData ? {
    labels: volumeData.map((w) => new Date(w.weekStart).toLocaleDateString("id-ID", { day: "numeric", month: "short" })),
    datasets: [{
      label: "Volume (kg)",
      data: volumeData.map((w) => w.volume),
      backgroundColor: "rgba(99, 102, 241, 0.6)",
      borderRadius: 8,
    }],
  } : null;

  const strengthChart = strengthData ? {
    labels: strengthData.map((s) => new Date(s.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })),
    datasets: [
      {
        label: "Estimated 1RM (kg)",
        data: strengthData.map((s) => s.e1RM),
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        fill: true,
        tension: 0.3,
        pointRadius: 5,
        pointBackgroundColor: "rgb(99, 102, 241)",
      },
      {
        label: "Weight (kg)",
        data: strengthData.map((s) => s.weightKg),
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: false,
        tension: 0.3,
        pointRadius: 4,
        borderDash: [5, 5],
      },
    ],
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" } },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Progress</h1>
        <p className="text-sm text-base-content/60 mt-1">Grafik perkembangan fitness kamu</p>
      </div>

      {/* Volume Chart */}
      <div className="bg-base-100 rounded-2xl border border-base-200 p-6">
        <h2 className="font-semibold text-sm mb-4 flex items-center gap-2">
          <FiTrendingUp className="text-primary" /> Volume Mingguan (8 Minggu Terakhir)
        </h2>
        <div className="h-64">
          {volumeChart ? <Bar data={volumeChart} options={chartOptions} /> : <p className="text-center text-base-content/50 py-20">Belum ada data</p>}
        </div>
      </div>

      {/* Strength Chart */}
      <div className="bg-base-100 rounded-2xl border border-base-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="font-semibold text-sm flex items-center gap-2">
            <FiTrendingUp className="text-emerald-500" /> Strength Progression
          </h2>
          <select
            className="select select-bordered select-sm w-full sm:w-auto"
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
          >
            <option value="">Pilih Exercise</option>
            {exercises.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        </div>
        <div className="h-64">
          {strengthChart ? (
            <Line data={strengthChart} options={chartOptions} />
          ) : selectedExercise ? (
            <p className="text-center text-base-content/50 py-20">Belum ada data untuk exercise ini</p>
          ) : (
            <p className="text-center text-base-content/50 py-20">Pilih exercise untuk melihat progress</p>
          )}
        </div>
      </div>
    </div>
  );
}