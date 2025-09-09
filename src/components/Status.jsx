import { Target, BellRing } from "lucide-react";
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
  CartesianGrid,
  Legend,
} from "recharts";
import { Button, Card, CardBody, CardHeader, CHART_COLORS, FUNNEL, LEADS, TOKENS } from "./primitives";

function Status() {
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

export default Status;
