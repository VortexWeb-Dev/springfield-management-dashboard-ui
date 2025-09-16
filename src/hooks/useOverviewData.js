import { useQuery } from "@tanstack/react-query";
import {
  getLeadsByYear,
  getLeadSources,
  getLeadStatuses,
  getLeadFields,
} from "../api/bitrix";

const FIELD_IDS = {
  location: "UF_CRM_1724229663401", // Custom field ID for Location
};

// Helper to get today's date in YYYY-MM-DD format
const getTodayDateString = () => new Date().toISOString().split("T")[0];

export const useOverviewData = (year) => {
  return useQuery({
    queryKey: ["overviewData", year],
    queryFn: async () => {
      const todayString = getTodayDateString();

      // 1. Fetch all necessary lead-related data concurrently
      const [allLeads, leadSources, leadStatuses, leadFields] =
        await Promise.all([
          getLeadsByYear(year),
          getLeadSources(),
          getLeadStatuses(),
          getLeadFields(),
        ]);

      // 2. Create helper maps for readable names
      const leadSourceMap = new Map(
        leadSources.map((s) => [s.STATUS_ID, s.NAME])
      );
      const leadStatusMap = new Map(
        leadStatuses.map((s) => [s.STATUS_ID, s.NAME])
      );
      const locationMap = new Map(
        leadFields[FIELD_IDS.location]?.items.map((item) => [
          item.ID,
          item.VALUE,
        ]) || []
      );

      // 3. Define what constitutes a "successful" or "open" lead
      // Bitrix uses STATUS_SEMANTIC_ID: 'S' for success, 'F' for failure. Anything else is open.
      const successfulLeads = allLeads.filter(
        (l) => l.STATUS_SEMANTIC_ID === "S"
      );
      const openLeads = allLeads.filter(
        (l) => l.STATUS_SEMANTIC_ID !== "S" && l.STATUS_SEMANTIC_ID !== "F"
      );

      // 4. Calculate KPIs based *only* on leads
      const leadsConvertedToday = successfulLeads.filter((l) =>
        l.DATE_MODIFY.startsWith(todayString)
      );

      // "Today Revenue" is the sum of opportunities from leads converted today.
      const todayRevenue = leadsConvertedToday.reduce(
        (sum, l) => sum + parseFloat(l.OPPORTUNITY || 0),
        0
      );

      // "Commission Payout" is an estimate. Here we assume a 2% commission on the opportunity value.
      const commissionPayout = todayRevenue * 0.02;

      const newLeadsCount = allLeads.filter((l) =>
        l.DATE_CREATE.startsWith(todayString)
      ).length;

      // "Active Listings" can be interpreted as the count of open leads.
      const activeListingsCount = openLeads.length;

      // NOTE: Pending Tasks requires a separate API for Bitrix Tasks which is not available. Using a placeholder.
      const pendingTasksCount = 41;

      // 5. Process data for charts
      // Sales Funnel: Aggregate all leads by their status.
      const funnelAgg = {};
      for (const lead of allLeads) {
        const statusName = leadStatusMap.get(lead.STATUS_ID) || lead.STATUS_ID;
        funnelAgg[statusName] = (funnelAgg[statusName] || 0) + 1;
      }
      const salesFunnelData = Object.entries(funnelAgg).map(
        ([stage, value]) => ({ stage, value })
      );

      // Lead Sources: Aggregate all leads by their source.
      const leadSourceAgg = {};
      for (const lead of allLeads) {
        const sourceName =
          leadSourceMap.get(lead.SOURCE_ID) || lead.SOURCE_ID || "Unknown";
        leadSourceAgg[sourceName] = (leadSourceAgg[sourceName] || 0) + 1;
      }
      const leadSourcesData = Object.entries(leadSourceAgg).map(
        ([name, value]) => ({ name, value })
      );

      // Region-wise Revenue: Aggregate the OPPORTUNITY of successful leads by location.
      const regionAgg = {};
      for (const lead of successfulLeads) {
        const locationId = lead[FIELD_IDS.location];
        const region = locationMap.get(locationId) || "Unknown Region";
        regionAgg[region] =
          (regionAgg[region] || 0) + parseFloat(lead.OPPORTUNITY || 0);
      }
      const regionRevenueData = Object.entries(regionAgg).map(
        ([name, revenue]) => ({ name, revenue })
      );

      return {
        kpis: {
          todayRevenue,
          activeListings: activeListingsCount,
          newLeads: newLeadsCount,
          pendingTasks: pendingTasksCount,
          commissionPayout,
        },
        salesFunnelData,
        leadSourcesData,
        regionRevenueData,
      };
    },
  });
};
