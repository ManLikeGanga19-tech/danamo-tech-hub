"use client";

import { useState } from "react";
import JobsTab from "./JobsTab";
import ApplicationsTab from "./ApplicationsTab";

type Tab = "jobs" | "applications";

export default function CareersAdmin() {
  const [tab, setTab] = useState<Tab>("jobs");
  // Bumped when roles change so application lists refresh their role names.
  const [refreshKey, setRefreshKey] = useState(0);

  const tabClass = (t: Tab) =>
    `px-4 py-2 text-sm font-medium rounded-md transition-colors ${
      tab === t ? "bg-white dark:bg-[#1E1E2F] shadow text-blue-600" : "text-gray-600 dark:text-gray-400"
    }`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Careers</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage job openings and review applications.</p>
        </div>
        <div className="flex p-1 rounded-lg bg-gray-100 dark:bg-gray-900" role="tablist">
          <button role="tab" aria-selected={tab === "jobs"} onClick={() => setTab("jobs")} className={tabClass("jobs")}>Job Openings</button>
          <button role="tab" aria-selected={tab === "applications"} onClick={() => setTab("applications")} className={tabClass("applications")}>Applications</button>
        </div>
      </div>

      {tab === "jobs" ? <JobsTab onChanged={() => setRefreshKey((k) => k + 1)} /> : <ApplicationsTab refreshKey={refreshKey} />}
    </div>
  );
}
