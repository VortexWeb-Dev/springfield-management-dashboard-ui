// Get environment variables
const BITRIX_URL = import.meta.env.VITE_BITRIX_WEBHOOK_URL;
const FIELD_DEVELOPER = import.meta.env.VITE_FIELD_DEVELOPER_NAME;
const FIELD_GROSS_COMMISSION = import.meta.env.VITE_FIELD_GROSS_COMMISSION;
const FIELD_NET_COMMISSION = import.meta.env.VITE_FIELD_NET_COMMISSION;
const FIELD_PAYMENT_RECEIVED = import.meta.env.VITE_FIELD_PAYMENT_RECEIVED;
const FIELD_PROPERTY_TYPE = import.meta.env.VITE_FIELD_PROPERTY_TYPE;
const FIELD_AMOUNT_RECEIVABLE = import.meta.env.VITE_FIELD_AMOUNT_RECEIVABLE;

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
 * Fetches list of statuses for the SOURCE entity so we can map source IDs -> human names.
 * @returns {Promise<Array>} Array of status objects like { ID, ENTITY_ID, STATUS_ID, NAME }
 */
export const getStatusList = async () => {
  const apiUrl = `${BITRIX_URL}/crm.status.list?filter[ENTITY_ID]=SOURCE`;
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch source statuses");
  }
  const data = await response.json();
  return data.result || [];
};


/**
 * Fetches all deals for a specific financial year based on their creation date.
 * Handles Bitrix API pagination automatically to retrieve all records.
 * @param {string | number} year - The financial year to fetch deals for.
 * @returns {Promise<Array>} A flat array of all deal objects.
 */
export const getDealsByYear = async (year) => {
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
    // Construct the API URL with filters for DATE_CREATE and pagination
    const apiUrl = `${BITRIX_URL}/crm.deal.list?${selectParams}&filter[>=DATE_CREATE]=${year}-01-01T00:00:00&filter[<DATE_CREATE]=${Number(year) + 1}-01-01T00:00:00&start=${start}`;
    
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
