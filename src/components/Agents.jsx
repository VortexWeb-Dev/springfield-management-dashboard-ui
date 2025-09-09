import { useMemo, useState } from "react";
import { Users, Download, Search, BellRing, X } from "lucide-react";
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
import { downloadCSV } from "../utils";
import { AGENTS, Badge, Button, Card, CardBody, CardHeader, Input, Select, TEAMS, TOKENS } from "./primitives";

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

export default Agents;

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
