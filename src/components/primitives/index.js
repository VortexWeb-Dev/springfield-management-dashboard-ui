import Badge from "./badge";
import Button from "./button";
import Card from "./card";
import CardBody from "./card-body";
import CardHeader from "./card-header";
import Input from "./input";
import Select from "./select";
import Table from "./table";

const TOKENS = {
  primary: "#003366", // Dark Blue from Springfield logo text
  primarySoft: "#E6F0F8", // Very light blue for soft backgrounds
  redAccent: "#EC1D24", // Red from the Springfield logo pin (used for danger/warning)
  text: "#333333", // Dark grey for general text
  muted: "#6B7280", // Standard muted grey for secondary text
  border: "#D1D5DB", // Light grey for borders
  bg: "#F8FAFC", // Light off-white for the main background
  white: "#FFFFFF",
};

const CHART_COLORS = [
  TOKENS.primary,
  TOKENS.redAccent,
  "#6699CC",
  "#99CCFF",
  "#C0C0C0",
];

const LEADS = [
  { name: "Bayut", value: 38 },
  { name: "Dubizzle", value: 29 },
  { name: "Meta Ads", value: 14 },
  { name: "Referral", value: 11 },
  { name: "Website", value: 8 },
];

const FUNNEL = [
  { stage: "Leads", value: 310 },
  { stage: "Qualified", value: 210 },
  { stage: "Viewings", value: 124 },
  { stage: "Offers", value: 44 },
  { stage: "Closures", value: 26 },
];

const REGIONS = [
  { name: "Dubai Marina", revenue: 720000 },
  { name: "Downtown", revenue: 610000 },
  { name: "Business Bay", revenue: 480000 },
  { name: "Palm Jumeirah", revenue: 450000 },
  { name: "JVC", revenue: 330000 },
];

const OVERALL_DEALS = [
  {
    month: "January",
    deals: 0,
    propertyPrice: 0,
    grossCommission: 0,
    netCommission: 0,
    paymentReceived: 0,
    amountReceivable: 0,
  },
  {
    month: "February",
    deals: 0,
    propertyPrice: 0,
    grossCommission: 0,
    netCommission: 0,
    paymentReceived: 0,
    amountReceivable: 0,
  },
  {
    month: "March",
    deals: 0,
    propertyPrice: 0,
    grossCommission: 0,
    netCommission: 0,
    paymentReceived: 0,
    amountReceivable: 0,
  },
  {
    month: "April",
    deals: 1,
    propertyPrice: 2850000.0,
    grossCommission: 285000.0,
    netCommission: 200000.0,
    paymentReceived: 0,
    amountReceivable: 105000.0,
  },
  {
    month: "May",
    deals: 6,
    propertyPrice: 42175000.0,
    grossCommission: 4217500.0,
    netCommission: 3084197.0,
    paymentReceived: 0,
    amountReceivable: 1584747.0,
  },
  {
    month: "Total",
    deals: 7,
    propertyPrice: 45025000.0,
    grossCommission: 4502500.0,
    netCommission: 3284197.0,
    paymentReceived: 0,
    amountReceivable: 1689747.0,
  },
];

