import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Navbar from "./components/layout/Navbar";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import Dashboard from "./pages/Dashboard";
import WorkoutsPage from "./pages/workouts/WorkoutsPage";
import WorkoutDetail from "./pages/workouts/WorkoutDetail";
import CreateWorkout from "./pages/workouts/CreateWorkout";
import ExercisesPage from "./pages/exercises/ExercisesPage";
import NutritionPage from "./pages/nutrition/NutritionPage";
import BodyPage from "./pages/body/BodyPage";
import GoalsPage from "./pages/goals/GoalsPage";
import ProgressPage from "./pages/progress/ProgressPage";
import SettingsPage from "./pages/settings/SettingsPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminUserDetail from "./pages/admin/AdminUserDetail";
import AdminLayout from "./components/layout/AdminLayout";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="flex flex-col items-center gap-3">
          <span className="loading loading-dots loading-lg text-primary"></span>
          <p className="text-sm text-base-content/50">Loading...</p>
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" />;
  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}

function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-dots loading-lg text-primary"></span>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/dashboard" />;
  return <AdminLayout>{children}</AdminLayout>;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { borderRadius: "12px", padding: "12px 16px" },
          }}
        />
        <Routes>
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/workouts" element={<ProtectedRoute><WorkoutsPage /></ProtectedRoute>} />
          <Route path="/workouts/new" element={<ProtectedRoute><CreateWorkout /></ProtectedRoute>} />
          <Route path="/workouts/:id" element={<ProtectedRoute><WorkoutDetail /></ProtectedRoute>} />
          <Route path="/exercises" element={<ProtectedRoute><ExercisesPage /></ProtectedRoute>} />
          <Route path="/nutrition" element={<ProtectedRoute><NutritionPage /></ProtectedRoute>} />
          <Route path="/body" element={<ProtectedRoute><BodyPage /></ProtectedRoute>} />
          <Route path="/goals" element={<ProtectedRoute><GoalsPage /></ProtectedRoute>} />
          <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/users/:id" element={<AdminRoute><AdminUserDetail /></AdminRoute>} />

          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}