import { useState } from "react";
import { Search } from "lucide-react";
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
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CHART_COLORS,
  Input,
  MANAGEMENT_DEVELOPERS,
  MANAGEMENT_LEAD_SOURCE,
  MANAGEMENT_PROPERTY_TYPES,
  MANAGEMENT_TOTAL_DEALS,
  Select,
  Table,
  TOKENS,
} from "./primitives";
import KPI from "./KPI";

function ManagementPage() {
  const [year, setYear] = useState("2025");
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

  const MGMT_CHART_COLORS = ["#003366", "#3b82f6", "#60a5fa"];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <label
            htmlFor="financial-year"
            className="text-lg font-bold"
            style={{ color: TOKENS.text }}
          >
            Financial Year:
          </label>
          <Select
            id="financial-year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-32"
          >
            <option>2025</option>
            <option>2024</option>
            <option>2023</option>
          </Select>
        </div>
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

export default ManagementPage;
