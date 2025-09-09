import { useMemo, useState } from "react";
import { Download, Search, BarChart2 } from "lucide-react";
import { downloadCSV } from "../utils";
import {
  AGENTS,
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  Table,
  TEAMS,
  TOKENS,
} from "./primitives";

function AgentLastTransactionPage() {
  const [query, setQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("All");
  const [selectedAgent, setSelectedAgent] = useState("All");

  const filteredAgents = useMemo(() => {
    let list = AGENTS.filter((agent) => agent.lastTransactionDate);
    if (selectedTeam !== "All") {
      list = list.filter((agent) => agent.team === selectedTeam);
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
  }, [query, selectedTeam, selectedAgent]);

  const transactionHeaders = [
    "Agent",
    "Team",
    "Transaction Date",
    "Last Project",
    "Amount",
    "Gross Commission",
  ];

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
                <option value="All">All Teams</option>
                {TEAMS.map((team) => (
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
                {filteredAgents.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </Select>
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-2.5"
                  style={{ color: TOKENS.muted }}
                />
                <Input
                  className="pl-8 w-48"
                  placeholder="Search agents..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Button
                variant="ghost"
                onClick={() =>
                  downloadCSV(
                    filteredAgents,
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
                <Download size={16} className="inline mr-1" />
                Export
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
              Amount: `AED ${a.lastTransactionAmount.toLocaleString()}`,
              "Gross Commission": `AED ${(
                a.lastTransactionAmount * 0.02
              ).toLocaleString()}`,
            }))}
          />
        </CardBody>
      </Card>
    </div>
  );
}

export default AgentLastTransactionPage;
