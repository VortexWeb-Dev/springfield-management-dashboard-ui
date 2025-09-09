import { useMemo, useState } from "react";
import { Download, Search, Building2, Briefcase, Layers } from "lucide-react";
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
  DEVELOPERS,
  Input,
  OVERALL_DEALS,
  PROPERTY_TYPES,
  Table,
  TOKENS,
} from "./primitives";
import KPI from "./KPI";

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

export default OverallDealsPage;
