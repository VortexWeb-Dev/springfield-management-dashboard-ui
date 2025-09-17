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
  const response = await fetch(
    `${BITRIX_URL}/crm.status.list?filter[ENTITY_ID]=SOURCE`
  );
  if (!response.ok) throw new Error("Failed to fetch Bitrix lead sources");
  const data = await response.json();
  return data.result;
};

/**
 * Fetches the human-readable names for lead statuses (for the sales funnel).
 * @returns {Promise<Array>} A list of lead status objects.
 */
export const getLeadStatuses = async () => {
  const response = await fetch(
    `${BITRIX_URL}/crm.status.list?filter[ENTITY_ID]=STATUS`
  );
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

  const selectParams = selectFields
    .map((field, i) => `select[${i}]=${field}`)
    .join("&");

  while (hasMore) {
    // Conditionally create the date filter string
    const dateFilter = year
      ? `&filter[>=DATE_CREATE]=${year}-01-01T00:00:00&filter[<DATE_CREATE]=${
          Number(year) + 1
        }-01-01T00:00:00`
      : "";

    // Construct the API URL with pagination and the conditional date filter
    const apiUrl = `${BITRIX_URL}/crm.deal.list?${selectParams}${dateFilter}&start=${start}`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch deals for year ${year || "all years"}`);
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
 * Fetches a paginated list of deals.
 * @param {number} start - The starting record number for pagination.
 * @returns {Promise<Object>} An object containing the list of deals and the total count.
 */
export const getDealsPaginated = async (start = 0) => {
  const selectFields = [
    "ID",
    "CLOSEDATE",
    "OPPORTUNITY",
    import.meta.env.VITE_FIELD_PROJECT_NAME,
    import.meta.env.VITE_FIELD_TRANSACTION_TYPE,
    import.meta.env.VITE_FIELD_AGENT_NAME,
    import.meta.env.VITE_FIELD_PROPERTY_REFERENCE,
    import.meta.env.VITE_FIELD_DEVELOPER_NAME,
    import.meta.env.VITE_FIELD_PROPERTY_TYPE,
    import.meta.env.VITE_FIELD_GROSS_COMMISSION,
    import.meta.env.VITE_FIELD_NET_COMMISSION,
    import.meta.env.VITE_FIELD_PAYMENT_RECEIVED,
    import.meta.env.VITE_FIELD_AMOUNT_RECEIVABLE,
  ];
  const selectParams = selectFields
    .filter(Boolean)
    .map((field, i) => `select[${i}]=${field}`)
    .join("&");
  const apiUrl = `${BITRIX_URL}/crm.deal.list?${selectParams}&start=${start}`;

  const response = await fetch(apiUrl);
  if (!response.ok)
    throw new Error("Failed to fetch paginated deals from Bitrix");

  const data = await response.json();
  return {
    deals: data.result || [],
    total: data.total || 0,
  };
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
  const selectFields = [
    "*",
    import.meta.env.VITE_FIELD_LEAD_COLLECTION_SOURCE,
    import.meta.env.VITE_FIELD_LEAD_MODE_OF_ENQUIRY,
    import.meta.env.VITE_FIELD_LEAD_PROPERTY_REFERENCE,
    import.meta.env.VITE_FIELD_LEAD_PROPERTY_LOCATION,
  ];
  const selectParams = selectFields
    .map((field, i) => `select[${i}]=${field}`)
    .join("&");

  while (hasMore) {
    // const apiUrl = `${BITRIX_URL}/crm.lead.list?${selectParams}&filter[>=DATE_CREATE]=${year}-01-01T00:00:00&filter[<DATE_CREATE]=${Number(year) + 1}-01-01T00:00:00&start=${start}`;
    const apiUrl = `${BITRIX_URL}/crm.lead.list?${selectParams}&filter[>DATE_CREATE]=2025-09-09&filter[<DATE_CREATE]=2025-12-31&start=${start}`;
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`Failed to fetch leads for year ${year}`);
    const data = await response.json();
    if (data.result && data.result.length > 0) {
      allLeads = [...allLeads, ...data.result];
    }
    hasMore = !!data.next;
    start = data.next || 0;
  }
  return allLeads;
};

/**
 * Fetches all active users, handling pagination.
 * @returns {Promise<Array>} A flat array of all user objects.
 */
export const getAllUsers = async () => {
  let allUsers = [];
  let start = 0;
  let hasMore = true;

  while (hasMore) {
    const apiUrl = `${BITRIX_URL}/user.get?filter[ACTIVE]=true&start=${start}`;
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Failed to fetch users from Bitrix");
    const data = await response.json();

    allUsers = allUsers.concat(data.result || []);

    if (data.next) {
      start = data.next;
    } else {
      hasMore = false;
    }
  }
  return allUsers;
};

/**
 * Fetches all departments.
 * @returns {Promise<Array>} A flat array of all department objects.
 */
export const getDepartments = async () => {
  const apiUrl = `${BITRIX_URL}/department.get`;
  const response = await fetch(apiUrl);
  if (!response.ok) throw new Error("Failed to fetch departments from Bitrix");
  const data = await response.json();
  return data.result || [];
};

/**
 * Fetches all users who are part of the designated Sales Department.
 * @returns {Promise<Array>} An array of agent objects.
 */
export const getAgents = async () => {
  const users = await getAllUsers();
  const salesDeptId = import.meta.env.VITE_SALES_DEPARTMENT_ID;
  if (!salesDeptId) {
    console.warn(
      "VITE_SALES_DEPARTMENT_ID is not set in .env file. Returning all users."
    );
    // return users;
  }
  return users;
  return users.filter(
    (user) =>
      user.UF_DEPARTMENT &&
      user.UF_DEPARTMENT.includes(parseInt(salesDeptId, 10))
  );
};

/**
 * Fetches all "won" deals for a specific agent.
 * @param {string} agentId - The ID of the agent.
 * @returns {Promise<Array>} A flat array of deal objects for that agent.
 */
export const getDealsByAgent = async (agentId) => {
  if (!agentId) return [];

  let allDeals = [];
  let start = 0;
  let hasMore = true;

  const wonStageId = import.meta.env.VITE_DEAL_STAGE_ID_WON;
  const selectFields = [
    "CLOSEDATE",
    import.meta.env.VITE_FIELD_GROSS_COMMISSION,
  ];
  const selectParams = selectFields
    .filter(Boolean)
    .map((field, i) => `select[${i}]=${field}`)
    .join("&");

  while (hasMore) {
    const apiUrl = `${BITRIX_URL}/crm.deal.list?${selectParams}&filter[ASSIGNED_BY_ID]=${agentId}filter[STAGE_ID]=${wonStageId}&start=${start}`;
    const response = await fetch(apiUrl);
    if (!response.ok)
      throw new Error(`Failed to fetch deals for agent ${agentId}`);
    const data = await response.json();

    allDeals = allDeals.concat(data.result || []);

    if (data.next) {
      start = data.next;
    } else {
      hasMore = false;
    }
  }
  return allDeals;
};

/**
 * Fetches all "won" deals for a given year, handling pagination.
 * This is used for calculating agent rankings.
 * @param {string | number} year - The year to fetch deals for.
 * @returns {Promise<Array>} A flat array of all "won" deal objects for the year.
 */
export const getAllWonDealsForYear = async (year) => {
  let allDeals = [];
  let start = 0;
  let hasMore = true;

  const wonStageId = import.meta.env.VITE_DEAL_STAGE_ID_WON;
  const selectFields = [
    "ASSIGNED_BY_ID",
    "CLOSEDATE",
    import.meta.env.VITE_FIELD_GROSS_COMMISSION,
  ];
  const selectParams = selectFields
    .filter(Boolean)
    .map((field, i) => `select[${i}]=${field}`)
    .join("&");

  while (hasMore) {
    const apiUrl = `${BITRIX_URL}/crm.deal.list?${selectParams}&filter[STAGE_ID]=${wonStageId}&filter[>=CLOSEDATE]=${year}-01-01T00:00:00&filter[<=CLOSEDATE]=${year}-12-31T23:59:59&start=${start}`;
    const response = await fetch(apiUrl);
    if (!response.ok)
      throw new Error(`Failed to fetch won deals for year ${year}`);
    const data = await response.json();

    allDeals = allDeals.concat(data.result || []);

    if (data.next) {
      start = data.next;
    } else {
      hasMore = false;
    }
  }
  return allDeals;
};

/**
 * Fetches all leads for a given year, handling pagination.
 * @param {string | number} year - The year to fetch leads for.
 * @returns {Promise<Array>} A flat array of all lead objects for the year.
 */
export const getAllLeadsForYear = async (year) => {
  let allLeads = [];
  let start = 0;
  let hasMore = true;

  const selectFields = [
    "ID",
    "ASSIGNED_BY_ID",
    "DATE_CREATE",
    "SOURCE_ID",
    "STATUS_ID",
  ];

  // The base URL without any query parameters
  const baseUrl = `${BITRIX_URL}/crm.lead.list`;

  while (hasMore) {
    // Use URLSearchParams to build the query string correctly
    const params = new URLSearchParams();

    // 1. Add select fields
    selectFields.forEach((field, index) => {
      params.append(`select[${index}]`, field);
    });

    // 2. Add filter fields (this will be correctly encoded)
    // TODO: Adjust the date range as needed
    // params.append('filter[>=DATE_CREATE]', `${year}-01-01T00:00:00`);
    // params.append('filter[<DATE_CREATE]', `${Number(year) + 1}-01-01T00:00:00`);
    params.append("filter[>=DATE_CREATE]", `${year}-09-12T00:00:00`);
    params.append("filter[<=DATE_CREATE]", `${year}-12-31T23:59:59`);

    // 3. Add the pagination start parameter
    params.append("start", start);

    // 4. Construct the final, properly encoded URL
    const apiUrl = `${baseUrl}?${params.toString()}`;

    console.log("Fetching leads from URL:", apiUrl);
    const response = await fetch(apiUrl);

    if (!response.ok) {
      // It's helpful to log the error response from the server
      const errorData = await response.text();
      throw new Error(
        `Failed to fetch leads for year ${year}. Status: ${response.status}. Response: ${errorData}`
      );
    }

    const data = await response.json();

    if (data.result && data.result.length > 0) {
      allLeads = allLeads.concat(data.result);
    }

    console.log(
      `Fetched ${data.result?.length || 0} leads, total so far: ${
        allLeads.length
      }`
    );

    // Check for the 'next' property to continue pagination
    if (data.next) {
      start = data.next;
    } else {
      hasMore = false;
    }
  }

  return allLeads;
};
