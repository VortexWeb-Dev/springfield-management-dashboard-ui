import { FileBarChart, Download } from "lucide-react";
import { Button, Card, CardBody, CardHeader, Select, TOKENS } from "./primitives";
function Reports() {
  return (
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
              <Select>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>This Quarter</option>
                <option>Custom</option>
              </Select>
            </div>
            <div>
              <div className="text-xs" style={{ color: TOKENS.muted }}>
                Team
              </div>
              <Select>
                <option>All</option>
                <option>Dubai Marina</option>
                <option>Business Bay</option>
                <option>JVC</option>
              </Select>
            </div>
            <div>
              <div className="text-xs" style={{ color: TOKENS.muted }}>
                Metric
              </div>
              <Select>
                <option>Revenue</option>
                <option>Deals</option>
                <option>Leads</option>
                <option>Calls</option>
                <option>Commission</option>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="ghost">
                <Download size={16} className="inline mr-1" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default Reports;
