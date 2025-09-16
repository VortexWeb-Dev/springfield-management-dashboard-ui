import { useQuery } from "@tanstack/react-query";
import { getAgents, getDealsByAgent } from "../api/bitrix";

const parseMoney = (moneyString) => {
  if (!moneyString || typeof moneyString !== "string") return 0;
  return parseFloat(moneyString.split("|")[0]) || 0;
};

const GROSS_COMM_FIELD = import.meta.env.VITE_FIELD_GROSS_COMMISSION;

export const useAgentRankingData = (agentId) => {
  // Query 1: Fetch the list of all agents for the dropdown
  const { data: agents, isLoading: isLoadingAgents } = useQuery({
    queryKey: ["agents"],
    queryFn: getAgents,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
    select: (data) =>
      data.map((agent) => ({
        id: agent.ID,
        name: `${agent.NAME || ""} ${agent.LAST_NAME || ""}`.trim(),
      })),
  });

  // Query 2: Fetch and process deals for the selected agent
  const {
    data: rankings,
    isLoading: isLoadingRankings,
    isError,
    error,
  } = useQuery({
    queryKey: ["agentRanking", agentId],
    queryFn: async () => {
      const deals = await getDealsByAgent(agentId);

      const monthlyData = {};
      const yearlyData = {};

      for (const deal of deals) {
        const date = new Date(deal.CLOSEDATE);
        const year = date.getFullYear();
        const month = date.toLocaleString("default", { month: "long" });
        const yearMonth = `${year}-${month}`;

        const grossComm = parseMoney(deal[GROSS_COMM_FIELD]);

        // Aggregate monthly
        if (!monthlyData[yearMonth]) {
          monthlyData[yearMonth] = { year, month, grossComm: 0 };
        }
        monthlyData[yearMonth].grossComm += grossComm;

        // Aggregate yearly
        if (!yearlyData[year]) {
          yearlyData[year] = { year, grossComm: 0 };
        }
        yearlyData[year].grossComm += grossComm;
      }

      // Process Quarterly Data from monthly aggregates
      const quarterlyData = {};
      for (const key in monthlyData) {
        const { year, month, grossComm } = monthlyData[key];
        const monthNum = new Date(Date.parse(month + " 1, 2021")).getMonth();
        const quarter = Math.floor(monthNum / 3) + 1;
        const yearQuarter = `${year}-Q${quarter}`;

        if (!quarterlyData[yearQuarter]) {
          quarterlyData[yearQuarter] = {
            year,
            quarter: `Q${quarter}`,
            grossComm: 0,
          };
        }
        quarterlyData[yearQuarter].grossComm += grossComm;
      }

      // We don't have other agents' data to compare, so "Rank" is 1 for any period with sales.
      return {
        monthly: Object.values(monthlyData)
          .map((m) => ({ ...m, rank: 1 }))
          .sort(
            (a, b) =>
              new Date(`${a.month} 1, ${a.year}`) -
              new Date(`${b.month} 1, ${b.year}`)
          ),
        quarterly: Object.values(quarterlyData)
          .map((q) => ({ ...q, rank: 1 }))
          .sort(
            (a, b) => a.year - b.year || a.quarter.localeCompare(b.quarter)
          ),
        yearly: Object.values(yearlyData)
          .map((y) => ({ ...y, rank: 1 }))
          .sort((a, b) => a.year - b.year),
      };
    },
    enabled: !!agentId, // Only run this query if an agentId is selected
  });

  return {
    agents,
    rankings,
    isLoading: isLoadingAgents || (!!agentId && isLoadingRankings),
    isError,
    error,
  };
};
