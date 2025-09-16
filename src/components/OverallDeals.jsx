import { useMemo, useState } from "react";
import { Download, Building2, Briefcase, Layers } from "lucide-react";
import {
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { downloadCSV } from "../utils";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CHART_COLORS,
  LoadingSpinner,
  Input,
  Table,
  TOKENS,
} from "./primitives";
import KPI from "./KPI";
import { useOverallDealsData } from "../hooks/useOverallDealsData";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED" }).format(
    value || 0
  );

function OverallDealsPage() {
  const { data, isLoading, isError, error } = useOverallDealsData();

  const [dealQuery, setDealQuery] = useState("");
  const [developerQuery, setDeveloperQuery] = useState("");

  const filteredDeals = useMemo(() => {
    if (!data?.monthlyDealsData) return [];
    return data.monthlyDealsData.filter((d) =>
      d.month.toLowerCase().includes(dealQuery.toLowerCase())
    );
  }, [data, dealQuery]);

  const filteredDevelopers = useMemo(() => {
    if (!data?.developersData) return [];
    return data.developersData.filter((d) =>
      d.developer.toLowerCase().includes(developerQuery.toLowerCase())
    );
  }, [data, developerQuery]);

  // MODIFIED: Simplified the chart data preparation.
  // This now only sanitizes the data (ensures percentage is a number) without grouping into "Other".
  const developerChartData = useMemo(() => {
    if (!filteredDevelopers) return [];

    // Ensure the dataKey value is a number for every developer.
    return filteredDevelopers.map((dev) => ({
      ...dev,
      totalPropertyPercentage: parseFloat(dev.totalPropertyPercentage) || 0,
    }));
  }, [filteredDevelopers]);

  const dealsHeaders = [
    "Month",
    "Deals Won",
    "Property Price",
    "Gross Commission",
    "Net Commission",
    "Payment Received",
    "Amount Receivable",
  ];
  const developersHeaders = ["Developer", "Total Property Value", "Percentage"];

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
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI label="Total Deals" value={data.kpis.totalDeals} />
        <KPI label="Deals Won" value={data.kpis.dealsWon} />
        <KPI
          label="Gross Commission"
          value={formatCurrency(data.kpis.grossCommission)}
        />
        <KPI
          label="Net Commission"
          value={formatCurrency(data.kpis.netCommission)}
        />
      </div>

      <Card>
        <CardHeader
          title="Overall Deals"
          icon={<Briefcase size={18} style={{ color: TOKENS.primary }} />}
          actions={
            <div className="flex items-center gap-2">
              <div className="relative">
                <Input
                  className="pl-8"
                  placeholder="Search month..."
                  value={dealQuery}
                  onChange={(e) => setDealQuery(e.target.value)}
                />
              </div>
              <Button
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
              ...d,
              propertyPrice: formatCurrency(d.propertyPrice),
              grossCommission: formatCurrency(d.grossCommission),
              netCommission: formatCurrency(d.netCommission),
              paymentReceived: formatCurrency(d.paymentReceived),
              amountReceivable: formatCurrency(d.amountReceivable),
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
              <div className="min-w-0">
                <Table
                  headers={developersHeaders}
                  data={filteredDevelopers.map((d) => ({
                    developer: d.developer,
                    totalPropertyValue: formatCurrency(d.totalPropertyValue),
                    totalPropertyPercentage: `${(
                      parseFloat(d.totalPropertyPercentage) || 0
                    ).toFixed(2)}%`,
                  }))}
                />
              </div>
              <div className="min-w-0">
                <div style={{ width: "100%", height: 400 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={developerChartData}
                        dataKey="totalPropertyPercentage"
                        nameKey="developer"
                        outerRadius={100}
                      >
                        {developerChartData.map((_, i) => (
                          <Cell
                            key={`cell-${i}`}
                            fill={CHART_COLORS[i % CHART_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip
                        formatter={(value) =>
                          `${parseFloat(value).toFixed(2)}%`
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
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
            <div style={{ width: "100%", height: 400 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data.propertyTypesData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                  >
                    {data.propertyTypesData.map((_, i) => (
                      <Cell
                        key={`cell-${i}`}
                        fill={CHART_COLORS[i % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip formatter={(value, name) => [value, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default OverallDealsPage;
