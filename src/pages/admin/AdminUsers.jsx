import { useState, useEffect } from "react";
import { adminAPI } from "../../services/api";
import { Link } from "react-router-dom";
import { FiSearch, FiChevronRight, FiUserX, FiUserCheck, FiShield, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";

export default function AdminUsers() {
  const [data, setData] = useState({ users: [], total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const fetchUsers = () => {
    setLoading(true);
    adminAPI.getUsers({
      search,
      page,
      role: filterRole || undefined,
      status: filterStatus || undefined,
    })
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [page]);

  const handleSearch = () => { setPage(1); fetchUsers(); };
  const handleFilterChange = (type, value) => {
    if (type === "role") setFilterRole(value);
    if (type === "status") setFilterStatus(value);
    setPage(1);
    setTimeout(() => fetchUsers(), 0);
  };

  const handleDelete = async (userId, name) => {
    if (!confirm(`Hapus user "${name}"? Semua data akan terhapus.`)) return;
    try {
      await adminAPI.deleteUser(userId);
      toast.success("User dihapus");
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || "Gagal menghapus");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-sm text-base-content/60 mt-1">{data.total} user terdaftar</p>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
          <input
            type="text"
            placeholder="Cari nama atau email..."
            className="input input-bordered w-full pl-10 input-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <select
          className="select select-bordered select-sm w-28"
          value={filterRole}
          onChange={(e) => handleFilterChange("role", e.target.value)}
        >
          <option value="">All Role</option>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
        <select
          className="select select-bordered select-sm w-32"
          value={filterStatus}
          onChange={(e) => handleFilterChange("status", e.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="banned">Banned</option>
        </select>
        <button onClick={handleSearch} className="btn btn-sm btn-ghost">Cari</button>
      </div>

      <div className="bg-base-100 rounded-2xl border border-base-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-dots loading-lg text-error"></span>
          </div>
        ) : data.users.length === 0 ? (
          <div className="text-center py-12 text-base-content/50">Tidak ada user ditemukan</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr className="text-xs text-base-content/50">
                  <th>User</th>
                  <th>Role</th>
                  <th>Workouts</th>
                  <th>Goals</th>
                  <th>Status</th>
                  <th>Bergabung</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((u) => (
                  <tr key={u.id} className="text-sm hover">
                    <td>
                      <div>
                        <p className="font-medium">{u.name}</p>
                        <p className="text-xs text-base-content/50">{u.email}</p>
                      </div>
                    </td>
                    <td>
                      {u.role === "ADMIN" ? (
                        <span className="badge badge-error badge-sm gap-1"><FiShield size={10} /> Admin</span>
                      ) : (
                        <span className="badge badge-ghost badge-sm">User</span>
                      )}
                    </td>
                    <td>{u._count.workouts}</td>
                    <td>{u._count.goals}</td>
                    <td>
                      {u.isActive ? (
                        <span className="badge badge-success badge-sm">Active</span>
                      ) : (
                        <span className="badge badge-error badge-sm">Banned</span>
                      )}
                    </td>
                    <td className="text-xs">{new Date(u.createdAt).toLocaleDateString("id-ID")}</td>
                    <td>
                      <div className="flex gap-1">
                        <Link to={`/admin/users/${u.id}`} className="btn btn-ghost btn-xs">
                          <FiChevronRight size={14} />
                        </Link>
                        <button
                          onClick={() => handleToggleActive(u.id, u.isActive)}
                          className={`btn btn-ghost btn-xs ${u.isActive ? "text-warning" : "text-success"}`}
                          title={u.isActive ? "Ban" : "Activate"}
                        >
                          {u.isActive ? <FiUserX size={14} /> : <FiUserCheck size={14} />}
                        </button>
                        <button
                          onClick={() => handleDelete(u.id, u.name)}
                          className="btn btn-ghost btn-xs text-error"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data.totalPages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-base-200">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="btn btn-sm btn-ghost"
              disabled={page === 1}
            >
              Prev
            </button>
            <span className="text-sm text-base-content/60 flex items-center px-3">
              {page} / {data.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
              className="btn btn-sm btn-ghost"
              disabled={page === data.totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}