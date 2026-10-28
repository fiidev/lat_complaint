import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { client } from "../../lib/client";

export default function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const get = async () => {
    try {
      const res = await client.get("/rooms");
      setRooms(res.data.data);
    } catch {
      setError("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    get();
  }, []);

  const del = async (id) => {
    if (!confirm("Hapus ruangan ini?")) return;
    try {
      await client.delete(`/rooms/${id}`);
      setRooms((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus");
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Data Ruangan</h3>
        <Link to="/rooms/create" className="btn btn-primary btn-sm">
          + Tambah Ruangan
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Ruangan</th>
                <th>Gedung</th>
                <th>Nomor Ruangan</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((r, i) => (
                <tr key={r.id}>
                  <td>{i + 1}</td>
                  <td>
                    <strong>{r.name}</strong>
                  </td>
                  <td>{r.building}</td>
                  <td>{r.room_number}</td>
                  <td>
                    <span
                      className={`badge ${r.is_active ? "badge-success" : "badge-danger"}`}
                    >
                      {r.is_active ? "Aktif" : "Non-aktif"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "0.35rem" }}>
                      <Link
                        to={`/rooms/${r.id}/edit`}
                        className="btn btn-sm btn-secondary"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => del(r.id)}
                        className="btn btn-sm btn-danger"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
