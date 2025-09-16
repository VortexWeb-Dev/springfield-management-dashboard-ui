import { useEffect, useState } from "react";
import { ListOrdered } from "lucide-react";
import {
  Card,
  CardBody,
  CardHeader,
  Select,
  Table,
  LoadingSpinner,
  TOKENS,
} from "./primitives";
import { useAgentRankingData } from "../hooks/useAgentRankingData";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED" }).format(
    value
  );

function AgentRankingPage() {
  const [selectedAgent, setSelectedAgent] = useState("");
  const { agents, rankings, isLoading, isError, error } =
    useAgentRankingData(selectedAgent);

  // Set the first agent as selected by default once the agent list has loaded
  useEffect(() => {
    if (agents && agents.length > 0 && !selectedAgent) {
      setSelectedAgent(agents[0].id);
    }
  }, [agents, selectedAgent]);

  const selectedAgentName =
    agents?.find((a) => a.id === selectedAgent)?.name || "";

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <div className="text-sm font-semibold" style={{ color: TOKENS.text }}>
            Select Agent:
          </div>
          {isLoading && !agents ? (
            <div className="text-sm text-gray-500">Loading agents...</div>
          ) : (
            <Select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="w-56"
            >
              {agents?.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </Select>
          )}
        </div>
      </Card>

      {isLoading && (
        <div className="flex justify-center p-8">
          <LoadingSpinner />
        </div>
      )}

      {isError && (
        <div className="text-center p-8 text-red-500">
          Error: {error.message}
        </div>
      )}

      {!isLoading && !isError && selectedAgent && rankings && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader
              title="Monthly Performance"
              subtitle={selectedAgentName}
              icon={<ListOrdered size={18} style={{ color: TOKENS.primary }} />}
            />
            <CardBody>
              <Table
                headers={["Month", "Gross Comm"]}
                data={rankings.monthly.map((r) => ({
                  Month: `${r.month} ${r.year}`,
                  "Gross Comm": formatCurrency(r.grossComm),
                }))}
              />
            </CardBody>
          </Card>
          <Card>
            <CardHeader
              title="Quarterly Performance"
              subtitle={selectedAgentName}
              icon={<ListOrdered size={18} style={{ color: TOKENS.primary }} />}
            />
            <CardBody>
              <Table
                headers={["Quarter", "Gross Comm"]}
                data={rankings.quarterly.map((r) => ({
                  Quarter: `${r.quarter} ${r.year}`,
                  "Gross Comm": formatCurrency(r.grossComm),
                }))}
              />
            </CardBody>
          </Card>
          <Card>
            <CardHeader
              title="Yearly Performance"
              subtitle={selectedAgentName}
              icon={<ListOrdered size={18} style={{ color: TOKENS.primary }} />}
            />
            <CardBody>
              <Table
                headers={["Year", "Gross Comm"]}
                data={rankings.yearly.map((r) => ({
                  Year: r.year,
                  "Gross Comm": formatCurrency(r.grossComm),
                }))}
              />
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}

export default AgentRankingPage;
