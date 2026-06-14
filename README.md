# FitTrack Client (Frontend)

## Deskripsi

FitTrack Client adalah aplikasi web frontend untuk Fitness Tracker — sebuah platform personal fitness companion yang membantu pengguna gym mencatat workout, melacak progres strength & volume, mengelola nutrisi harian, memantau body measurement, dan menetapkan goal kebugaran. Aplikasi ini menyediakan antarmuka yang bersih, responsif, dan user-friendly dengan visualisasi data melalui chart interaktif.

Selain halaman pengguna, aplikasi ini juga memiliki **Admin Dashboard** untuk memonitoring aktivitas seluruh user, termasuk statistik platform, manajemen user (search, filter, ban/activate, delete), dan detail aktivitas per user.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 19.2.6 |
| Build Tool | Vite | 8.0.12 |
| Styling | Tailwind CSS | 4.3.1 |
| UI Component Library | DaisyUI | 5.5.23 |
| Routing | React Router DOM | 7.17.0 |
| Charts | Chart.js + react-chartjs-2 | 4.5.1 / 5.3.1 |
| Icons | react-icons (Feather Icons) | 5.6.0 |
| Notifications | react-hot-toast | 2.6.0 |
| HTTP Client | Axios | 1.17.0 |
| Date Utility | date-fns | 4.4.0 |

---

## Struktur Folder

```
client/
├── src/
│   ├── main.jsx                          # Entry point (React DOM render)
│   ├── App.jsx                           # Root component + semua routing
│   ├── index.css                         # Tailwind + DaisyUI setup
│   ├── contexts/
│   │   └── AuthContext.jsx               # Auth state (login, register, logout, isAdmin)
│   ├── services/
│   │   └── api.js                        # Axios instance + semua API modules
│   ├── components/
│   │   └── layout/
│   │       ├── Navbar.jsx                # Top navigation + avatar dropdown + mobile menu
│   │       └── AdminLayout.jsx           # Admin sidebar layout
│   └── pages/
│       ├── auth/
│       │   ├── LoginPage.jsx             # Login (split-screen layout)
│       │   └── RegisterPage.jsx          # Register + confirm password
│       ├── Dashboard.jsx                 # Stats, recent workouts, PRs
│       ├── workouts/
│       │   ├── WorkoutsPage.jsx          # Daftar semua workout
│       │   ├── CreateWorkout.jsx         # Buat workout baru
│       │   └── WorkoutDetail.jsx         # Detail workout (exercises + sets)
│       ├── exercises/
│       │   └── ExercisesPage.jsx         # Exercise library (filter, search, CRUD custom)
│       ├── nutrition/
│       │   └── NutritionPage.jsx         # Log makanan + daily summary
│       ├── body/
│       │   └── BodyPage.jsx              # Body measurement + history
│       ├── goals/
│       │   └── GoalsPage.jsx             # Goals + progress indicator
│       ├── progress/
│       │   └── ProgressPage.jsx          # Charts (volume bar, strength line)
│       ├── settings/
│       │   └── SettingsPage.jsx          # Edit profile, change password, logout
│       └── admin/
│           ├── AdminDashboard.jsx        # Platform stats + charts
│           ├── AdminUsers.jsx            # User management table
│           └── AdminUserDetail.jsx       # Detail aktivitas user
├── vite.config.js                        # Vite config + API proxy ke localhost:5000
└── package.json
```

---

## Routing

### Public Routes (tanpa auth)
| Path | Component | Deskripsi |
|------|-----------|-----------|
| `/login` | LoginPage | Form login email + password |
| `/register` | RegisterPage | Form registrasi + konfirmasi password |

### Protected Routes (wajib login)
| Path | Component | Deskripsi |
|------|-----------|-----------|
| `/dashboard` | Dashboard | Overview: stats cards, recent workouts, PRs |
| `/workouts` | WorkoutsPage | Daftar semua workout + delete |
| `/workouts/new` | CreateWorkout | Buat workout baru (nama + notes) |
| `/workouts/:id` | WorkoutDetail | Detail workout: exercises, sets, add/remove |
| `/exercises` | ExercisesPage | Exercise library: filter category, search, CRUD custom |
| `/nutrition` | NutritionPage | Log makanan per meal type + daily macro summary |
| `/body` | BodyPage | Body measurement: current stats, history, delete |
| `/goals` | GoalsPage | Goals: type badges, mark achieved, delete |
| `/progress` | ProgressPage | Charts: weekly volume (bar), strength progression (line) |
| `/settings` | SettingsPage | Edit profile, change password, logout |

### Admin Routes (wajib role ADMIN)
| Path | Component | Deskripsi |
|------|-----------|-----------|
| `/admin` | AdminDashboard | Platform stats + user growth + workout activity charts |
| `/admin/users` | AdminUsers | User management: search, filter role/status, pagination |
| `/admin/users/:id` | AdminUserDetail | Detail user: stats, workout history, body data, goals |

---

## API Service Layer

Semua komunikasi ke backend dilakukan melalui Axios instance di `services/api.js`:

- **Base URL**: `/api` (di-proxy Vite ke `http://localhost:5000`)
- **Auto token attach**: Setiap request otomatis menambahkan header `Authorization: Bearer <token>` dari localStorage
- **401 interceptor**: Jika response 401, token dihapus dan redirect ke `/login`

### API Modules:
| Module | Methods |
|--------|---------|
| `authAPI` | register, login, me |
| `workoutAPI` | getAll, getById, create, update, delete, addExercise, removeExercise, addSet, updateSet, deleteSet |
| `exerciseAPI` | getAll, getById, create, update, delete |
| `nutritionAPI` | getAll, getSummary, create, update, delete |
| `bodyAPI` | getAll, create, update, delete |
| `goalAPI` | getAll, create, update, delete |
| `dashboardAPI` | summary, volume, strength(exerciseId) |
| `settingsAPI` | updateProfile, changePassword |
| `adminAPI` | getStats, getUsers, getUser, updateUser, deleteUser |

---

## State Management

Menggunakan **React Context** (AuthContext) untuk auth state global:

- `user` — data user yang sedang login (null jika belum login)
- `loading` — status loading saat cek token
- `login(email, password)` — fungsi login
- `register(name, email, password)` — fungsi registrasi
- `logout()` — fungsi logout
- `isAdmin` — boolean apakah user adalah ADMIN

State lainnya dikelola secara lokal menggunakan `useState` di masing-masing komponen.

---

## Design System

- **UI Framework**: DaisyUI v5 dengan Tailwind CSS v4
- **Icons**: Feather Icons via react-icons (`Fi*` prefix)
- **Charts**: Chart.js (Bar untuk volume, Line untuk strength progression)
- **Color scheme**: DaisyUI default theme (primary, secondary, success, warning, error, info)
- **Layout**: Navbar top (user) / Sidebar (admin), responsive mobile-first
- **Notifications**: Toast dari react-hot-toast (top-right position)

---

## Scripts

| Command | Deskripsi |
|---------|-----------|
| `npm run dev` | Jalankan development server (Vite, hot reload) |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build |
| `npm run lint` | Jalankan ESLint |
