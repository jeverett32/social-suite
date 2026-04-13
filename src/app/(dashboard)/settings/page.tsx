"use client";

import { useState } from "react";
import { CheckCircle, Save } from "lucide-react";
import { getWorkspaceTimezoneClient, setWorkspaceTimezoneClient } from "@/lib/demo-session";

function GeneralSettings() {
  const [orgName, setOrgName] = useState("Acme Marketing");
  const [timezone, setTimezone] = useState(() => getWorkspaceTimezoneClient() || "America/New_York");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setWorkspaceTimezoneClient(timezone);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-panel border border-border rounded-lg p-5">
        <h2 className="text-sm font-semibold text-ink mb-4">Organization</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#625d58] uppercase tracking-wider mb-1.5">
              Organization name
            </label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full max-w-md border border-border rounded-md px-3 py-2 text-sm bg-paper text-ink focus:outline-none focus:ring-1 focus:ring-warm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#625d58] uppercase tracking-wider mb-1.5">
              Timezone
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full max-w-md border border-border rounded-md px-3 py-2 text-sm bg-paper text-ink focus:outline-none focus:ring-1 focus:ring-warm"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">London (GMT)</option>
              <option value="Europe/Paris">Paris (CET)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-panel border border-border rounded-lg p-5">
        <h2 className="text-sm font-semibold text-ink mb-4">Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-ink">Email notifications</p>
              <p className="text-xs text-[#625d58]">Receive email updates about your account</p>
            </div>
            <button className="relative w-11 h-6 bg-warm rounded-full transition-colors">
              <span className="absolute right-0.5 top-0.5 size-5 rounded-full bg-paper transition-transform translate-x-5" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-ink">Weekly digest</p>
              <p className="text-xs text-[#625d58]">Get a weekly summary of performance</p>
            </div>
            <button className="relative w-11 h-6 bg-[#625d58]/30 rounded-full transition-colors">
              <span className="absolute left-0.5 top-0.5 size-5 rounded-full bg-[#625d58] transition-transform" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-ink">Failed post alerts</p>
              <p className="text-xs text-[#625d58]">Get notified immediately when a post fails</p>
            </div>
            <button className="relative w-11 h-6 bg-warm rounded-full transition-colors">
              <span className="absolute right-0.5 top-0.5 size-5 rounded-full bg-paper transition-transform translate-x-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        {saved && (
          <span className="flex items-center gap-1 text-xs text-[#536443]">
            <CheckCircle className="size-3" />
            Saved
          </span>
        )}
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-warm text-paper rounded-md text-sm font-medium hover:bg-warm/90 transition-colors"
        >
          <Save className="size-4" />
          Save changes
        </button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return <GeneralSettings />;
}
