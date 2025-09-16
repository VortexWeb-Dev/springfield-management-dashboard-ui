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
            <Button
              href="https://crm.springfieldproperties.ae/crm/lead/details/0/?st%5Btool%5D=crm&st%5Bc_section%5D=lead_section&st%5Bc_sub_section%5D=kanban&st%5Bc_element%5D=create_button&st%5Bp1%5D=crmMode_classic&st%5Bcategory%5D=entity_operations&st%5Bevent%5D=entity_add_open&st%5Btype%5D=lead&any=details%2F0%2F"
              newTab
            >
              New Lead
            </Button>
            <Button href="/upload-listing" newTab>
              Upload Listing
            </Button>
            <Button href="/assign-task" newTab>
              Assign Task
            </Button>
            <Button href="/approve-offer" newTab>
              Approve Offer
            </Button>
            <Button href="/generate-report" newTab>
              Generate Report
            </Button>
            <Button href="/create-campaign" newTab>
              Create Campaign
            </Button>
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
