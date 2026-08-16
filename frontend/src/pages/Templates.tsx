import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiSave } from "react-icons/fi";
import { templatesAPI } from "../services/api";

const Templates: React.FC = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);

  const load = async () => {
    try {
      const res = await templatesAPI.list();
      setTemplates(res.data);
    } catch {
      toast.error("Could not load templates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const edit = (id: number, field: "name" | "guidance", value: string) => {
    setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  const save = async (t: any) => {
    setSavingId(t.id);
    try {
      await templatesAPI.update(t.id, { name: t.name, guidance: t.guidance });
      toast.success(`"${t.name}" saved.`);
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Save failed.");
    } finally {
      setSavingId(null);
    }
  };

  if (loading) return <div className="p-8 text-gray-500 dark:text-gray-400">Loading templates…</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Document Templates</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Guidance that steers how the AI writes each document type
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {templates.map((t) => (
          <div key={t.id} className="card space-y-3">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                {t.type}
              </span>
            </div>
            <label className="block text-xs text-gray-500 dark:text-gray-400">
              Name
              <input className="input mt-1 w-full" value={t.name} onChange={(e) => edit(t.id, "name", e.target.value)} />
            </label>
            <label className="block text-xs text-gray-500 dark:text-gray-400">
              AI Guidance
              <textarea className="input mt-1 w-full" rows={4} value={t.guidance} onChange={(e) => edit(t.id, "guidance", e.target.value)} />
            </label>
            <button onClick={() => save(t)} disabled={savingId === t.id} className="btn btn-primary flex items-center gap-2">
              <FiSave /> {savingId === t.id ? "Saving…" : "Save"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Templates;
