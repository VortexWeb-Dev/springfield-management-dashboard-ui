import { useMemo, useState } from "react";
import { Download, Search, Layers } from "lucide-react";
import { downloadCSV } from "../utils";
import { Button, Card, CardBody, CardHeader, DEALS_LIST, Input, Table, TOKENS } from "./primitives";

function DealsMonitoringPage() {
  const dealsHeaders = [
    "Transaction Date",
    "Transaction Type",
    "Deal ID",
    "Property Type",
    "Project Name",
    "Developer Name",
    "Agent Name",
    "Property ID",
    "Property Price (AED)",
    "Gross Commission (AED)",
    "Net Commission (AED)",
    "Payment Received (AED)",
    "Total Amount Received (AED)",
  ];

  const [query, setQuery] = useState("");
  const filteredDeals = useMemo(() => {
    return DEALS_LIST.filter((deal) => {
      const searchString = Object.values(deal).join(" ").toLowerCase();
      return searchString.includes(query.toLowerCase());
    });
  }, [query]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader
          title="Deals Monitoring"
          icon={<Layers size={18} style={{ color: TOKENS.primary }} />}
          actions={
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-2.5"
                  style={{ color: TOKENS.muted }}
                />
                <Input
                  className="pl-8 w-64"
                  placeholder="Search deals..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Button
                variant="ghost"
                onClick={() =>
                  downloadCSV(
                    filteredDeals,
                    dealsHeaders,
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
          <Table headers={dealsHeaders} data={filteredDeals} />
        </CardBody>
      </Card>
    </div>
  );
}

export default DealsMonitoringPage;
