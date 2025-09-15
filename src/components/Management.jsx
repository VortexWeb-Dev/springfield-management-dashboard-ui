import { useState, useEffect } from "react";
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
  LoadingSpinner,
  Select,
  Table,
  TOKENS,
} from "./primitives";
import KPI from "./KPI";
import { useManagementData } from "../hooks/useManagementData";

// Helper to format numbers into currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
  }).format(value);
};

function ManagementPage() {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [selectedDeveloper, setSelectedDeveloper] = useState("All");
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [year, selectedDeveloper]);

  // Fetch data using our custom hook
  const { data, isLoading, isError, error } = useManagementData(year);

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

  // Handle loading and error states
  if (isLoading) {
    return <LoadingSpinner />; // USE THE NEW COMPONENT
  }

  if (isError) {
    return (
      <div className="text-center p-8 text-red-500">
        Error loading data: {error.message}
      </div>
    );
  }

  // Apply developer filter first
  const filteredDevelopersData = data.developersData.filter(
    (dev) => selectedDeveloper === "All" || dev.developer === selectedDeveloper
  );

  // Pagination calculations
  const totalPages = Math.max(
    1,
    Math.ceil(filteredDevelopersData.length / PAGE_SIZE)
  );
  const paginatedDevelopers = filteredDevelopersData.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

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
        <KPI
          label="Total Deals"
          value={data.kpis.totalDeals}
          valueStyle="text-3xl"
        />
        <KPI
          label="Deals Won"
          value={data.kpis.dealsWon}
          valueStyle="text-3xl"
        />
        <KPI
          label="Gross Commission"
          value={formatCurrency(data.kpis.grossCommission)}
          valueStyle="text-xl"
        />
        <KPI
          label="Net Commission"
          value={formatCurrency(data.kpis.netCommission)}
          valueStyle="text-xl"
        />
      </div>

      <Card>
        <CardHeader title="Won Deals Breakdown" />
        <CardBody>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <Table
                headers={totalDealsHeaders}
                data={data.totalDealsByMonth.map((d) => ({
                  month: d.month,
                  dealsWon: d.dealsWon,
                  propertyPrice: formatCurrency(d.propertyPrice),
                  grossCommission: formatCurrency(d.grossCommission),
                  netCommission: formatCurrency(d.netCommission),
                  paymentReceived: formatCurrency(d.paymentReceived),
                  amountReceivable: formatCurrency(d.amountReceivable),
                }))}
              />
            </div>
            <div>
              <h4 className="font-semibold mb-2" style={{ color: TOKENS.text }}>
                Property Types (All Deals)
              </h4>
              <div style={{ width: "100%", height: 250 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={data.propertyTypesData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                    >
                      {data.propertyTypesData.map((entry, index) => (
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
          title="Developers vs Property Value (All Deals)"
          actions={
            <div className="flex items-center gap-2">
              <Select
                className="w-48"
                value={selectedDeveloper}
                onChange={(e) => setSelectedDeveloper(e.target.value)}
              >
                <option value="All">All Developers</option>
                {data.allDevelopers.map((dev) => (
                  <option key={dev} value={dev}>
                    {dev}
                  </option>
                ))}
              </Select>
            </div>
          }
        />
        <CardBody>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <Table
                headers={developersHeaders}
                data={paginatedDevelopers.map((d) => ({
                  developer: d.developer,
                  value: formatCurrency(d.value),
                  percentage: `${d.percentage}%`,
                }))}
              />
              {/* Pagination controls */}
              <div className="flex items-center justify-between mt-3">
                <div className="text-sm" style={{ color: TOKENS.muted }}>
                  Showing{" "}
                  {filteredDevelopersData.length === 0
                    ? 0
                    : (currentPage - 1) * PAGE_SIZE + 1}{" "}
                  -
                  {Math.min(
                    currentPage * PAGE_SIZE,
                    filteredDevelopersData.length
                  )}{" "}
                  of {filteredDevelopersData.length}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded"
                    style={{
                      border: `1px solid ${TOKENS.border}`,
                      background: "transparent",
                    }}
                  >
                    Prev
                  </button>

                  {/* simple page numbers — show current / total */}
                  <div
                    className="px-3 py-1 text-sm"
                    style={{ color: TOKENS.text }}
                  >
                    {currentPage} / {totalPages}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded"
                    style={{
                      border: `1px solid ${TOKENS.border}`,
                      background: "transparent",
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
            <div>
              <div style={{ width: "100%", height: 250 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={paginatedDevelopers}
                      dataKey="value"
                      nameKey="developer"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                    >
                      {paginatedDevelopers.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
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
          <div style={{ width: "100%", height: 900 }}>
            <ResponsiveContainer>
              <BarChart data={data.leadSourceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                {/* increase width so long source names don't get clipped */}
                <YAxis
                  type="category"
                  dataKey="name"
                  width={200}
                  tick={{ fontSize: 14 }}
                />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill={TOKENS.primary}
                  radius={[0, 6, 6, 0]}
                  barSize={15}
                >
                  {data.leadSourceData.map((entry, index) => (
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
