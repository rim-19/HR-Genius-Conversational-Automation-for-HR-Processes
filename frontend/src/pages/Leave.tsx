import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiCheck, FiX } from "react-icons/fi";
import { leaveAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../utils/roles";

const statusColor: Record<string, string> = {
  approved: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
};

const Leave: React.FC = () => {
  const { user } = useAuth();
  const canReview = user && [UserRole.ADMIN, UserRole.HR, UserRole.MANAGER].includes(user.role);

  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await leaveAPI.list();
      setRequests(res.data);
    } catch {
      toast.error("Could not load leave requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const review = async (id: number, status: "approved" | "rejected") => {
    try {
      await leaveAPI.review(id, status);
      toast.success(`Request ${status}.`);
      load();
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Action failed.");
    }
  };

  const pending = requests.filter((r) => r.status === "pending");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Leave Management</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {canReview ? "Review and manage leave requests" : "Your leave requests"}
        </p>
      </div>

      {canReview && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="card text-center">
            <p className="text-xs uppercase text-gray-400 dark:text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{pending.length}</p>
          </div>
          <div className="card text-center">
            <p className="text-xs uppercase text-gray-400 dark:text-gray-500">Approved</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{requests.filter((r) => r.status === "approved").length}</p>
          </div>
          <div className="card text-center">
            <p className="text-xs uppercase text-gray-400 dark:text-gray-500">Total</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{requests.length}</p>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              {["Employee", "Type", "Dates", "Days", "Status", canReview ? "Actions" : ""].map((h, i) => (
                <th key={i} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">Loading…</td></tr>
            ) : requests.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">No leave requests.</td></tr>
            ) : (
              requests.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">{r.employee?.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 capitalize">{r.type}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(r.startDate).toLocaleDateString()} → {new Date(r.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{r.days}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusColor[r.status]}`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    {canReview && r.status === "pending" && (
                      <div className="flex gap-2">
                        <button onClick={() => review(r.id, "approved")} className="rounded-lg bg-green-100 p-1.5 text-green-700 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-300" title="Approve"><FiCheck /></button>
                        <button onClick={() => review(r.id, "rejected")} className="rounded-lg bg-red-100 p-1.5 text-red-700 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300" title="Reject"><FiX /></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leave;
