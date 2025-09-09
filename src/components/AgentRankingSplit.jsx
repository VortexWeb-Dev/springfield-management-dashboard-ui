import { useMemo, useState } from "react";
import { Search, ListOrdered } from "lucide-react";
import { AGENTS, Card, CardBody, CardHeader, Input, TOKENS } from "./primitives";

function AgentRankingSplitPage() {
  const data = AGENTS.map((a) => ({
    name: a.name,
    months: [
      { month: "Jan", rank: "1", comm: "23,000" },
      { month: "Feb", rank: "1", comm: "25,000" },
      { month: "Mar", rank: "2", comm: "22,000" },
      { month: "Apr", rank: "1", comm: "27,000" },
      { month: "May", rank: "1", comm: "29,000" },
      { month: "Jun", rank: "2", comm: "24,000" },
      { month: "Jul", rank: "1", comm: "30,000" },
      { month: "Aug", rank: "1", comm: "32,000" },
      { month: "Sep", rank: "2", comm: "28,000" },
      { month: "Oct", rank: "1", comm: "35,000" },
      { month: "Nov", rank: "1", comm: "33,000" },
      { month: "Dec", rank: "2", comm: "30,000" },
    ],
  }));

  const [query, setQuery] = useState("");
  const filteredData = useMemo(() => {
    return data.filter((d) =>
      d.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader
          title="Agent Ranking Split"
          icon={<ListOrdered size={18} style={{ color: TOKENS.primary }} />}
          actions={
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-2.5"
                style={{ color: TOKENS.muted }}
              />
              <Input
                className="pl-8"
                placeholder="Search agents..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          }
        />
        <CardBody>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left" style={{ color: TOKENS.muted }}>
                  <th
                    className="py-2 pr-4 sticky left-0 bg-white"
                    style={{ borderColor: TOKENS.border }}
                  >
                    Agent Name
                  </th>
                  {[
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                    "Total Comm",
                  ].map((m) => (
                    <th key={m} className="py-2 pr-4">
                      {m}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((agent) => (
                  <tr
                    key={agent.name}
                    className="border-t"
                    style={{ borderColor: TOKENS.border }}
                  >
                    <td
                      className="py-2 pr-4 sticky left-0 bg-white"
                      style={{ borderColor: TOKENS.border }}
                    >
                      {agent.name}
                    </td>
                    {agent.months.map((m, i) => (
                      <td key={i} className="py-2 pr-4">
                        <div
                          className={`p-2 rounded-xl flex flex-col items-center justify-center`}
                          style={{
                            backgroundColor: TOKENS.primarySoft,
                            color: TOKENS.primary,
                          }}
                        >
                          <span className="text-xs font-semibold">
                            Rank: {m.rank}
                          </span>
                          <span
                            className="text-[10px]"
                            style={{ color: TOKENS.muted }}
                          >
                            AED {m.comm}
                          </span>
                        </div>
                      </td>
                    ))}
                    <td className="py-2 pr-4">
                      <div className="text-sm font-semibold">AED 320,000</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default AgentRankingSplitPage;
