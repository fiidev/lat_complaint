import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { client } from "../../lib/client";

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const get = async () => {
    try {
      const res = await client.get("/me/tickets");
      setTickets(res.data.data);
    } catch {
      setError("Gagal memuat tiket tugas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    get();
  }, []);

  const badgeStatus = {
    open: "badge-warning",
    in_progress: "badge-info",
    resolved: "badge-success",
  };

  const badgePriority = {
    low: "badge-secondary",
    medium: "badge-info",
    high: "badge-danger",
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Daftar Tiket Tugas</h3>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <p>Loading...</p>
      ) : tickets.length === 0 ? (
        <p>Belum ada tiket tugas</p>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>No Tiket</th>
                <th>Ruangan</th>
                <th>Keluhan</th>
                <th>Prioritas</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id}>
                  <td>
                    <strong>{t.ticket_number}</strong>
                  </td>
                  <td>{t.complaint?.room?.name || "-"}</td>
                  <td>{t.complaint?.title || "-"}</td>
                  <td>
                    <span
                      className={`badge ${badgePriority[t.priority] || "badge-secondary"}`}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${badgeStatus[t.status] || "badge-secondary"}`}
                    >
                      {t.status === "in_progress" ? "progress" : t.status}
                    </span>
                  </td>
                  <td>
                    {t.status === "open" ? (
                      <Link
                        to={`/tickets/${t.id}`}
                        className="btn btn-sm btn-primary"
                      >
                        Kerjakan
                      </Link>
                    ) : t.status === "in_progress" ? (
                      <Link
                        to={`/tickets/${t.id}`}
                        className="btn btn-sm btn-primary"
                      >
                        Selesaikan
                      </Link>
                    ) : (
                      <Link
                        to={`/tickets/${t.id}`}
                        className="btn btn-sm btn-primary"
                      >
                        Lihat
                      </Link>
                    )}
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
