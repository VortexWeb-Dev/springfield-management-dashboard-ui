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
 * Fetches the human-readable names for lead sources.
 * @returns {Promise<Array>} A list of lead source objects.
 */
export const getLeadSources = async () => {
    const response = await fetch(`${BITRIX_URL}/crm.status.list?filter[ENTITY_ID]=SOURCE`);
    if (!response.ok) throw new Error("Failed to fetch Bitrix lead sources");
    const data = await response.json();
    return data.result;
};

/**
 * Fetches the human-readable names for lead statuses (for the sales funnel).
 * @returns {Promise<Array>} A list of lead status objects.
 */
export const getLeadStatuses = async () => {
    const response = await fetch(`${BITRIX_URL}/crm.status.list?filter[ENTITY_ID]=STATUS`);
    if (!response.ok) throw new Error("Failed to fetch Bitrix lead statuses");
    const data = await response.json();
    return data.result;
};

/**
 * Fetches the definitions for all lead fields.
 * @returns {Promise<Object>} The fields definition object.
 */
export const getLeadFields = async () => {
  const response = await fetch(`${BITRIX_URL}/crm.lead.fields`);
  if (!response.ok) throw new Error("Failed to fetch Bitrix lead fields");
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
    // Conditionally create the date filter string
    const dateFilter = year 
      ? `&filter[>=DATE_CREATE]=${year}-01-01T00:00:00&filter[<DATE_CREATE]=${Number(year) + 1}-01-01T00:00:00`
      : '';

    // Construct the API URL with pagination and the conditional date filter
    const apiUrl = `${BITRIX_URL}/crm.deal.list?${selectParams}${dateFilter}&start=${start}`;
    
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch deals for year ${year || 'all years'}`);
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

/**
 * Fetches all leads for a specific financial year.
 * @param {string | number} year - The financial year.
 * @returns {Promise<Array>} A flat array of all lead objects.
 */
export const getLeadsByYear = async (year) => {
    let allLeads = [];
    let start = 0;
    let hasMore = true;
    const selectFields = ["*", 
        import.meta.env.VITE_FIELD_LEAD_COLLECTION_SOURCE,
        import.meta.env.VITE_FIELD_LEAD_MODE_OF_ENQUIRY,
        import.meta.env.VITE_FIELD_LEAD_PROPERTY_REFERENCE,
        import.meta.env.VITE_FIELD_LEAD_PROPERTY_LOCATION
    ];
    const selectParams = selectFields.map((field, i) => `select[${i}]=${field}`).join('&');

    while(hasMore) {
        // const apiUrl = `${BITRIX_URL}/crm.lead.list?${selectParams}&filter[>=DATE_CREATE]=${year}-01-01T00:00:00&filter[<DATE_CREATE]=${Number(year) + 1}-01-01T00:00:00&start=${start}`;
        const apiUrl = `${BITRIX_URL}/crm.lead.list?${selectParams}&filter[>DATE_CREATE]=2025-09-09&filter[<DATE_CREATE]=2025-12-31&start=${start}`;
        const response = await fetch(apiUrl);
        if(!response.ok) throw new Error(`Failed to fetch leads for year ${year}`);
        const data = await response.json();
        if (data.result && data.result.length > 0) {
            allLeads = [...allLeads, ...data.result];
        }
        hasMore = !!data.next;
        start = data.next || 0;
    }
    return allLeads;
};