const AGENTS_AND_ADMINS = [
  {
    id: "AG-1001",
    name: "Aisha Khan",
    role: "sales",
    team: "Dubai Marina",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    leads: 142,
    deals: 28,
    activities: 110,
    calls: 238,
    closures: 22,
    tasks: 61,
    missed: 7,
    conv: 19,
    commissionAED: 68500,
    commissionPct: 16,
    revenue: 265000,
    lastTransactionDate: "2025-08-20",
    lastTransactionAmount: 2500000,
    lastTransactionProject: "Dubai Creek Tower",
  },
  {
    id: "AG-1002",
    name: "Rohit Verma",
    role: "sales",
    team: "Business Bay",
    image: "https://randomuser.me/api/portraits/men/40.jpg",
    leads: 150,
    deals: 30,
    activities: 100,
    calls: 220,
    closures: 25,
    tasks: 60,
    missed: 8,
    conv: 22,
    commissionAED: 60000,
    commissionPct: 18,
    revenue: 300000,
    lastTransactionDate: "2025-08-22",
    lastTransactionAmount: 3100000,
    lastTransactionProject: "Business Bay Central",
  },
  {
    id: "AG-1003",
    name: "Sara Ali",
    role: "sales",
    team: "Palm Jumeirah",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    leads: 105,
    deals: 21,
    activities: 84,
    calls: 190,
    closures: 18,
    tasks: 44,
    missed: 3,
    conv: 20,
    commissionAED: 47000,
    commissionPct: 16,
    revenue: 210000,
    lastTransactionDate: "2025-08-21",
    lastTransactionAmount: 2200000,
    lastTransactionProject: "Palm Jumeirah Residences",
  },
  {
    id: "AG-1004",
    name: "Omar Nasser",
    role: "sales",
    team: "JVC",
    image: "https://randomuser.me/api/portraits/men/77.jpg",
    leads: 98,
    deals: 18,
    activities: 70,
    calls: 180,
    closures: 15,
    tasks: 42,
    missed: 6,
    conv: 18,
    commissionAED: 41000,
    commissionPct: 12,
    revenue: 180000,
    lastTransactionDate: "2025-08-19",
    lastTransactionAmount: 1800000,
    lastTransactionProject: "JVC Signature Villas",
  },
  {
    id: "AG-1005",
    name: "John Smith",
    role: "admin",
    team: "Management",
    image: "https://randomuser.me/api/portraits/men/50.jpg",
    leads: 0,
    deals: 0,
    activities: 0,
    calls: 0,
    closures: 0,
    tasks: 0,
    missed: 0,
    conv: 0,
    commissionAED: 0,
    commissionPct: 0,
    revenue: 0,
    lastTransactionDate: null,
    lastTransactionAmount: null,
    lastTransactionProject: null,
  },
  {
    id: "AG-1006",
    name: "Maria Garcia",
    role: "sales",
    team: "Business Bay",
    image: "https://randomuser.me/api/portraits/women/10.jpg",
    leads: 130,
    deals: 28,
    activities: 95,
    calls: 210,
    closures: 22,
    tasks: 55,
    missed: 4,
    conv: 21,
    commissionAED: 55000,
    commissionPct: 17,
    revenue: 250000,
    lastTransactionDate: "2025-08-18",
    lastTransactionAmount: 2900000,
    lastTransactionProject: "Creek Gate",
  },
  {
    id: "AG-1007",
    name: "Zainab Ahmed",
    role: "sales",
    team: "Dubai Marina",
    image: "https://randomuser.me/api/portraits/women/22.jpg",
    leads: 115,
    deals: 23,
    activities: 88,
    calls: 195,
    closures: 19,
    tasks: 48,
    missed: 7,
    conv: 19,
    commissionAED: 49000,
    commissionPct: 15,
    revenue: 220000,
    lastTransactionDate: "2025-08-17",
    lastTransactionAmount: 2400000,
    lastTransactionProject: "Marina Gate",
  },
  {
    id: "AG-1008",
    name: "Leo Wang",
    role: "sales",
    team: "JVC",
    image: "https://randomuser.me/api/portraits/men/30.jpg",
    leads: 100,
    deals: 20,
    activities: 75,
    calls: 185,
    closures: 17,
    tasks: 45,
    missed: 5,
    conv: 17,
    commissionAED: 45000,
    commissionPct: 13,
    revenue: 200000,
    lastTransactionDate: "2025-08-16",
    lastTransactionAmount: 2000000,
    lastTransactionProject: "JVC Grand Towers",
  },
];
const AGENTS = AGENTS_AND_ADMINS.filter((agent) => agent.role === "sales");

const TEAMS = [
  {
    name: "Dubai Marina",
    members: AGENTS.filter((a) => a.team === "Dubai Marina"),
  },
  {
    name: "Business Bay",
    members: AGENTS.filter((a) => a.team === "Business Bay"),
  },
  {
    name: "Palm Jumeirah",
    members: AGENTS.filter((a) => a.team === "Palm Jumeirah"),
  },
  { name: "JVC", members: AGENTS.filter((a) => a.team === "JVC") },
];

const DEVELOPERS = [
  {
    developer: "Emaar",
    totalPropertyValue: 12516350.0,
    totalPropertyPercentage: 45.17,
  },
  {
    developer: "Nakheel",
    totalPropertyValue: 8973500.0,
    totalPropertyPercentage: 32.41,
  },
  {
    developer: "Damac",
    totalPropertyValue: 5175000.0,
    totalPropertyPercentage: 18.7,
  },
  {
    developer: "Nshama",
    totalPropertyValue: 955000.0,
    totalPropertyPercentage: 3.45,
  },
  {
    developer: "Azizi",
    totalPropertyValue: 69000.0,
    totalPropertyPercentage: 0.25,
  },
];

const PROPERTY_TYPES = [
  { name: "Apartment", value: 65, color: TOKENS.primary },
  { name: "Villa", value: 20, color: TOKENS.redAccent },
  { name: "Townhouse", value: 10, color: "#6699CC" },
  { name: "Duplex", value: 5, color: "#99CCFF" },
];

