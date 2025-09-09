import { useMemo, useState } from "react";
import { ListOrdered } from "lucide-react";
import { AGENTS, Card, CardBody, CardHeader, QUARTERLY_RANKING, RANKING, Select, Table, TOKENS, YEARLY_RANKING } from "./primitives";

function AgentRankingPage() {
  const [selectedAgent, setSelectedAgent] = useState("AG-1002");
  const agent = AGENTS.find((a) => a.id === selectedAgent) || AGENTS[0];

  const agentOptions = useMemo(() => {
    return AGENTS.map((a) => ({ id: a.id, name: a.name }));
  }, []);

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <div className="text-sm font-semibold" style={{ color: TOKENS.text }}>
            Select Agent:
          </div>
          <Select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="w-56"
          >
            {agentOptions.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader
            title="Monthly Ranking"
            subtitle={agent.name}
            icon={<ListOrdered size={18} style={{ color: TOKENS.primary }} />}
          />
          <CardBody>
            <Table
              headers={["Month", "Rank", "Gross Comm"]}
              data={RANKING.map((r) => ({
                Month: r.month,
                Rank: r.rank,
                "Gross Comm": `AED ${r.grossComm}`,
              }))}
            />
          </CardBody>
        </Card>
        <Card>
          <CardHeader
            title="Quarterly Ranking"
            subtitle={agent.name}
            icon={<ListOrdered size={18} style={{ color: TOKENS.primary }} />}
          />
          <CardBody>
            <Table
              headers={["Quarter", "Rank", "Gross Comm"]}
              data={QUARTERLY_RANKING.map((r) => ({
                Quarter: r.quarter,
                Rank: r.rank,
                "Gross Comm": `AED ${r.grossComm}`,
              }))}
            />
          </CardBody>
        </Card>
        <Card>
          <CardHeader
            title="Yearly Ranking"
            subtitle={agent.name}
            icon={<ListOrdered size={18} style={{ color: TOKENS.primary }} />}
          />
          <CardBody>
            <Table
              headers={["Year", "Rank", "Sales"]}
              data={YEARLY_RANKING.map((r) => ({
                Year: r.year,
                Rank: r.rank,
                Sales: `AED ${r.sales}`,
              }))}
            />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default AgentRankingPage;
