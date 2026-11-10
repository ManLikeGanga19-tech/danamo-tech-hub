"use client";

import { useEffect, useState } from "react";
import { useAdminAuth } from "@/lib/admin/AdminAuthContext";
import { adminFetch } from "@/lib/admin/client";
import { MessageSquare, Briefcase, Users, Mail, Loader2, Sparkles } from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

interface Stats {
  messages: number;
  applications: number;
  webinars: number;
  newsletter: number;
}

interface ChartData {
  name: string;
  messages: number;
  applications: number;
}

export default function AdminDashboard() {
  const { user } = useAdminAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminFetch<Stats>("/data/stats"),
      adminFetch<ChartData[]>("/data/chart")
    ])
      .then(([statsData, chartData]) => {
        setStats(statsData);
        setChartData(chartData);
      })
      .catch((err) => console.error("Failed to load dashboard data:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const kpis = [
    { title: "Contact Messages", value: stats?.messages, icon: MessageSquare, color: "text-blue-600 bg-blue-50 dark:bg-blue-500/10" },
    { title: "Career Applications", value: stats?.applications, icon: Briefcase, color: "text-green-600 bg-green-50 dark:bg-green-500/10" },
    { title: "Webinar Signups", value: stats?.webinars, icon: Users, color: "text-purple-600 bg-purple-50 dark:bg-purple-500/10" },
    { title: "Newsletter Subs", value: stats?.newsletter, icon: Mail, color: "text-orange-600 bg-orange-50 dark:bg-orange-500/10" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          Welcome back, {user?.full_name?.split(' ')[0] || "Admin"}
          <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Here is what is happening with Danamo Tech today.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white dark:bg-[#1E1E2F] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{kpi.title}</p>
                <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white">{kpi.value}</h3>
              </div>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${kpi.color}`}>
                <kpi.icon className="w-7 h-7" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white dark:bg-[#1E1E2F] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Platform Activity</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Messages and applications over the last 7 days.</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Messages</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Applications</span>
            </div>
          </div>
        </div>

        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#888888', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#888888', fontSize: 12 }} 
                allowDecimals={false}
              />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:opacity-10" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1E1E2F', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area 
                type="monotone" 
                dataKey="messages" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorMessages)" 
              />
              <Area 
                type="monotone" 
                dataKey="applications" 
                stroke="#10b981" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorApps)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}