import { LayoutGrid, Target, TrendingUp, Building2 } from "lucide-react";
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
  Button,
  Card,
  CardBody,
  CardHeader,
  LoadingSpinner,
  CHART_COLORS,
  TOKENS,
} from "./primitives";
import KPI from "./KPI";
import { useOverviewData } from "../hooks/useOverviewData";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED" }).format(
    value
  );

function Overview() {
  const currentYear = new Date().getFullYear().toString();
  const { data, isLoading, isError, error } = useOverviewData(currentYear);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  if (isError)
    return (
      <div className="text-center p-8 text-red-500">Error: {error.message}</div>
    );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-5 gap-4">
        <KPI
          label="Today's Potential Revenue"
          value={formatCurrency(data.kpis.todayRevenue)}
        />
        <KPI label="Open Leads" value={data.kpis.activeListings} />
        <KPI label="New Leads Today" value={data.kpis.newLeads} />
        <KPI label="Pending Tasks" value={data.kpis.pendingTasks} />
        <KPI
          label="Today's Est. Commission"
          value={formatCurrency(data.kpis.commissionPayout)}
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
            <Button>Upload Listing</Button>
            <Button>Assign Task</Button>
            <Button>Approve Offer</Button>
            <Button>Generate Report</Button>
            <Button>Create Campaign</Button>
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
              <BarChart data={data.salesFunnelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="stage"
                  angle={-20}
                  textAnchor="end"
                  height={50}
                />
                <YAxis />
                <Tooltip formatter={(value) => [value, "Leads"]} />
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
          <div style={{ width: "100%", height: 360 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data.leadSourcesData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  innerRadius={45}
                >
                  {data.leadSourcesData.map((_, i) => (
                    <Cell
                      key={`cell-${i}`}
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
          title="Region-wise Potential Revenue"
          icon={<Building2 size={18} style={{ color: TOKENS.primary }} />}
        />
        <CardBody>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={data.regionRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [
                    formatCurrency(value),
                    "Potential Revenue",
                  ]}
                />
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
