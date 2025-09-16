import { useMemo, useState } from "react";
import { Download, Layers } from "lucide-react";
import { downloadCSV } from "../utils";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Input,
  Table,
  LoadingSpinner,
  TOKENS,
} from "./primitives";
import { useDealsMonitoring } from "../hooks/useDealsMonitoring";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

function DealsMonitoringPage() {
  const [page, setPage] = useState(1);
  const { deals, totalDeals, dealsPerPage, isLoading, isError, error } =
    useDealsMonitoring(page);
  const [query, setQuery] = useState("");

  const totalPages = Math.ceil(totalDeals / dealsPerPage);

  const filteredDeals = useMemo(() => {
    if (!deals) return [];
    return deals.filter((deal) => {
      const searchString = Object.values(deal).join(" ").toLowerCase();
      return searchString.includes(query.toLowerCase());
    });
  }, [query, deals]);

  const dealsHeaders = [
    "Date",
    "Transaction Type",
    "Deal ID",
    "Property Type",
    "Project",
    "Developer",
    "Agent",
    "Property ID",
    "Price",
    "Gross Comm.",
    "Net Comm.",
    "Received",
    "Total Receivable",
  ];

  const exportHeaders = [
    "transactionDate",
    "transactionType",
    "dealId",
    "propertyType",
    "projectName",
    "developerName",
    "agentName",
    "propertyId",
    "propertyPrice",
    "grossCommission",
    "netCommission",
    "paymentReceived",
    "totalAmountReceived",
  ];

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
      <Card>
        <CardHeader
          title="Deals Monitoring"
          icon={<Layers size={18} style={{ color: TOKENS.primary }} />}
          actions={
            <div className="flex items-center gap-2">
              <div className="relative">
                <Input
                  className="pl-8 w-64"
                  placeholder="Search deals on this page..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Button
                onClick={() =>
                  downloadCSV(
                    filteredDeals,
                    exportHeaders,
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
          <Table
            headers={dealsHeaders}
            data={filteredDeals.map((d) => ({
              ...d,
              propertyPrice: formatCurrency(d.propertyPrice),
              grossCommission: formatCurrency(d.grossCommission),
              netCommission: formatCurrency(d.netCommission),
              paymentReceived: formatCurrency(d.paymentReceived),
              totalAmountReceived: formatCurrency(d.totalAmountReceived),
            }))}
          />
        </CardBody>
        <CardFooter>
          <div className="flex justify-between items-center text-sm">
            <div>
              Page {page} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default DealsMonitoringPage;
