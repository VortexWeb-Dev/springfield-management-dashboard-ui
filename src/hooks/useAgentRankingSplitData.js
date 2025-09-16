import { useQuery } from "@tanstack/react-query";
import { getAgents, getAllWonDealsForYear } from "../api/bitrix";

const parseMoney = (moneyString) => {
  if (!moneyString || typeof moneyString !== "string") return 0;
  return parseFloat(moneyString.split("|")[0]) || 0;
};

const GROSS_COMM_FIELD = import.meta.env.VITE_FIELD_GROSS_COMMISSION;
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

export const useAgentRankingSplitData = (year) => {
  return useQuery({
    queryKey: ["agentRankingSplit", year],
    queryFn: async () => {
      // 1. Fetch agents and all won deals for the year in parallel
      const [agents, allDeals] = await Promise.all([
        getAgents(),
        getAllWonDealsForYear(year),
      ]);

      // 2. Initialize a data structure for each agent
      const agentPerformance = {};
      agents.forEach((agent) => {
        agentPerformance[agent.ID] = {
          id: agent.ID,
          name: `${agent.NAME || ""} ${agent.LAST_NAME || ""}`.trim(),
          totalComm: 0,
          months: MONTHS.map((m) => ({ month: m, comm: 0, rank: "-" })),
        };
      });

      // 3. Aggregate commissions from deals into the agent's monthly data
      allDeals.forEach((deal) => {
        const agentId = deal.ASSIGNED_BY_ID;
        if (agentPerformance[agentId]) {
          const monthIndex = new Date(deal.CLOSEDATE).getMonth();
          const commission = parseMoney(deal[GROSS_COMM_FIELD]);
          agentPerformance[agentId].months[monthIndex].comm += commission;
          agentPerformance[agentId].totalComm += commission;
        }
      });

      // 4. Calculate ranks for each month
      MONTHS.forEach((_, monthIndex) => {
        // Get all agents' commissions for the current month and sort them
        const monthlyRankings = Object.values(agentPerformance)
          .map((agent) => ({
            id: agent.id,
            comm: agent.months[monthIndex].comm,
          }))
          .filter((agent) => agent.comm > 0) // Only rank agents with commissions
          .sort((a, b) => b.comm - a.comm);

        // Assign ranks based on sorted position
        monthlyRankings.forEach((rankedAgent, rankIndex) => {
          agentPerformance[rankedAgent.id].months[monthIndex].rank =
            rankIndex + 1;
        });
      });

      return Object.values(agentPerformance);
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
