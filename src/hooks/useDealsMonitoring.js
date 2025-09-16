import { useQuery } from "@tanstack/react-query";
import { getDealsPaginated, getDealFields } from "../api/bitrix";
import { useMemo } from "react";

const parseMoney = (moneyString) => {
  if (!moneyString || typeof moneyString !== "string") return 0;
  return parseFloat(moneyString.split("|")[0]) || 0;
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-GB");
};

const FIELD_IDS = {
  projectName: import.meta.env.VITE_FIELD_PROJECT_NAME,
  transactionType: import.meta.env.VITE_FIELD_TRANSACTION_TYPE,
  agentName: import.meta.env.VITE_FIELD_AGENT_NAME,
  propertyRef: import.meta.env.VITE_FIELD_PROPERTY_REFERENCE,
  developer: import.meta.env.VITE_FIELD_DEVELOPER_NAME,
  propertyType: import.meta.env.VITE_FIELD_PROPERTY_TYPE,
  grossCommission: import.meta.env.VITE_FIELD_GROSS_COMMISSION,
  netCommission: import.meta.env.VITE_FIELD_NET_COMMISSION,
  paymentReceived: import.meta.env.VITE_FIELD_PAYMENT_RECEIVED,
  amountReceivable: import.meta.env.VITE_FIELD_AMOUNT_RECEIVABLE,
};

export const useDealsMonitoring = (page) => {
  const dealsPerPage = 50;
  const start = (page - 1) * dealsPerPage;

  // Fetch deal fields once and for all for mapping (aggressively cached)
  const { data: dealFields, isLoading: isLoadingFields } = useQuery({
    queryKey: ["dealFields"],
    queryFn: getDealFields,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["dealsMonitoring", page],
    queryFn: () => getDealsPaginated(start),
    enabled: !!dealFields, // Only run this query once dealFields are available
  });

  const processedDeals = useMemo(() => {
    if (!data?.deals || !dealFields) return [];

    const propertyTypeMap = new Map(
      dealFields[FIELD_IDS.propertyType]?.items.map((item) => [
        item.ID,
        item.VALUE,
      ]) || []
    );
    const transactionTypeMap = new Map(
      dealFields[FIELD_IDS.transactionType]?.items.map((item) => [
        item.ID,
        item.VALUE,
      ]) || []
    );

    return data.deals.map((deal) => ({
      transactionDate: formatDate(deal.CLOSEDATE),
      transactionType:
        transactionTypeMap.get(deal[FIELD_IDS.transactionType]) || "N/A",
      dealId: deal.ID,
      propertyType: propertyTypeMap.get(deal[FIELD_IDS.propertyType]) || "N/A",
      projectName: deal[FIELD_IDS.projectName] || "N/A",
      developerName: deal[FIELD_IDS.developer] || "N/A",
      agentName: deal[FIELD_IDS.agentName] || "N/A",
      propertyId: deal[FIELD_IDS.propertyRef] || "N/A",
      propertyPrice: parseFloat(deal.OPPORTUNITY || 0),
      grossCommission: parseMoney(deal[FIELD_IDS.grossCommission]),
      netCommission: parseMoney(deal[FIELD_IDS.netCommission]),
      paymentReceived: parseMoney(deal[FIELD_IDS.paymentReceived]),
      totalAmountReceived: parseFloat(deal[FIELD_IDS.amountReceivable] || 0), // Assuming this is total
    }));
  }, [data, dealFields]);

  return {
    deals: processedDeals,
    totalDeals: data?.total || 0,
    dealsPerPage,
    isLoading: isLoading || isLoadingFields,
    isError,
    error,
  };
};
