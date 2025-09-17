import { useState } from "react";
import { FileBarChart, Download } from "lucide-react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Select,
  TOKENS,
} from "./primitives";
import { useReportsData } from "../hooks/useReportsData";
import { Toaster } from "react-hot-toast";

function Reports() {
  const { departments, isLoadingDepartments, generateReport, isGenerating } =
    useReportsData();

  const [period, setPeriod] = useState("7d");
  const [teamId, setTeamId] = useState("All");
  const [metric, setMetric] = useState("Deals");

  const handleExport = () => {
    generateReport({ period, teamId, metric });
  };

  return (
    <>
      <Toaster position="bottom-right" />
      <div className="space-y-4">
        <Card>
          <CardHeader
            title="Custom Report Builder"
            icon={<FileBarChart size={18} style={{ color: TOKENS.primary }} />}
          />
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-xs" style={{ color: TOKENS.muted }}>
                  Period
                </div>
                <Select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days (Quarter)</option>
                </Select>
              </div>
              <div>
                <div className="text-xs" style={{ color: TOKENS.muted }}>
                  Team
                </div>
                <Select
                  value={teamId}
                  onChange={(e) => setTeamId(e.target.value)}
                  disabled={isLoadingDepartments}
                >
                  <option value="All">All Teams</option>
                  {departments.map((dep) => (
                    <option key={dep.ID} value={dep.ID}>
                      {dep.NAME}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <div className="text-xs" style={{ color: TOKENS.muted }}>
                  Metric
                </div>
                <Select
                  value={metric}
                  onChange={(e) => setMetric(e.target.value)}
                >
                  <option>Deals</option>
                  <option>Leads</option>
                  <option>Revenue</option>
                  <option>Commission</option>
                  <option>Calls</option>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleExport} disabled={isGenerating}>
                  <Download size={16} className="inline mr-1" />
                  {isGenerating ? "Generating..." : "Export CSV"}
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}

export default Reports;
