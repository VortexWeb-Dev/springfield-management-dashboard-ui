import { useQuery } from "@tanstack/react-query";
import { getDealFields, getWonDealsByYear } from "../api/bitrix";

// Helper function to safely parse money fields like "95595.52|AED"
const parseMoney = (moneyString) => {
  if (!moneyString || typeof moneyString !== 'string') return 0;
  return parseFloat(moneyString.split('|')[0]) || 0;
};

// Helper function to format numbers with commas for display
const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
};

// Get field IDs from environment variables
const FIELD_IDS = {
    developer: import.meta.env.VITE_FIELD_DEVELOPER_NAME,
    grossCommission: import.meta.env.VITE_FIELD_GROSS_COMMISSION,
    netCommission: import.meta.env.VITE_FIELD_NET_COMMISSION,
    paymentReceived: import.meta.env.VITE_FIELD_PAYMENT_RECEIVED,
    propertyType: import.meta.env.VITE_FIELD_PROPERTY_TYPE,
    amountReceivable: import.meta.env.VITE_FIELD_AMOUNT_RECEIVABLE,
};

/**
 * Custom hook to fetch and process all data for the Management Dashboard.
 * @param {string} year The financial year selected by the user.
 */
export const useManagementData = (year) => {
  return useQuery({
    queryKey: ["managementData", year],
    queryFn: async () => {
      // 1. Fetch raw data in parallel for efficiency
      const [fields, deals] = await Promise.all([
        getDealFields(),
        getWonDealsByYear(year),
      ]);

      // 2. Create a mapping for Property Type IDs to readable names
      const propertyTypeMap = new Map(
        fields[FIELD_IDS.propertyType]?.items.map(item => [item.ID, item.VALUE]) || []
      );
      
      // Create a list of all developer names for the filter dropdown
      const allDevelopers = [...new Set(deals.map(d => d[FIELD_IDS.developer]).filter(Boolean))];


      // 3. Process the raw deal data into the structures needed by the UI
      const monthlyDataAgg = {};
      const propertyTypesAgg = {};
      const developersAgg = {};
      const leadSourceAgg = {};

      let totalGrossCommission = 0;
      let totalNetCommission = 0;

      for (const deal of deals) {
        const grossCommission = parseMoney(deal[FIELD_IDS.grossCommission]);
        const netCommission = parseMoney(deal[FIELD_IDS.netCommission]);
        const paymentReceived = parseMoney(deal[FIELD_IDS.paymentReceived]);
        const propertyPrice = parseFloat(deal.OPPORTUNITY) || 0;
        const amountReceivable = parseFloat(deal[FIELD_IDS.amountReceivable]) || 0;
        const developer = deal[FIELD_IDS.developer] || "Unknown";
        
        totalGrossCommission += grossCommission;
        totalNetCommission += netCommission;
        
        // Aggregate data month by month
        const month = new Date(deal.CLOSEDATE).toLocaleString('default', { month: 'long' });
        if (!monthlyDataAgg[month]) {
          monthlyDataAgg[month] = { dealsWon: 0, propertyPrice: 0, grossCommission: 0, netCommission: 0, paymentReceived: 0, amountReceivable: 0 };
        }
        monthlyDataAgg[month].dealsWon++;
        monthlyDataAgg[month].propertyPrice += propertyPrice;
        monthlyDataAgg[month].grossCommission += grossCommission;
        monthlyDataAgg[month].netCommission += netCommission;
        monthlyDataAgg[month].paymentReceived += paymentReceived;
        monthlyDataAgg[month].amountReceivable += amountReceivable;

        // Aggregate property types
        const propertyTypeId = deal[FIELD_IDS.propertyType];
        const propertyTypeName = propertyTypeMap.get(propertyTypeId) || "Unknown";
        propertyTypesAgg[propertyTypeName] = (propertyTypesAgg[propertyTypeName] || 0) + 1;

        // Aggregate developer data
        if (!developersAgg[developer]) {
            developersAgg[developer] = { totalValue: 0 };
        }
        developersAgg[developer].totalValue += propertyPrice;

        // Aggregate lead source data
        const leadSource = deal.SOURCE_ID || "Unknown"; // Assuming SOURCE_ID holds lead source
        leadSourceAgg[leadSource] = (leadSourceAgg[leadSource] || 0) + 1;
      }
      
      // 4. Format the aggregated data for the charts and tables
      const totalPropertyValue = Object.values(developersAgg).reduce((sum, dev) => sum + dev.totalValue, 0);

      const totalDealsByMonth = Object.entries(monthlyDataAgg).map(([month, data]) => ({
          month,
          ...data
      }));

      const propertyTypesData = Object.entries(propertyTypesAgg).map(([name, value]) => ({ name, value }));
      
      const developersData = Object.entries(developersAgg).map(([developer, data]) => ({
          developer,
          value: data.totalValue,
          percentage: totalPropertyValue > 0 ? ((data.totalValue / totalPropertyValue) * 100).toFixed(2) : 0,
      }));

      const leadSourceData = Object.entries(leadSourceAgg).map(([name, value]) => ({ name, value }));

      return {
        kpis: {
          totalDeals: deals.length,
          dealsWon: deals.length, // Since we only fetch won deals
          grossCommission: totalGrossCommission,
          netCommission: totalNetCommission,
        },
        allDevelopers,
        totalDealsByMonth,
        propertyTypesData,
        developersData,
        leadSourceData
      };
    },
  });
};
