import { useMemo, useState } from "react";
import { Download, BarChart2 } from "lucide-react";
import { downloadCSV } from "../utils";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  Table,
  LoadingSpinner,
  TOKENS,
} from "./primitives";
import { useAgentLastTransactionData } from "../hooks/useAgentLastTransactionData";

const formatCurrency = (value) =>
  `AED ${new Intl.NumberFormat("en-AE").format(value || 0)}`;

function AgentLastTransactionPage() {
  const currentYear = new Date().getFullYear();
  const { data, isLoading, isError, error } =
    useAgentLastTransactionData(currentYear);

  const [query, setQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("All");
  const [selectedAgent, setSelectedAgent] = useState("All");

  const agentsWithTransactions = useMemo(() => {
    if (!data?.agents) return [];
    // Only include agents who have a last transaction
    return data.agents.filter((agent) => agent.lastTransactionDate);
  }, [data]);

  const filteredAgents = useMemo(() => {
    let list = agentsWithTransactions;

    if (selectedTeam !== "All") {
      list = list.filter((agent) => agent.team.includes(selectedTeam));
    }
    if (selectedAgent !== "All") {
      list = list.filter((agent) => agent.id === selectedAgent);
    }

    return list.filter((agent) =>
      [agent.name, agent.team, agent.lastTransactionProject]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }, [query, selectedTeam, selectedAgent, agentsWithTransactions]);

  const transactionHeaders = [
    "Agent",
    "Team",
    "Transaction Date",
    "Last Project",
    "Amount",
    "Gross Commission",
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
          title="Agent Last Transaction"
          icon={<BarChart2 size={18} style={{ color: TOKENS.primary }} />}
          actions={
            <div className="flex items-center gap-2">
              <Select
                className="w-40"
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
              >
                {data?.teams.map((team) => (
                  <option key={team.name} value={team.name}>
                    {team.name}
                  </option>
                ))}
              </Select>
              <Select
                className="w-40"
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
              >
                <option value="All">All Agents</option>
                {agentsWithTransactions.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </Select>
              <div className="relative">
                <Input
                  className="pl-8 w-48"
                  placeholder="Search..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Button
                variant="ghost"
                onClick={() =>
                  downloadCSV(
                    filteredAgents.map((a) => ({
                      // Map to a flat object for CSV
                      name: a.name,
                      team: a.team,
                      lastTransactionDate: a.lastTransactionDate,
                      lastTransactionProject: a.lastTransactionProject,
                      lastTransactionAmount: a.lastTransactionAmount,
                      grossCommission: a.grossCommission,
                    })),
                    [
                      "name",
                      "team",
                      "lastTransactionDate",
                      "lastTransactionProject",
                      "lastTransactionAmount",
                      "grossCommission",
                    ],
                    "agent-last-transaction.csv"
                  )
                }
              >
                <Download size={16} className="inline mr-1" /> Export
              </Button>
            </div>
          }
        />
        <CardBody>
          <Table
            headers={transactionHeaders}
            data={filteredAgents.map((a) => ({
              Agent: a.name,
              Team: a.team,
              "Transaction Date": a.lastTransactionDate,
              "Last Project": a.lastTransactionProject,
              Amount: formatCurrency(a.lastTransactionAmount),
              "Gross Commission": formatCurrency(a.grossCommission),
            }))}
          />
        </CardBody>
      </Card>
    </div>
  );
}

export default AgentLastTransactionPage;
