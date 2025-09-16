import { useQuery } from "@tanstack/react-query";
import { getDealsByYear, getDealFields } from "../api/bitrix";

const parseMoney = (moneyString) => {
  if (!moneyString || typeof moneyString !== "string") return 0;
  return parseFloat(moneyString.split("|")[0]) || 0;
};

const FIELD_IDS = {
  developer: import.meta.env.VITE_FIELD_DEVELOPER_NAME,
  grossCommission: import.meta.env.VITE_FIELD_GROSS_COMMISSION,
  netCommission: import.meta.env.VITE_FIELD_NET_COMMISSION,
  paymentReceived: import.meta.env.VITE_FIELD_PAYMENT_RECEIVED,
  propertyType: import.meta.env.VITE_FIELD_PROPERTY_TYPE,
  amountReceivable: import.meta.env.VITE_FIELD_AMOUNT_RECEIVABLE,
};
const DEAL_STAGE_WON = import.meta.env.VITE_DEAL_STAGE_ID_WON;
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const useOverallDealsData = () => {
  return useQuery({
    queryKey: ["overallDealsData"],
    queryFn: async () => {
      const [allDeals, dealFields] = await Promise.all([
        getDealsByYear(),
        getDealFields(),
      ]);

      const wonDeals = allDeals.filter(
        (deal) => deal.STAGE_ID === DEAL_STAGE_WON
      );
      const propertyTypeMap = new Map(
        dealFields[FIELD_IDS.propertyType]?.items.map((item) => [
          item.ID,
          item.VALUE,
        ]) || []
      );

      // 1. Calculate KPIs
      const totalGrossCommission = wonDeals.reduce(
        (sum, deal) => sum + parseMoney(deal[FIELD_IDS.grossCommission]),
        0
      );
      const totalNetCommission = wonDeals.reduce(
        (sum, deal) => sum + parseMoney(deal[FIELD_IDS.netCommission]),
        0
      );

      // 2. Aggregate data by month
      const monthlyAgg = {};
      for (const deal of wonDeals) {
        const monthIndex = new Date(deal.CLOSEDATE).getMonth();
        const monthName = MONTH_NAMES[monthIndex];
        if (!monthlyAgg[monthName]) {
          monthlyAgg[monthName] = {
            month: monthName,
            deals: 0,
            propertyPrice: 0,
            grossCommission: 0,
            netCommission: 0,
            paymentReceived: 0,
            amountReceivable: 0,
          };
        }
        monthlyAgg[monthName].deals++;
        monthlyAgg[monthName].propertyPrice += parseFloat(
          deal.OPPORTUNITY || 0
        );
        monthlyAgg[monthName].grossCommission += parseMoney(
          deal[FIELD_IDS.grossCommission]
        );
        monthlyAgg[monthName].netCommission += parseMoney(
          deal[FIELD_IDS.netCommission]
        );
        monthlyAgg[monthName].paymentReceived += parseMoney(
          deal[FIELD_IDS.paymentReceived]
        );
        monthlyAgg[monthName].amountReceivable += parseFloat(
          deal[FIELD_IDS.amountReceivable] || 0
        );
      }
      const monthlyDealsData = Object.values(monthlyAgg);

      // 3. Aggregate data by developer
      const developerAgg = {};
      for (const deal of wonDeals) {
        const developerName = deal[FIELD_IDS.developer] || "Unknown";
        if (!developerAgg[developerName]) {
          developerAgg[developerName] = {
            developer: developerName,
            totalPropertyValue: 0,
          };
        }
        developerAgg[developerName].totalPropertyValue += parseFloat(
          deal.OPPORTUNITY || 0
        );
      }
      const totalPropertyValueAllDevelopers = Object.values(
        developerAgg
      ).reduce((sum, dev) => sum + dev.totalPropertyValue, 0);
      const developersData = Object.values(developerAgg).map((dev) => ({
        ...dev,
        totalPropertyPercentage:
          totalPropertyValueAllDevelopers > 0
            ? (
                (dev.totalPropertyValue / totalPropertyValueAllDevelopers) *
                100
              ).toFixed(2)
            : 0,
      }));

      // 4. Aggregate data by property type
      const propertyTypeAgg = {};
      for (const deal of wonDeals) {
        const typeName =
          propertyTypeMap.get(deal[FIELD_IDS.propertyType]) || "Unknown";
        propertyTypeAgg[typeName] = (propertyTypeAgg[typeName] || 0) + 1;
      }
      const propertyTypesData = Object.entries(propertyTypeAgg).map(
        ([name, value]) => ({ name, value })
      );

      return {
        kpis: {
          totalDeals: allDeals.length,
          dealsWon: wonDeals.length,
          grossCommission: totalGrossCommission,
          netCommission: totalNetCommission,
        },
        monthlyDealsData,
        developersData,
        propertyTypesData,
      };
    },
  });
};