const DEALS_LIST = [
  {
    transactionDate: "2025-08-10",
    transactionType: "Sale",
    dealId: "1234",
    propertyType: "Apartment",
    projectName: "Burj Vista",
    developerName: "Emaar",
    agentName: "Aisha Khan",
    propertyId: "E123",
    propertyPrice: "4,500,000",
    grossCommission: "90,000",
    netCommission: "70,000",
    paymentReceived: "0",
    totalAmount: "90,000",
  },
  {
    transactionDate: "2025-08-08",
    transactionType: "Sale",
    dealId: "1235",
    propertyType: "Villa",
    projectName: "Palm Jumeirah",
    developerName: "Nakheel",
    agentName: "Rohit Verma",
    propertyId: "V567",
    propertyPrice: "12,000,000",
    grossCommission: "240,000",
    netCommission: "180,000",
    paymentReceived: "0",
    totalAmount: "240,000",
  },
  {
    transactionDate: "2025-08-05",
    transactionType: "Sale",
    dealId: "1236",
    propertyType: "Townhouse",
    projectName: "Damac Hills",
    developerName: "Damac",
    agentName: "Sara Ali",
    propertyId: "T890",
    propertyPrice: "3,100,000",
    grossCommission: "62,000",
    netCommission: "50,000",
    paymentReceived: "0",
    totalAmount: "62,000",
  },
  {
    transactionDate: "2025-08-03",
    transactionType: "Sale",
    dealId: "1237",
    propertyType: "Apartment",
    projectName: "JVC Grand Tower",
    developerName: "Azizi",
    agentName: "Leo Wang",
    propertyId: "A432",
    propertyPrice: "950,000",
    grossCommission: "19,000",
    netCommission: "15,000",
    paymentReceived: "0",
    totalAmount: "19,000",
  },
];

const RANKING = [
  { month: "Jan", rank: 1, grossComm: "15,000" },
  { month: "Feb", rank: 1, grossComm: "18,000" },
  { month: "Mar", rank: 1, grossComm: "22,000" },
  { month: "Apr", rank: 1, grossComm: "20,000" },
];

const QUARTERLY_RANKING = [
  { quarter: "Q1", rank: 2, grossComm: "50,000" },
  { quarter: "Q2", rank: 2, grossComm: "60,000" },
  { quarter: "Q3", rank: 3, grossComm: "55,000" },
  { quarter: "Q4", rank: 3, grossComm: "62,000" },
];

const YEARLY_RANKING = [
  { year: "2023", rank: 2, sales: "5,000,000" },
  { year: "2024", rank: 2, sales: "5,900,000" },
  { year: "2025", rank: 2, sales: "6,800,000" },
];

// ---- Data for Management Tab ----
const MANAGEMENT_TOTAL_DEALS = [
  {
    month: "January",
    dealsWon: 0,
    propertyPrice: 0,
    grossCommission: 0,
    netCommission: 0,
    paymentReceived: 0,
    amountReceivable: 0,
  },
  {
    month: "February",
    dealsWon: 0,
    propertyPrice: 0,
    grossCommission: 0,
    netCommission: 0,
    paymentReceived: 0,
    amountReceivable: 0,
  },
  {
    month: "March",
    dealsWon: 0,
    propertyPrice: 0,
    grossCommission: 0,
    netCommission: 0,
    paymentReceived: 0,
    amountReceivable: 0,
  },
  {
    month: "April",
    dealsWon: 1,
    propertyPrice: 2850000,
    grossCommission: 285000,
    netCommission: 1200000,
    paymentReceived: 0,
    amountReceivable: 1200000,
  },
  {
    month: "May",
    dealsWon: 6,
    propertyPrice: 42175000,
    grossCommission: 4217500,
    netCommission: 3084197,
    paymentReceived: 0,
    amountReceivable: 21289647,
  },
  {
    month: "Total",
    dealsWon: 7,
    propertyPrice: 45025000,
    grossCommission: 4502500,
    netCommission: 3284197,
    paymentReceived: 0,
    amountReceivable: 22489647,
  },
];

const MANAGEMENT_PROPERTY_TYPES = [
  { name: "Emaar", value: 45.17 },
  { name: "Nakheel", value: 32.41 },
];

const MANAGEMENT_DEVELOPERS = [
  { developer: "Emaar", value: "12,516,350.00", percentage: 45.17 },
  { developer: "Azizi", value: "2,175,000.00", percentage: 0.0 },
  { developer: "Damac", value: "0.00", percentage: 0.0 },
  { developer: "Al Nabni Group Real Estate", value: "0.00", percentage: 0.0 },
  { developer: "Al Nabni Group", value: "0.00", percentage: 0.0 },
  { developer: "A Qaida Real Estate", value: "0.00", percentage: 0.0 },
];

const MANAGEMENT_LEAD_SOURCE = [
  { name: "Personal Lead", value: 0 },
  { name: "Company Lead", value: 25281285.44 },
  { name: "Referral From Personal Lead", value: 1137500 },
  { name: "Referral From Company Lead", value: 0 },
  { name: "Management Lead", value: 0 },
  { name: "Agent Social Media", value: 0 },
  { name: "Agent Social Media (New Client to Seven Stones)", value: 0 },
];

export {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  Table,
  CHART_COLORS,
  TOKENS,
  TEAMS,
  LEADS,
  FUNNEL,
  REGIONS,
  OVERALL_DEALS,
  AGENTS_AND_ADMINS,
  AGENTS,
  DEVELOPERS,
  PROPERTY_TYPES,
  DEALS_LIST,
  RANKING,
  QUARTERLY_RANKING,
  YEARLY_RANKING,
  MANAGEMENT_TOTAL_DEALS,
  MANAGEMENT_PROPERTY_TYPES,
  MANAGEMENT_DEVELOPERS,
  MANAGEMENT_LEAD_SOURCE,
};
