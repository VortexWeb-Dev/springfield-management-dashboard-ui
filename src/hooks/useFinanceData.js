import { useQuery } from "@tanstack/react-query";
import {
  getAllUsers,
  getDepartments,
  getAllWonDealsForDateRange,
} from "../api/bitrix";

const parseMoney = (moneyString) => {
  if (!moneyString || typeof moneyString !== "string") return 0;
  return parseFloat(moneyString.split("|")[0]) || 0;
};

const NET_COMM_FIELD = import.meta.env.VITE_FIELD_GROSS_COMMISSION;

const formatDate = (date) => date.toISOString().split("T")[0];

export const useFinanceData = () => {
  return useQuery({
    queryKey: ["financeData"],
    queryFn: async () => {
      const today = new Date();
      // Set start date to 6 months ago for the chart
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(today.getMonth() - 5);
      sixMonthsAgo.setDate(1);

      const startDate = formatDate(sixMonthsAgo);
      const endDate = formatDate(today);

      // 1. Fetch all necessary data in parallel
      const [users, departments, deals] = await Promise.all([
        getAllUsers(),
        getDepartments(),
        getAllWonDealsForDateRange(startDate, endDate),
      ]);

      // 2. Create helper maps for efficient data lookup
      const departmentMap = new Map(departments.map((d) => [d.ID, d.NAME]));
      const userMap = new Map(
        users.map((u) => [
          u.ID,
          {
            name: `${u.NAME || ""} ${u.LAST_NAME || ""}`.trim(),
            teamIds: u.UF_DEPARTMENT || [],
          },
        ])
      );

      // 3. Process data for Commission & Spend chart (last 6 months)
      const monthlyPayouts = {};
      for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthName = d.toLocaleString("default", { month: "short" });
        monthlyPayouts[monthName] = 0;
      }

      deals.forEach((deal) => {
        const closeDate = new Date(deal.CLOSEDATE);
        const monthName = closeDate.toLocaleString("default", {
          month: "short",
        });
        if (monthlyPayouts.hasOwnProperty(monthName)) {
          monthlyPayouts[monthName] += parseMoney(deal[NET_COMM_FIELD]);
        }
      });
      const commissionSpendData = Object.entries(monthlyPayouts).map(
        ([month, payout]) => ({ month, payout })
      );

      // 4. Process data for Upcoming Payouts table (current month)
      const currentMonthStart = formatDate(
        new Date(today.getFullYear(), today.getMonth(), 1)
      );
      const currentMonthDeals = deals.filter(
        (deal) => formatDate(new Date(deal.CLOSEDATE)) >= currentMonthStart
      );

      const agentPayouts = {};
      currentMonthDeals.forEach((deal) => {
        const agentId = deal.ASSIGNED_BY_ID;
        if (!agentId) return;
        const commission = parseMoney(deal[NET_COMM_FIELD]);
        agentPayouts[agentId] = (agentPayouts[agentId] || 0) + commission;
      });

      const upcomingPayoutsData = Object.entries(agentPayouts)
        .map(([agentId, commission]) => {
          const agentInfo = userMap.get(agentId);
          if (!agentInfo) return null;

          const teamName = agentInfo.teamIds
            .map((id) => departmentMap.get(id) || "Unknown")
            .join(", ");

          // Commission % logic is an example; replace with actual business logic if available.
          // This example uses a simple slab based on the commission amount.
          let commissionPct = 1.0;
          if (commission > 500000) commissionPct = 2.0;
          else if (commission > 200000) commissionPct = 1.5;

          return {
            id: agentId,
            name: agentInfo.name,
            team: teamName,
            commissionAED: commission,
            commissionPct: commissionPct,
          };
        })
        .filter(Boolean); // Remove null entries for agents not found

      return { commissionSpendData, upcomingPayoutsData };
    },
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
  });
};
