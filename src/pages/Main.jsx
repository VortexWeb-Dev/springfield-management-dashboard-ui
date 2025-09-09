import React, { useMemo, useState } from "react";
import {
  LayoutGrid,
  Users,
  Target,
  Banknote,
  ShieldCheck,
  FileBarChart,
  Settings,
  Download,
  Search,
  Filter,
  BellRing,
  TrendingUp,
  Building2,
  CalendarClock,
  Briefcase,
  Layers,
  BarChart2,
  ListOrdered,
  X,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import { CHART_COLORS, Input, TOKENS } from "../components/primitives";
import {
  AgentRankingSplitPage,
  AgentLastTransactionPage,
  Agents,
  Compliance,
  DealsMonitoringPage,
  Finance,
  ManagementPage,
  OverallDealsPage,
  Overview,
  Reports,
  Status,
  SettingsPage,
  TeamsPage,
  AgentRankingPage,
} from "../components";
import { downloadCSV } from "../utils";

// ---- Tabs ----
const TABS = [
  { key: "management", label: "Management", icon: <LayoutGrid size={16} /> },
  { key: "overview", label: "Overview", icon: <LayoutGrid size={16} /> },
  {
    key: "overall-deals",
    label: "Overall Deals",
    icon: <Briefcase size={16} />,
  },
  {
    key: "deals-monitoring",
    label: "Deals Monitoring",
    icon: <Layers size={16} />,
  },
  {
    key: "agent-last-transaction",
    label: "Agent Last Transaction",
    icon: <BarChart2 size={16} />,
  },
  { key: "teams", label: "Teams", icon: <Users size={16} /> },
  {
    key: "agent-ranking",
    label: "Agent Ranking",
    icon: <ListOrdered size={16} />,
  },
  {
    key: "agent-ranking-split",
    label: "Agent Ranking Split",
    icon: <ListOrdered size={16} />,
  },
  { key: "agents", label: "Agents", icon: <Users size={16} /> },
  { key: "status", label: "Status", icon: <Target size={16} /> },
  { key: "finance", label: "Finance", icon: <Banknote size={16} /> },
  { key: "compliance", label: "Compliance", icon: <ShieldCheck size={16} /> },
  { key: "reports", label: "Reports", icon: <FileBarChart size={16} /> },
  { key: "settings", label: "Settings", icon: <Settings size={16} /> },
];

export default function RealEstateAdminApp() {
  const [tab, setTab] = useState("management");

  const Current = useMemo(() => {
    switch (tab) {
      case "management":
        return <ManagementPage />;
      case "overview":
        return <Overview />;
      case "overall-deals":
        return <OverallDealsPage />;
      case "deals-monitoring":
        return <DealsMonitoringPage />;
      case "agent-last-transaction":
        return <AgentLastTransactionPage />;
      case "teams":
        return <TeamsPage />;
      case "agent-ranking":
        return <AgentRankingPage />;
      case "agent-ranking-split":
        return <AgentRankingSplitPage />;
      case "agents":
        return <Agents />;
      case "status":
        return <Status />;
      case "finance":
        return <Finance />;
      case "compliance":
        return <Compliance />;
      case "reports":
        return <Reports />;
      case "settings":
        return <SettingsPage />;
      default:
        return <ManagementPage />;
    }
  }, [tab]);

  return (
    <div
      className="min-h-screen font-sans"
      style={{ backgroundColor: TOKENS.bg }}
    >
      <header
        className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b"
        style={{ borderColor: TOKENS.border }}
      >
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-bold"
              style={{ backgroundColor: TOKENS.primary, color: TOKENS.white }}
            >
              RE
            </div>
            <div>
              <div className="text-sm" style={{ color: TOKENS.muted }}>
                Springfield Properties
              </div>
              <div
                className="text-base font-semibold"
                style={{ color: TOKENS.text }}
              >
                Management Dashboard
              </div>
            </div>
          </div>
          <div className="flex-1" />
          <div className="hidden md:flex items-center gap-2">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-2.5"
                style={{ color: TOKENS.muted }}
              />
              <Input
                className="pl-8 w-72"
                placeholder="Search agents, listings, leads…"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 pt-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-2 rounded-xl text-sm border flex items-center gap-2 ${
                tab === t.key ? "font-semibold" : ""
              }`}
              style={{
                borderColor: TOKENS.border,
                backgroundColor:
                  tab === t.key ? TOKENS.primarySoft : TOKENS.white,
                color: tab === t.key ? TOKENS.primary : TOKENS.text,
              }}
            >
              <span
                className="shrink-0"
                style={{ color: tab === t.key ? TOKENS.primary : TOKENS.muted }}
              >
                {t.icon}
              </span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-6">{Current}</main>

      <footer
        className="py-8 text-center text-xs"
        style={{ color: TOKENS.muted }}
      >
        © {new Date().getFullYear()} Springfield Properties • Real Estate
        Management Dashboard
      </footer>
    </div>
  );
}
