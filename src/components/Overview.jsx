import {
  LayoutGrid,
  Target,
  TrendingUp,
  Building2,
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
import { Button, Card, CardBody, CardHeader, CHART_COLORS, FUNNEL, LEADS, REGIONS, TOKENS } from "./primitives";
import KPI from "./KPI";

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

export default Overview;
