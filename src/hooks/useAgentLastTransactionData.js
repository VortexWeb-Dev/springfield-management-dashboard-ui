import { useQuery } from "@tanstack/react-query";
import {
  getAllUsers,
  getDepartments,
  getDealsByYear,
  getAllWonDealsForYear,
} from "../api/bitrix";

const parseMoney = (moneyString) => {
  if (!moneyString || typeof moneyString !== "string") return 0;
  return parseFloat(moneyString.split("|")[0]) || 0;
};

const GROSS_COMM_FIELD = import.meta.env.VITE_FIELD_GROSS_COMMISSION;
const PROJECT_NAME_FIELD = import.meta.env.VITE_FIELD_PROJECT_NAME;

export const useAgentLastTransactionData = (year) => {
  return useQuery({
    queryKey: ["agentLastTransaction", year],
    queryFn: async () => {
      // 1. Fetch all necessary data in parallel for efficiency
      const [users, departments, deals] = await Promise.all([
        getAllUsers(),
        getDepartments(),
        getDealsByYear(year),
      ]);

      // 2. Create helper maps for departments
      const departmentMap = new Map(departments.map((d) => [d.ID, d.NAME]));

      // 3. Find the last transaction for each agent
      const lastTransactions = {};
      deals.forEach((deal) => {
        const agentId = deal.ASSIGNED_BY_ID;
        if (!agentId) return;

        const dealDate = new Date(deal.CLOSEDATE);

        // If we haven't seen this agent yet, or if this deal is newer, store it
        if (
          !lastTransactions[agentId] ||
          dealDate > lastTransactions[agentId].dealDate
        ) {
          lastTransactions[agentId] = {
            dealDate,
            project: deal[PROJECT_NAME_FIELD] || "N/A",
            amount: parseFloat(deal.OPPORTUNITY || 0),
            grossCommission: parseMoney(deal[GROSS_COMM_FIELD]),
          };
        }
      });

      // 4. Map users to agents and attach their last transaction data
      const agents = users.map((user) => {
        const teamIds = user.UF_DEPARTMENT || [];
        const teamName = teamIds
          .map((id) => departmentMap.get(String(id)) || "Unknown")
          .join(", ");
        const lastTx = lastTransactions[user.ID];

        return {
          id: user.ID,
          name: `${user.NAME || ""} ${user.LAST_NAME || ""}`.trim(),
          team: teamName,
          lastTransactionDate: lastTx
            ? lastTx.dealDate.toISOString().split("T")[0]
            : null,
          lastTransactionProject: lastTx ? lastTx.project : null,
          lastTransactionAmount: lastTx ? lastTx.amount : 0,
          grossCommission: lastTx ? lastTx.grossCommission : 0,
        };
      });

      const teams = [
        { name: "All" },
        ...departments.map((d) => ({ name: d.NAME })),
      ];

      return { agents, teams };
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
