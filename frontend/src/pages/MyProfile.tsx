import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiMail, FiBriefcase, FiHome, FiCalendar, FiFileText } from "react-icons/fi";
import { meAPI, leaveAPI } from "../services/api";

const MyProfile: React.FC = () => {
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({ type: "annual", startDate: "", endDate: "", reason: "" });
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    try {
      const res = await meAPI.getMyEmployee();
      setEmployee(res.data);
    } catch (e: any) {
      setError(e.response?.data?.message || "Could not load your profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submitLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.startDate || !form.endDate) return toast.error("Please pick a start and end date.");
    setSubmitting(true);
    try {
      await leaveAPI.create(form);
      toast.success("Leave request submitted!");
      setForm({ type: "annual", startDate: "", endDate: "", reason: "" });
      load();
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Could not submit request.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-500 dark:text-gray-400">Loading your profile…</div>;
  }
  if (error) {
    return (
      <div className="card border-l-4 border-yellow-500">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Profile unavailable</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{error}</p>
      </div>
    );
  }

  const statusColor: Record<string, string> = {
    approved: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Profile</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Your record, documents and leave</p>
      </div>

      {/* Identity */}
      <div className="card">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-2xl font-bold text-white">
            {employee.name?.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{employee.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{employee.position}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500">Annual leave left</p>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{employee.annualLeaveBalance} days</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><FiMail /> {employee.email}</div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><FiBriefcase /> {employee.department || "—"}</div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><FiHome /> Manager: {employee.manager?.name || "—"}</div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><FiCalendar /> Joined {new Date(employee.joinedAt).toLocaleDateString()}</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Request leave */}
        <div className="card">
          <h3 className="mb-3 font-semibold text-gray-900 dark:text-gray-100">Request Leave</h3>
          <form onSubmit={submitLeave} className="space-y-3">
            <select className="input w-full" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="annual">Annual</option>
              <option value="sick">Sick</option>
              <option value="unpaid">Unpaid</option>
            </select>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs text-gray-500 dark:text-gray-400">
                From
                <input type="date" className="input mt-1 w-full" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              </label>
              <label className="block text-xs text-gray-500 dark:text-gray-400">
                To
                <input type="date" className="input mt-1 w-full" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
              </label>
            </div>
            <textarea className="input w-full" rows={2} placeholder="Reason (optional)" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
            <button type="submit" disabled={submitting} className="btn btn-primary w-full">
              {submitting ? "Submitting…" : "Submit request"}
            </button>
          </form>

          <div className="mt-4 space-y-2">
            {(employee.leaveRequests || []).slice(0, 4).map((lr: any) => (
              <div key={lr.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-2 text-sm dark:border-gray-700">
                <span className="text-gray-700 dark:text-gray-300">{lr.type} · {lr.days}d · {new Date(lr.startDate).toLocaleDateString()}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusColor[lr.status]}`}>{lr.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* My documents */}
        <div className="card">
          <h3 className="mb-3 font-semibold text-gray-900 dark:text-gray-100">My Documents</h3>
          {(employee.documents || []).length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No documents yet.</p>
          ) : (
            <div className="space-y-2">
              {employee.documents.map((d: any) => (
                <a key={d.id} href={d.fileUrl} target="_blank" rel="noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700">
                  <FiFileText className="text-primary-500" />
                  <span className="text-gray-800 dark:text-gray-200">{d.title}</span>
                  <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">{new Date(d.createdAt).toLocaleDateString()}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
