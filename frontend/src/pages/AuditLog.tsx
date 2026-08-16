import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { auditAPI } from "../services/api";

const roleColor: Record<string, string> = {
  ADMIN: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  HR: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  MANAGER: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  EMPLOYEE: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
};

const AuditLog: React.FC = () => {
  const [data, setData] = useState<any>({ items: [], total: 0, page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    auditAPI
      .list(page, 20)
      .then((res) => active && setData(res.data))
      .catch(() => toast.error("Could not load the audit log."))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [page]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Audit Log</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Recorded actions across the platform</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              {["When", "User", "Role", "Action", "Details"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">Loading…</td></tr>
            ) : data.items.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">No activity recorded.</td></tr>
            ) : (
              data.items.map((a: any) => (
                <tr key={a.id}>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-500 dark:text-gray-400">{new Date(a.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{a.user?.name || "—"}</td>
                  <td className="px-4 py-3">
                    {a.user?.role && <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${roleColor[a.user.role] || ""}`}>{a.user.role}</span>}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">{a.action}</td>
                  <td className="max-w-xs truncate px-4 py-3 text-xs text-gray-500 dark:text-gray-400" title={a.description || ""}>{a.description || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500 dark:text-gray-400">Page {data.page} of {data.totalPages} · {data.total} entries</span>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="btn btn-outline disabled:opacity-40">Previous</button>
          <button disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)} className="btn btn-outline disabled:opacity-40">Next</button>
        </div>
      </div>
    </div>
  );
};

export default AuditLog;
