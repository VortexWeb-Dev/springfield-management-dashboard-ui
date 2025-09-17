import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getDepartments,
  getAllUsers,
  getAllWonDealsForDateRange,
  getLeadsForDateRange,
} from "../api/bitrix";
import { downloadCSV } from "../utils";
import { toast } from "react-hot-toast";

const getDateRange = (period) => {
  const endDate = new Date();
  let startDate = new Date();

  switch (period) {
    case "7d":
      startDate.setDate(endDate.getDate() - 7);
      break;
    case "30d":
      startDate.setDate(endDate.getDate() - 30);
      break;
    case "90d": // This Quarter
      startDate.setMonth(endDate.getMonth() - 3);
      break;
    default:
      startDate.setDate(endDate.getDate() - 7);
  }
  const formatDate = (date) => date.toISOString().split("T")[0];
  return { startDate: formatDate(startDate), endDate: formatDate(endDate) };
};

export const useReportsData = () => {
  // Fetch departments for the dropdown
  const { data: departments, isLoading: isLoadingDepartments } = useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
    staleTime: Infinity, // This data rarely changes
  });

  // Mutation to handle the report generation and download
  const generateReport = useMutation({
    mutationFn: async ({ period, teamId, metric }) => {
      const { startDate, endDate } = getDateRange(period);

      let users = [];
      let userMap = new Map();

      // Fetch users only if we need to filter by team
      if (teamId !== "All") {
        users = await getAllUsers();
        userMap = new Map(users.map((u) => [u.ID, u]));
      }

      let dataToProcess = [];
      let headers = [];
      let fileName = `${metric}_report_${startDate}_to_${endDate}.csv`;

      switch (metric) {
        case "Revenue":
        case "Deals":
        case "Commission":
          const deals = await getAllWonDealsForDateRange(startDate, endDate);
          dataToProcess = deals;
          headers = ["DEAL_ID", "ASSIGNED_BY", "CLOSE_DATE", "NET_COMMISSION"];
          break;
        case "Leads":
          const leads = await getLeadsForDateRange(startDate, endDate);
          dataToProcess = leads;
          headers = [
            "LEAD_ID",
            "TITLE",
            "ASSIGNED_BY",
            "DATE_CREATE",
            "STATUS",
            "SOURCE",
          ];
          break;
        // 'Calls' metric would require a different API endpoint (e.g., crm.activity.list)
        // For now, we'll show a message.
        case "Calls":
          throw new Error("Calls metric is not yet supported.");
        default:
          throw new Error("Invalid metric selected.");
      }

      // Filter by team if a specific team is selected
      if (teamId !== "All") {
        const teamUserIds = users
          .filter(
            (u) =>
              u.UF_DEPARTMENT && u.UF_DEPARTMENT.includes(parseInt(teamId, 10))
          )
          .map((u) => u.ID);

        dataToProcess = dataToProcess.filter((item) =>
          teamUserIds.includes(item.ASSIGNED_BY_ID)
        );
      }

      if (dataToProcess.length === 0) {
        throw new Error("No data found for the selected criteria.");
      }

      downloadCSV(dataToProcess, headers, fileName);
      return { fileName };
    },
    onSuccess: (data) => {
      toast.success(`Successfully generated and downloaded ${data.fileName}`);
    },
    onError: (error) => {
      toast.error(`Failed to generate report: ${error.message}`);
    },
  });

  return {
    departments: departments || [],
    isLoadingDepartments,
    generateReport: generateReport.mutate,
    isGenerating: generateReport.isLoading,
  };
};
