// Get environment variables
const BITRIX_URL = import.meta.env.VITE_BITRIX_WEBHOOK_URL;
const FIELD_DEVELOPER = import.meta.env.VITE_FIELD_DEVELOPER_NAME;
const FIELD_GROSS_COMMISSION = import.meta.env.VITE_FIELD_GROSS_COMMISSION;
const FIELD_NET_COMMISSION = import.meta.env.VITE_FIELD_NET_COMMISSION;
const FIELD_PAYMENT_RECEIVED = import.meta.env.VITE_FIELD_PAYMENT_RECEIVED;
const FIELD_PROPERTY_TYPE = import.meta.env.VITE_FIELD_PROPERTY_TYPE;
const FIELD_AMOUNT_RECEIVABLE = import.meta.env.VITE_FIELD_AMOUNT_RECEIVABLE;
const DEAL_STAGE_WON = import.meta.env.VITE_DEAL_STAGE_ID_WON;

/**
 * Fetches the definitions for all deal fields.
 * This is used to map enumeration IDs (like for Property Type) to their text values.
 * @returns {Promise<Object>} The fields definition object.
 */
export const getDealFields = async () => {
  const response = await fetch(`${BITRIX_URL}/crm.deal.fields`);
  if (!response.ok) {
    throw new Error("Failed to fetch Bitrix deal fields");
  }
  const data = await response.json();
  return data.result;
};

/**
 * Fetches all 'won' deals for a specific financial year.
 * Handles Bitrix API pagination automatically to retrieve all records.
 * @param {string | number} year - The financial year to fetch deals for.
 * @returns {Promise<Array>} A flat array of all deal objects.
 */
export const getWonDealsByYear = async (year) => {
  let allDeals = [];
  let start = 0;
  let hasMore = true;

  // Define the fields we want to select in the API call
  const selectFields = [
    "*", // Selects all standard fields
    FIELD_DEVELOPER,
    FIELD_GROSS_COMMISSION,
    FIELD_NET_COMMISSION,
    FIELD_PAYMENT_RECEIVED,
    FIELD_PROPERTY_TYPE,
    FIELD_AMOUNT_RECEIVABLE,
  ];

  const selectParams = selectFields.map((field, i) => `select[${i}]=${field}`).join('&');

  while (hasMore) {
    // Construct the API URL with filters and pagination
    const apiUrl = `${BITRIX_URL}/crm.deal.list?${selectParams}&filter[>CLOSEDATE]=${year}-01-01T00:00:00&filter[<CLOSEDATE]=${year}-12-31T23:59:59&filter[STAGE_ID]=${DEAL_STAGE_WON}&start=${start}`;
    
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch deals for year ${year}`);
    }
    const data = await response.json();

    if (data.result && data.result.length > 0) {
      allDeals = [...allDeals, ...data.result];
    }

    if (data.next) {
      start = data.next;
    } else {
      hasMore = false;
    }
  }

  return allDeals;
};
