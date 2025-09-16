import { useMemo, useState } from "react";
import { Search, ListOrdered } from "lucide-react";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  LoadingSpinner,
  TOKENS,
} from "./primitives";
import { useAgentRankingSplitData } from "../hooks/useAgentRankingSplitData";

const formatCurrency = (value) => {
  if (value === 0) return "AED 0";
  return `AED ${new Intl.NumberFormat("en-AE").format(Math.round(value))}`;
};

const MONTHS = [
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
];

function AgentRankingSplitPage() {
  const currentYear = new Date().getFullYear();
  const { data, isLoading, isError, error } =
    useAgentRankingSplitData(currentYear);
  const [query, setQuery] = useState("");

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((d) =>
      d.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, data]);

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
          title={`Agent Ranking Split (${currentYear})`}
          icon={<ListOrdered size={18} style={{ color: TOKENS.primary }} />}
          actions={
            <div className="relative">
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
            <table className="min-w-full text-sm border-collapse">
              <thead>
                <tr className="text-left" style={{ color: TOKENS.muted }}>
                  <th className="py-2 px-3 sticky left-0 bg-white z-10 border-b border-r">
                    Agent Name
                  </th>
                  {MONTHS.map((m) => (
                    <th key={m} className="py-2 px-3 text-center border-b">
                      {m}
                    </th>
                  ))}
                  <th className="py-2 px-3 text-right border-b">Total Comm</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((agent) => (
                  <tr
                    key={agent.id}
                    className="border-t hover:bg-gray-50"
                    style={{ borderColor: TOKENS.border }}
                  >
                    <td className="py-2 px-3 sticky left-0 bg-white z-10 font-medium border-r">
                      {agent.name}
                    </td>
                    {agent.months.map((m, i) => (
                      <td key={i} className="py-2 px-3">
                        <div
                          className={`p-2 rounded-lg flex flex-col items-center justify-center text-center ${
                            m.comm > 0 ? "bg-blue-50" : "bg-gray-50"
                          }`}
                        >
                          <span
                            className="text-xs font-bold"
                            style={{ color: TOKENS.primary }}
                          >
                            {m.rank}
                          </span>
                          <span
                            className="text-[11px] font-mono"
                            style={{ color: TOKENS.muted }}
                          >
                            {formatCurrency(m.comm)}
                          </span>
                        </div>
                      </td>
                    ))}
                    <td className="py-2 px-3 text-right font-semibold">
                      {formatCurrency(agent.totalComm)}
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
