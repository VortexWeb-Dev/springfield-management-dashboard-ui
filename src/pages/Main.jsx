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
import {
  TOKENS,
  AGENTS,
  TEAMS,
  LEADS,
  FUNNEL,
  REGIONS,
  OVERALL_DEALS,
  DEVELOPERS,
  PROPERTY_TYPES,
  DEALS_LIST,
  RANKING,
  QUARTERLY_RANKING,
  YEARLY_RANKING,
  MANAGEMENT_TOTAL_DEALS,
  MANAGEMENT_PROPERTY_TYPES,
  MANAGEMENT_DEVELOPERS,
  MANAGEMENT_LEAD_SOURCE,
  CHART_COLORS,
  MGMT_CHART_COLORS,
} from "../../constants";

/**
 * MANAGEMENT DASHBOARD – Multi‑Tab Clickable UI (Self‑contained)
 * Tech: React + Tailwind + Recharts + Lucide icons
 * Theme: Springfield Properties Palette. No external UI components required.
 */

// ---- Utils ----
function csvEscape(v) {
  return `"${String(v ?? "").replace(/"/g, '""')}"`;
}

function downloadCSV(data, headers, filename) {
  const lines = [headers.map(csvEscape).join(",")];
  data.forEach((row) => {
    const values = headers.map((h) =>
      row[h]
        ? typeof row[h] === "object"
          ? JSON.stringify(row[h])
          : row[h]
        : ""
    );
    lines.push(values.map(csvEscape).join(","));
  });
  const blob = new Blob([lines.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ---- Primitives ----
const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl bg-white border shadow-sm ${className}`}
    style={{ borderColor: TOKENS.border }}
  >
    {children}
  </div>
);
const CardHeader = ({ title, icon, subtitle, actions }) => (
  <div
    className="p-4 border-b flex items-center justify-between"
    style={{ borderColor: TOKENS.border }}
  >
    <div className="flex items-start gap-3">
      {icon}
      <div>
        <h3 className="text-lg font-semibold" style={{ color: TOKENS.text }}>
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs" style={{ color: TOKENS.muted }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
    <div className="flex items-center gap-2">{actions}</div>
  </div>
);
const CardBody = ({ children, className = "" }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);
const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  const base =
    "px-3 py-2 rounded-xl text-sm font-medium transition focus:outline-none focus:ring-2";
  let styles = {};
  if (variant === "primary") {
    styles = { backgroundColor: TOKENS.primary, color: TOKENS.white };
  } else if (variant === "ghost") {
    styles = {
      borderColor: TOKENS.border,
      color: TOKENS.primary,
      backgroundColor: TOKENS.white,
    };
  } else if (variant === "danger") {
    // Explicit danger variant
    styles = { backgroundColor: TOKENS.redAccent, color: TOKENS.white };
  }
  return (
    <button
      className={`${base} ${variant === "ghost" ? "border" : ""} ${className}`}
      style={styles}
      {...props}
    >
      {children}
    </button>
  );
};
const Input = (props) => (
  <input
    {...props}
    className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-1`}
    style={{ borderColor: TOKENS.border, focusBorderColor: TOKENS.primary }}
  />
);
const Select = ({ children, className = "", ...props }) => (
  <select
    {...props}
    className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${className}`}
    style={{ borderColor: TOKENS.border, focusBorderColor: TOKENS.primary }}
  >
    {children}
  </select>
);
const Badge = ({ children, type = "primary" }) => {
  let style = {};
  if (type === "primary") {
    style = { backgroundColor: TOKENS.primarySoft, color: TOKENS.primary };
  } else if (type === "danger") {
    style = { backgroundColor: TOKENS.redAccent, color: TOKENS.white };
  }
  return (
    <span className="px-2 py-1 text-xs rounded-full" style={style}>
      {children}
    </span>
  );
};
const Table = ({ headers, data }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full text-sm">
      <thead>
        <tr className="text-left" style={{ color: TOKENS.muted }}>
          {headers.map((h) => (
            <th key={h} className="py-2 pr-4 font-normal">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr
            key={i}
            className="border-t"
            style={{ borderColor: TOKENS.border }}
          >
            {Object.values(row).map((v, j) => (
              <td key={j} className="py-2 pr-4">
                {typeof v === "string" ? v : v.toLocaleString()}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ---- Tabs ----
const TABS = [
  { key: "management", label: "Management", icon: <LayoutGrid size={16} /> },
  { key: "overview", label: "Overview", icon: <LayoutGrid size={16} /> },
  // New tabs as requested
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
  // Existing tabs
  { key: "agents", label: "Agents", icon: <Users size={16} /> },
  { key: "pipeline", label: "Pipeline", icon: <Target size={16} /> },
  { key: "finance", label: "Finance", icon: <Banknote size={16} /> },
  { key: "compliance", label: "Compliance", icon: <ShieldCheck size={16} /> },
  { key: "reports", label: "Reports", icon: <FileBarChart size={16} /> },
  { key: "settings", label: "Settings", icon: <Settings size={16} /> },
];

// ---- Pages ----
function KPI({ label, value, delta, valueStyle = "text-2xl" }) {
  return (
    <Card>
      <CardBody>
        <div className="text-xs" style={{ color: TOKENS.muted }}>
          {label}
        </div>
        <div
          className={`${valueStyle} font-semibold`}
          style={{ color: TOKENS.text }}
        >
          {value}
        </div>
        {typeof delta === "number" && (
          <div
            className="text-xs mt-1"
            style={{ color: delta >= 0 ? TOKENS.primary : TOKENS.redAccent }}
          >
            {" "}
            {/* Using redAccent for negative deltas */}
            {delta >= 0 ? "+" : ""}
            {delta}% vs last month
          </div>
        )}
      </CardBody>
    </Card>
  );
}

// ---- New Management Page ----
function ManagementPage() {
  const totalDealsHeaders = [
    "Month",
    "Deals Won",
    "Property Price",
    "Gross Commission",
    "Net Commission",
    "Payment Received",
    "Amount Receivable",
  ];
  const developersHeaders = [
    "Developer",
    "Total Property Value",
    "Total Property Percentage",
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold" style={{ color: TOKENS.text }}>
          Financial Year: 2025
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI label="Total Deals" value="105" valueStyle="text-3xl" />
        <KPI label="Deals Won" value="7" valueStyle="text-3xl" />
        <KPI
          label="Gross Commission"
          value="32,277,229.00 AED"
          valueStyle="text-xl"
        />
        <KPI
          label="Net Commission"
          value="20,219,294.00 AED"
          valueStyle="text-xl"
        />
      </div>

      <Card>
        <CardHeader
          title="Total Deals"
          actions={
            <div className="flex items-center gap-2">
              <Select className="w-48">
                <option>Developer: All (Developers)</option>
              </Select>
              <Button variant="ghost">Select Developers</Button>
            </div>
          }
        />
        <CardBody>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <Table
                headers={totalDealsHeaders}
                data={MANAGEMENT_TOTAL_DEALS.map((d) => ({
                  ...d,
                  propertyPrice: d.propertyPrice.toLocaleString(),
                  grossCommission: d.grossCommission.toLocaleString(),
                  netCommission: d.netCommission.toLocaleString(),
                  paymentReceived: d.paymentReceived.toLocaleString(),
                  amountReceivable: d.amountReceivable.toLocaleString(),
                }))}
              />
            </div>
            <div>
              <h4 className="font-semibold mb-2" style={{ color: TOKENS.text }}>
                Property Type
              </h4>
              <div style={{ width: "100%", height: 250 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={MANAGEMENT_PROPERTY_TYPES}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                    >
                      {MANAGEMENT_PROPERTY_TYPES.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Developers vs Property Value"
          actions={
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-2.5"
                  style={{ color: TOKENS.muted }}
                />
                <Input
                  className="pl-8 w-48"
                  placeholder="Search Developers..."
                />
              </div>
              <Button variant="ghost">Report</Button>
            </div>
          }
        />
        <CardBody>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <Table
                headers={developersHeaders}
                data={MANAGEMENT_DEVELOPERS.map((d) => ({
                  developer: d.developer,
                  value: d.value,
                  percentage: `${d.percentage}%`,
                }))}
              />
            </div>
            <div>
              <div style={{ width: "100%", height: 250 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={MANAGEMENT_DEVELOPERS}
                      dataKey="percentage"
                      nameKey="developer"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                    >
                      {MANAGEMENT_DEVELOPERS.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Transaction Breakdown Per Lead Source" />
        <CardBody>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={MANAGEMENT_LEAD_SOURCE} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={200} />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill={TOKENS.primary}
                  radius={[0, 6, 6, 0]}
                  barSize={20}
                >
                  {MANAGEMENT_LEAD_SOURCE.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={MGMT_CHART_COLORS[index % MGMT_CHART_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function Overview() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-5 gap-4">
        <KPI
          label="Today Revenue"
          value={`AED ${(81200).toLocaleString()}`}
          delta={8}
        />
        <KPI label="Active Listings" value={342} delta={3} />
        <KPI label="New Leads" value={56} delta={12} />
        <KPI label="Pending Tasks" value={41} delta={-5} />
        <KPI
          label="Commission Payout"
          value={`AED ${(146000).toLocaleString()}`}
          delta={6}
        />
      </div>

      <Card className="xl:row-span-2">
        <CardHeader
          title="Quick Actions"
          icon={<LayoutGrid size={18} style={{ color: TOKENS.primary }} />}
        />
        <CardBody>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Button>New Lead</Button>
            <Button variant="ghost">Upload Listing</Button>
            <Button variant="ghost">Assign Task</Button>
            <Button variant="ghost">Approve Offer</Button>
            <Button variant="ghost">Generate Report</Button>
            <Button variant="ghost">Create Campaign</Button>
          </div>
        </CardBody>
      </Card>

      <Card className="xl:col-span-2">
        <CardHeader
          title="Sales Funnel"
          icon={<TrendingUp size={18} style={{ color: TOKENS.primary }} />}
        />
        <CardBody>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={FUNNEL}>
                <CartesianGrid strokeDasharray="3 3" stroke={TOKENS.border} />
                <XAxis dataKey="stage" stroke={TOKENS.muted} />
                <YAxis stroke={TOKENS.muted} />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill={TOKENS.primary}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Lead Sources"
          icon={<Target size={18} style={{ color: TOKENS.primary }} />}
        />
        <CardBody>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={LEADS}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  innerRadius={45}
                >
                  {LEADS.map((_, i) => (
                    <Cell
                      key={i}
                      fill={CHART_COLORS[i % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      <Card className="xl:col-span-3">
        <CardHeader
          title="Region-wise Revenue"
          icon={<Building2 size={18} style={{ color: TOKENS.primary }} />}
        />
        <CardBody>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={REGIONS}>
                <CartesianGrid strokeDasharray="3 3" stroke={TOKENS.border} />
                <XAxis dataKey="name" stroke={TOKENS.muted} />
                <YAxis stroke={TOKENS.muted} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke={TOKENS.primary}
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

// New: Overall Deals Page
function OverallDealsPage() {
  const [dealQuery, setDealQuery] = useState("");
  const [developerQuery, setDeveloperQuery] = useState("");

  const filteredDeals = useMemo(() => {
    return OVERALL_DEALS.filter((d) =>
      [d.month].join(" ").toLowerCase().includes(dealQuery.toLowerCase())
    );
  }, [dealQuery]);

  const filteredDevelopers = useMemo(() => {
    return DEVELOPERS.filter((d) =>
      [d.developer]
        .join(" ")
        .toLowerCase()
        .includes(developerQuery.toLowerCase())
    );
  }, [developerQuery]);

  const dealsHeaders = [
    "Month",
    "Deals Won",
    "Property Price",
    "Gross Commission",
    "Net Commission",
    "Payment Received",
    "Amount Receivable",
  ];
  const developersHeaders = [
    "Developer",
    "Total Property Value",
    "Total Property Percentage",
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI label="Total Deals" value={7} />
        <KPI label="Deals Won" value={7} />
        <KPI
          label="Gross Commission"
          value={`AED ${(321291.59).toLocaleString()}`}
        />
        <KPI
          label="Net Commission"
          value={`AED ${(3291291.59).toLocaleString()}`}
        />
      </div>

      <Card>
        <CardHeader
          title="Overall Deals"
          icon={<Briefcase size={18} style={{ color: TOKENS.primary }} />}
          actions={
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-2.5"
                  style={{ color: TOKENS.muted }}
                />
                <Input
                  className="pl-8"
                  placeholder="Search deals..."
                  value={dealQuery}
                  onChange={(e) => setDealQuery(e.target.value)}
                />
              </div>
              <Button
                variant="ghost"
                onClick={() =>
                  downloadCSV(
                    filteredDeals,
                    [
                      "month",
                      "deals",
                      "propertyPrice",
                      "grossCommission",
                      "netCommission",
                      "paymentReceived",
                      "amountReceivable",
                    ],
                    "overall-deals.csv"
                  )
                }
              >
                <Download size={16} className="inline mr-1" />
                Export
              </Button>
            </div>
          }
        />
        <CardBody>
          <Table
            headers={dealsHeaders}
            data={filteredDeals.map((d) => ({
              month: d.month,
              deals: d.deals,
              propertyPrice: `AED ${d.propertyPrice.toLocaleString()}`,
              grossCommission: `AED ${d.grossCommission.toLocaleString()}`,
              netCommission: `AED ${d.netCommission.toLocaleString()}`,
              paymentReceived: `AED ${d.paymentReceived.toLocaleString()}`,
              amountReceivable: `AED ${d.amountReceivable.toLocaleString()}`,
            }))}
          />
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader
            title="Developers vs Property Value"
            icon={<Building2 size={18} style={{ color: TOKENS.primary }} />}
            actions={
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-2.5"
                  style={{ color: TOKENS.muted }}
                />
                <Input
                  className="pl-8 w-40"
                  placeholder="Search developers..."
                  value={developerQuery}
                  onChange={(e) => setDeveloperQuery(e.target.value)}
                />
              </div>
            }
          />
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Table
                headers={developersHeaders}
                data={filteredDevelopers.map((d) => ({
                  developer: d.developer,
                  totalPropertyValue: `AED ${d.totalPropertyValue.toLocaleString()}`,
                  totalPropertyPercentage: `${d.totalPropertyPercentage}%`,
                }))}
              />
              <div style={{ width: "100%", height: 200 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={filteredDevelopers}
                      dataKey="totalPropertyPercentage"
                      nameKey="developer"
                      outerRadius={90}
                    >
                      {filteredDevelopers.map((_, i) => (
                        <Cell
                          key={i}
                          fill={CHART_COLORS[i % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Property Type"
            icon={<Layers size={18} style={{ color: TOKENS.primary }} />}
          />
          <CardBody>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={PROPERTY_TYPES}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                  >
                    {PROPERTY_TYPES.map((_, i) => (
                      <Cell
                        key={i}
                        fill={CHART_COLORS[i % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

// New: Deals Monitoring Page
function DealsMonitoringPage() {
  // Client Note: Removed 'Notification' and 'Follow-up Notification' as requested.
  const dealsHeaders = [
    "Transaction Date",
    "Transaction Type",
    "Deal ID",
    "Property Type",
    "Project Name",
    "Developer Name",
    "Agent Name",
    "Property ID",
    "Property Price (AED)",
    "Gross Commission (AED)",
    "Net Commission (AED)",
    "Payment Received (AED)",
    "Total Amount Received (AED)",
  ];

  const [query, setQuery] = useState("");
  const filteredDeals = useMemo(() => {
    return DEALS_LIST.filter((deal) => {
      const searchString = Object.values(deal).join(" ").toLowerCase();
      return searchString.includes(query.toLowerCase());
    });
  }, [query]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader
          title="Deals Monitoring"
          icon={<Layers size={18} style={{ color: TOKENS.primary }} />}
          actions={
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-2.5"
                  style={{ color: TOKENS.muted }}
                />
                <Input
                  className="pl-8 w-64"
                  placeholder="Search deals..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Button
                variant="ghost"
                onClick={() =>
                  downloadCSV(
                    filteredDeals,
                    dealsHeaders,
                    "deals-monitoring.csv"
                  )
                }
              >
                <Download size={16} className="inline mr-1" />
                Export
              </Button>
            </div>
          }
        />
        <CardBody>
          <Table headers={dealsHeaders} data={filteredDeals} />
        </CardBody>
      </Card>
    </div>
  );
}

// New: Agent Last Transaction Page
function AgentLastTransactionPage() {
  const [query, setQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("All");
  const [selectedAgent, setSelectedAgent] = useState("All");

  const filteredAgents = useMemo(() => {
    let list = AGENTS.filter((agent) => agent.lastTransactionDate);
    if (selectedTeam !== "All") {
      list = list.filter((agent) => agent.team === selectedTeam);
    }
    if (selectedAgent !== "All") {
      list = list.filter((agent) => agent.id === selectedAgent);
    }
    return list.filter((agent) =>
      [agent.name, agent.team, agent.lastTransactionProject]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }, [query, selectedTeam, selectedAgent]);

  const transactionHeaders = [
    "Agent",
    "Team",
    "Transaction Date",
    "Last Project",
    "Amount",
    "Gross Commission",
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader
          title="Agent Last Transaction"
          icon={<BarChart2 size={18} style={{ color: TOKENS.primary }} />}
          actions={
            <div className="flex items-center gap-2">
              <Select
                className="w-40"
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
              >
                <option value="All">All Teams</option>
                {TEAMS.map((team) => (
                  <option key={team.name} value={team.name}>
                    {team.name}
                  </option>
                ))}
              </Select>
              <Select
                className="w-40"
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
              >
                <option value="All">All Agents</option>
                {filteredAgents.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </Select>
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-2.5"
                  style={{ color: TOKENS.muted }}
                />
                <Input
                  className="pl-8 w-48"
                  placeholder="Search agents..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Button
                variant="ghost"
                onClick={() =>
                  downloadCSV(
                    filteredAgents,
                    [
                      "name",
                      "team",
                      "lastTransactionDate",
                      "lastTransactionProject",
                      "lastTransactionAmount",
                      "grossCommission",
                    ],
                    "agent-last-transaction.csv"
                  )
                }
              >
                <Download size={16} className="inline mr-1" />
                Export
              </Button>
            </div>
          }
        />
        <CardBody>
          <Table
            headers={transactionHeaders}
            data={filteredAgents.map((a) => ({
              Agent: a.name,
              Team: a.team,
              "Transaction Date": a.lastTransactionDate,
              "Last Project": a.lastTransactionProject,
              Amount: `AED ${a.lastTransactionAmount.toLocaleString()}`,
              "Gross Commission": `AED ${(
                a.lastTransactionAmount * 0.02
              ).toLocaleString()}`, // Mock commission calculation
            }))}
          />
        </CardBody>
      </Card>
    </div>
  );
}

// New: Teams Page
function TeamsPage() {
  return (
    <div className="space-y-4">
      {TEAMS.map((team) => (
        <Card key={team.name}>
          <CardHeader
            title={`Team ${team.name}`}
            icon={<Users size={18} style={{ color: TOKENS.primary }} />}
          />
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {team.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-3 rounded-xl border hover:shadow-sm"
                  style={{ borderColor: TOKENS.border }}
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold">{member.name}</div>
                    <div className="text-xs" style={{ color: TOKENS.muted }}>
                      {member.team}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

// New: Agent Ranking Page
function AgentRankingPage() {
  const [selectedAgent, setSelectedAgent] = useState("AG-1002");
  const agent = AGENTS.find((a) => a.id === selectedAgent) || AGENTS[0];

  const agentOptions = useMemo(() => {
    return AGENTS.map((a) => ({ id: a.id, name: a.name }));
  }, []);

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <div className="text-sm font-semibold" style={{ color: TOKENS.text }}>
            Select Agent:
          </div>
          <Select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="w-56"
          >
            {agentOptions.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader
            title="Monthly Ranking"
            subtitle={agent.name}
            icon={<ListOrdered size={18} style={{ color: TOKENS.primary }} />}
          />
          <CardBody>
            <Table
              headers={["Month", "Rank", "Gross Comm"]}
              data={RANKING.map((r) => ({
                Month: r.month,
                Rank: r.rank,
                "Gross Comm": `AED ${r.grossComm}`,
              }))}
            />
          </CardBody>
        </Card>
        <Card>
          <CardHeader
            title="Quarterly Ranking"
            subtitle={agent.name}
            icon={<ListOrdered size={18} style={{ color: TOKENS.primary }} />}
          />
          <CardBody>
            <Table
              headers={["Quarter", "Rank", "Gross Comm"]}
              data={QUARTERLY_RANKING.map((r) => ({
                Quarter: r.quarter,
                Rank: r.rank,
                "Gross Comm": `AED ${r.grossComm}`,
              }))}
            />
          </CardBody>
        </Card>
        <Card>
          <CardHeader
            title="Yearly Ranking"
            subtitle={agent.name}
            icon={<ListOrdered size={18} style={{ color: TOKENS.primary }} />}
          />
          <CardBody>
            <Table
              headers={["Year", "Rank", "Sales"]}
              data={YEARLY_RANKING.map((r) => ({
                Year: r.year,
                Rank: r.rank,
                Sales: `AED ${r.sales}`,
              }))}
            />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

// New: Agent Ranking Split Page
function AgentRankingSplitPage() {
  const agentNames = AGENTS.map((a) => a.name);
  const data = AGENTS.map((a) => ({
    name: a.name,
    months: [
      { month: "Jan", rank: "1", comm: "23,000" },
      { month: "Feb", rank: "1", comm: "25,000" },
      { month: "Mar", rank: "2", comm: "22,000" },
      { month: "Apr", rank: "1", comm: "27,000" },
      { month: "May", rank: "1", comm: "29,000" },
      { month: "Jun", rank: "2", comm: "24,000" },
      { month: "Jul", rank: "1", comm: "30,000" },
      { month: "Aug", rank: "1", comm: "32,000" },
      { month: "Sep", rank: "2", comm: "28,000" },
      { month: "Oct", rank: "1", comm: "35,000" },
      { month: "Nov", rank: "1", comm: "33,000" },
      { month: "Dec", rank: "2", comm: "30,000" },
    ],
  }));

  const [query, setQuery] = useState("");
  const filteredData = useMemo(() => {
    return data.filter((d) =>
      d.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader
          title="Agent Ranking Split"
          icon={<ListOrdered size={18} style={{ color: TOKENS.primary }} />}
          actions={
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-2.5"
                style={{ color: TOKENS.muted }}
              />
              <Input
                className="pl-8"
                placeholder="Search agents..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          }
        />
        <CardBody>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left" style={{ color: TOKENS.muted }}>
                  <th
                    className="py-2 pr-4 sticky left-0 bg-white"
                    style={{ borderColor: TOKENS.border }}
                  >
                    Agent Name
                  </th>
                  {[
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                    "Total Comm",
                  ].map((m) => (
                    <th key={m} className="py-2 pr-4">
                      {m}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((agent) => (
                  <tr
                    key={agent.name}
                    className="border-t"
                    style={{ borderColor: TOKENS.border }}
                  >
                    <td
                      className="py-2 pr-4 sticky left-0 bg-white"
                      style={{ borderColor: TOKENS.border }}
                    >
                      {agent.name}
                    </td>
                    {agent.months.map((m, i) => (
                      <td key={i} className="py-2 pr-4">
                        <div
                          className={`p-2 rounded-xl flex flex-col items-center justify-center`}
                          style={{
                            backgroundColor: TOKENS.primarySoft,
                            color: TOKENS.primary,
                          }}
                        >
                          <span className="text-xs font-semibold">
                            Rank: {m.rank}
                          </span>
                          <span
                            className="text-[10px]"
                            style={{ color: TOKENS.muted }}
                          >
                            AED {m.comm}
                          </span>
                        </div>
                      </td>
                    ))}
                    <td className="py-2 pr-4">
                      <div className="text-sm font-semibold">AED 320,000</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

// New Agent Report Card Modal
function AgentReportCardModal({ agent, onClose }) {
  if (!agent) return null;

  const monthlyTrendsData = [
    { name: "Apr", leads: 40, deals: 24, calls: 50 },
    { name: "May", leads: 30, deals: 13, calls: 60 },
    { name: "Jun", leads: 50, deals: 43, calls: 45 },
    { name: "Jul", leads: 48, deals: 29, calls: 48 },
    { name: "Aug", leads: 55, deals: 35, calls: 52 },
  ];

  const leadSourcesData = [
    { name: "Bayut", value: 400 },
    { name: "Dubizzle", value: 300 },
    { name: "Meta Ads", value: 300 },
    { name: "Referral", value: 200 },
    { name: "Website", value: 278 },
  ];

  const activityMixData = [
    { name: "Calls", value: agent.calls },
    { name: "Activities", value: agent.activities },
    { name: "Tasks", value: agent.tasks },
    { name: "Closures", value: agent.closures },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div
          className="p-4 border-b sticky top-0 bg-white z-10"
          style={{ borderColor: TOKENS.border }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={agent.image}
                alt={agent.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3
                  className="text-xl font-bold"
                  style={{ color: TOKENS.text }}
                >
                  {agent.name} — Report Card
                </h3>
                <p className="text-sm" style={{ color: TOKENS.muted }}>
                  {agent.team} • {agent.id}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() =>
                  downloadCSV(
                    [agent],
                    ["id", "name", "team", "leads", "deals", "calls", "conv"],
                    `${agent.name}_report.csv`
                  )
                }
              >
                CSV
              </Button>
              <Button variant="ghost">PDF</Button>
              <Button variant="ghost" onClick={onClose}>
                <X size={16} />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div
              className="p-4 rounded-xl border"
              style={{ borderColor: TOKENS.border }}
            >
              <p className="text-sm" style={{ color: TOKENS.muted }}>
                Leads
              </p>
              <p
                className="text-2xl font-semibold"
                style={{ color: TOKENS.text }}
              >
                {agent.leads}
              </p>
            </div>
            <div
              className="p-4 rounded-xl border"
              style={{ borderColor: TOKENS.border }}
            >
              <p className="text-sm" style={{ color: TOKENS.muted }}>
                Deals
              </p>
              <p
                className="text-2xl font-semibold"
                style={{ color: TOKENS.text }}
              >
                {agent.deals}
              </p>
            </div>
            <div
              className="p-4 rounded-xl border"
              style={{ borderColor: TOKENS.border }}
            >
              <p className="text-sm" style={{ color: TOKENS.muted }}>
                Calls
              </p>
              <p
                className="text-2xl font-semibold"
                style={{ color: TOKENS.text }}
              >
                {agent.calls}
              </p>
            </div>
            <div
              className="p-4 rounded-xl border"
              style={{ borderColor: TOKENS.border }}
            >
              <p className="text-sm" style={{ color: TOKENS.muted }}>
                Conversion
              </p>
              <p
                className="text-2xl font-semibold"
                style={{ color: TOKENS.text }}
              >
                {agent.conv}%
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader title="Monthly Trends" />
              <CardBody>
                <div style={{ height: "250px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyTrendsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="leads"
                        stroke={TOKENS.primary}
                      />
                      <Line
                        type="monotone"
                        dataKey="deals"
                        stroke={TOKENS.redAccent}
                      />
                      <Line type="monotone" dataKey="calls" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardHeader title="Lead Sources" />
              <CardBody>
                <div style={{ height: "250px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={leadSourcesData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                      >
                        {leadSourcesData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardBody>
            </Card>
          </div>

          <Card>
            <CardHeader title="Activity Mix" />
            <CardBody>
              <div style={{ height: "250px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityMixData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="value"
                      fill={TOKENS.primary}
                      radius={[6, 6, 0, 0]}
                    >
                      {activityMixData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Summary" />
            <CardBody>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-xs" style={{ color: TOKENS.muted }}>
                    Tasks
                  </p>
                  <p className="font-semibold">{agent.tasks}</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: TOKENS.muted }}>
                    Missed Leads
                  </p>
                  <p className="font-semibold">{agent.missed}</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: TOKENS.muted }}>
                    Clients
                  </p>
                  <p className="font-semibold">49</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: TOKENS.muted }}>
                    Commission Payout
                  </p>
                  <p className="font-semibold">
                    AED {agent.commissionAED.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: TOKENS.muted }}>
                    Commission %
                  </p>
                  <p className="font-semibold">{agent.commissionPct}%</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: TOKENS.muted }}>
                    Revenue
                  </p>
                  <p className="font-semibold">
                    AED {agent.revenue.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        <div
          className="p-4 border-t text-xs text-center"
          style={{ borderColor: TOKENS.border, color: TOKENS.muted }}
        >
          Prepared 28/08/2025 - VortexWeb
        </div>
      </div>
    </div>
  );
}

function Agents() {
  const [query, setQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("All");

  const filtered = useMemo(() => {
    let list = AGENTS;
    if (selectedTeam !== "All") {
      list = list.filter((a) => a.team === selectedTeam);
    }
    return list.filter((a) =>
      [a.name, a.team, a.id]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }, [query, selectedTeam]);

  const [selected, setSelected] = useState(null);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader
          title="Agent Performance"
          subtitle="Download individual reports • Compare vs team average"
          icon={<Users size={18} style={{ color: TOKENS.primary }} />}
          actions={
            <div className="flex items-center gap-2">
              <Select
                className="w-40"
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
              >
                <option value="All">All Teams</option>
                {TEAMS.map((team) => (
                  <option key={team.name} value={team.name}>
                    {team.name}
                  </option>
                ))}
              </Select>
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-2.5"
                  style={{ color: TOKENS.muted }}
                />
                <Input
                  className="pl-8 w-64"
                  placeholder="Search agents…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Button
                variant="ghost"
                onClick={() =>
                  downloadCSV(
                    filtered,
                    [
                      "id",
                      "name",
                      "team",
                      "leads",
                      "deals",
                      "activities",
                      "calls",
                      "closures",
                      "tasks",
                      "missed",
                      "conv",
                      "commissionAED",
                      "commissionPct",
                    ],
                    "agents-report.csv"
                  )
                }
              >
                <Download size={16} className="inline mr-1" />
                Export All
              </Button>
            </div>
          }
        />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((a) => (
              <div
                key={a.id}
                className="p-4 rounded-2xl border hover:shadow-sm"
                style={{ borderColor: TOKENS.border }}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={a.image}
                    alt={a.name}
                    className="w-12 h-12 rounded-full object-cover border-2"
                    style={{ borderColor: TOKENS.primary }}
                  />
                  <div>
                    <div
                      className="font-semibold"
                      style={{ color: TOKENS.text }}
                    >
                      {a.name}
                    </div>
                    <div className="text-xs" style={{ color: TOKENS.muted }}>
                      {a.team} • {a.id}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                  <div>
                    <div
                      className="text-[11px]"
                      style={{ color: TOKENS.muted }}
                    >
                      Leads
                    </div>
                    <div className="font-medium">{a.leads}</div>
                  </div>
                  <div>
                    <div
                      className="text-[11px]"
                      style={{ color: TOKENS.muted }}
                    >
                      Deals
                    </div>
                    <div className="font-medium">{a.deals}</div>
                  </div>
                  <div>
                    <div
                      className="text-[11px]"
                      style={{ color: TOKENS.muted }}
                    >
                      Calls
                    </div>
                    <div className="font-medium">{a.calls}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Badge>{a.conv}%</Badge>
                  <span className="text-xs" style={{ color: TOKENS.muted }}>
                    Conversion
                  </span>
                </div>
                <div className="mt-3">
                  <Button variant="ghost" onClick={() => setSelected(a)}>
                    Open Report Card
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <AgentReportCardModal
        agent={selected}
        onClose={() => setSelected(null)}
      />

      <Card>
        <CardHeader
          title="Coaching Opportunities"
          icon={<BellRing size={18} style={{ color: TOKENS.redAccent }} />}
        />
        <CardBody>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Auto‑flag missed leads &gt; 3 or response time &gt; 24h</li>
            <li>Listing Quality Score &lt; 85 triggers review task</li>
            <li>Low activity week: prompt call blitz challenge</li>
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}

function Pipeline() {
  const missed = [
    { id: "L-901", source: "Bayut", agent: "Omar N.", age: "36h" },
    { id: "L-877", source: "Meta", agent: "Rohit V.", age: "29h" },
    { id: "L-866", source: "Website", agent: "Aisha K.", age: "27h" },
  ];
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <Card className="xl:col-span-2">
        <CardHeader
          title="Pipeline Health"
          icon={<Target size={18} style={{ color: TOKENS.primary }} />}
        />
        <CardBody>
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={FUNNEL}>
                <CartesianGrid strokeDasharray="3 3" stroke={TOKENS.border} />
                <XAxis dataKey="stage" stroke={TOKENS.muted} />
                <YAxis stroke={TOKENS.muted} />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill={TOKENS.primary}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Missed Leads (Alert)"
          icon={<BellRing size={18} style={{ color: TOKENS.redAccent }} />}
        />
        <CardBody>
          <ul className="text-sm space-y-2">
            {missed.map((m) => (
              <li
                key={m.id}
                className="flex items-center justify-between p-2 rounded-xl border"
                style={{ borderColor: TOKENS.border }}
              >
                <span style={{ color: TOKENS.text }}>
                  {m.id} • {m.source}
                </span>
                <span style={{ color: TOKENS.muted }}>
                  {m.agent} • {m.age}
                </span>
              </li>
            ))}
          </ul>
          <Button variant="ghost" className="mt-3">
            Create Follow‑up Tasks
          </Button>
        </CardBody>
      </Card>

      <Card className="xl:col-span-3">
        <CardHeader
          title="Lead Source Effectiveness"
          icon={<Target size={18} style={{ color: TOKENS.primary }} />}
        />
        <CardBody>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={LEADS}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  innerRadius={45}
                >
                  {LEADS.map((_, i) => (
                    <Cell
                      key={i}
                      fill={CHART_COLORS[i % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function Finance() {
  const payouts = [
    { month: "May", payout: 410000, expense: 180000 },
    { month: "Jun", payout: 450000, expense: 190000 },
    { month: "Jul", payout: 470000, expense: 210000 },
    { month: "Aug", payout: 530000, expense: 230000 },
  ];
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <Card className="xl:col-span-2">
        <CardHeader
          title="Commission & Spend"
          icon={<Banknote size={18} style={{ color: TOKENS.primary }} />}
        />
        <CardBody>
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <LineChart data={payouts}>
                <CartesianGrid strokeDasharray="3 3" stroke={TOKENS.border} />
                <XAxis dataKey="month" stroke={TOKENS.muted} />
                <YAxis stroke={TOKENS.muted} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="payout"
                  stroke={TOKENS.primary}
                  strokeWidth={3}
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke={TOKENS.redAccent}
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Commission Rules"
          icon={<Settings size={18} style={{ color: TOKENS.primary }} />}
        />
        <CardBody>
          <div className="text-sm" style={{ color: TOKENS.muted }}>
            Example slab (editable in production):
          </div>
          <ul className="list-disc pl-5 text-sm mt-2">
            <li>&lt; AED 200k → 1.0%</li>
            <li>AED 200k–500k → 1.5%</li>
            <li>&gt; AED 500k → 2.0%</li>
          </ul>
          <Button variant="ghost" className="mt-3">
            Edit Slabs
          </Button>
        </CardBody>
      </Card>

      <Card className="xl:col-span-3">
        <CardHeader
          title="Upcoming Payouts"
          icon={<CalendarClock size={18} style={{ color: TOKENS.primary }} />}
        />
        <CardBody>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left" style={{ color: TOKENS.muted }}>
                  <th className="py-2 pr-4">Agent</th>
                  <th className="py-2 pr-4">Team</th>
                  <th className="py-2 pr-4">Commission (AED)</th>
                  <th className="py-2 pr-4">%</th>
                  <th className="py-2 pr-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {AGENTS.map((a) => (
                  <tr
                    key={a.id}
                    className="border-t"
                    style={{ borderColor: TOKENS.border }}
                  >
                    <td className="py-2 pr-4">{a.name}</td>
                    <td className="py-2 pr-4">{a.team}</td>
                    <td className="py-2 pr-4">
                      AED {a.commissionAED.toLocaleString()}
                    </td>
                    <td className="py-2 pr-4">{a.commissionPct}%</td>
                    <td className="py-2 pr-4">
                      <Button variant="ghost">Mark Paid</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function Compliance() {
  const items = [
    { label: "RERA/Trakheesi IDs Expiring (30d)", value: 2 },
    { label: "Visa/Contract Renewals (60d)", value: 4 },
    { label: "Listing Docs Missing", value: 7 },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((i) => (
        <Card key={i.label}>
          <CardBody>
            <div className="text-xs" style={{ color: TOKENS.muted }}>
              {i.label}
            </div>
            <div
              className="text-2xl font-semibold"
              style={{ color: TOKENS.text }}
            >
              {i.value}
            </div>
            <Button variant="ghost" className="mt-2">
              View
            </Button>
          </CardBody>
        </Card>
      ))}

      <Card className="md:col-span-3">
        <CardHeader
          title="Landlord SLA Tracker"
          icon={<Building2 size={18} style={{ color: TOKENS.primary }} />}
        />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div
              className="p-3 rounded-xl border"
              style={{ borderColor: TOKENS.border }}
            >
              <div className="text-xs" style={{ color: TOKENS.muted }}>
                Avg time to list
              </div>
              <div className="text-xl font-semibold">18h</div>
            </div>
            <div
              className="p-3 rounded-xl border"
              style={{ borderColor: TOKENS.border }}
            >
              <div className="text-xs" style={{ color: TOKENS.muted }}>
                Listing Quality ≥ 90
              </div>
              <div className="text-xl font-semibold">78%</div>
            </div>
            <div
              className="p-3 rounded-xl border"
              style={{ borderColor: TOKENS.border }}
            >
              <div className="text-xs" style={{ color: TOKENS.muted }}>
                Renewal reminders sent
              </div>
              <div className="text-xl font-semibold">42</div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function Reports() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader
          title="Custom Report Builder"
          icon={<FileBarChart size={18} style={{ color: TOKENS.primary }} />}
        />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-xs" style={{ color: TOKENS.muted }}>
                Period
              </div>
              <Select>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>This Quarter</option>
                <option>Custom</option>
              </Select>
            </div>
            <div>
              <div className="text-xs" style={{ color: TOKENS.muted }}>
                Team
              </div>
              <Select>
                <option>All</option>
                <option>Dubai Marina</option>
                <option>Business Bay</option>
                <option>JVC</option>
              </Select>
            </div>
            <div>
              <div className="text-xs" style={{ color: TOKENS.muted }}>
                Metric
              </div>
              <Select>
                <option>Revenue</option>
                <option>Deals</option>
                <option>Leads</option>
                <option>Calls</option>
                <option>Commission</option>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="ghost">
                <Download size={16} className="inline mr-1" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Weekly Digest (Email)"
          icon={<FileBarChart size={18} style={{ color: TOKENS.primary }} />}
        />
        <CardBody>
          <p className="text-sm" style={{ color: TOKENS.muted }}>
            In production, this will schedule a weekly PDF to management with
            top KPIs, agent highlights, and compliance alerts.
          </p>
          <Button variant="ghost" className="mt-2">
            Schedule
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader
          title="Branding & Theme"
          icon={<Settings size={18} style={{ color: TOKENS.primary }} />}
        />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-xs" style={{ color: TOKENS.muted }}>
                Primary Color
              </div>
              <div
                className="h-10 rounded-xl border"
                style={{
                  backgroundColor: TOKENS.primary,
                  borderColor: TOKENS.border,
                }}
              />
            </div>
            <div>
              <div className="text-xs" style={{ color: TOKENS.muted }}>
                Typography
              </div>
              <div
                className="p-3 rounded-xl border"
                style={{ borderColor: TOKENS.border }}
              >
                <div className="text-lg font-semibold">Inter / System Sans</div>
                <div className="text-xs" style={{ color: TOKENS.muted }}>
                  Clean, legible for dashboards
                </div>
              </div>
            </div>
            <div>
              <div className="text-xs" style={{ color: TOKENS.muted }}>
                Accessibility
              </div>
              <ul className="list-disc pl-5 text-sm mt-2">
                <li>High contrast color palette</li>
                <li>Icon + text cues</li>
                <li>44px touch targets</li>
              </ul>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

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
      case "pipeline":
        return <Pipeline />;
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
            <div className="relative w-58">
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
            <Button variant="ghost">New</Button>
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
