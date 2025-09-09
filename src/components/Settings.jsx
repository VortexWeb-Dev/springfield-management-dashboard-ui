import { Settings } from "lucide-react";
import { Card, CardBody, CardHeader, TOKENS } from "./primitives";
function SettingsPage() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader
          title="Branding & Theme"
          icon={<Settings size={18} style={{ color: TOKENS.primary }} />}
        />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-xs" style={{ color: TOKENS.muted }}>
                Primary Color
              </div>
              <div
                className="h-10 rounded-xl border"
                style={{
                  backgroundColor: TOKENS.primary,
                  borderColor: TOKENS.border,
                }}
              />
            </div>
            <div>
              <div className="text-xs" style={{ color: TOKENS.muted }}>
                Typography
              </div>
              <div
                className="p-3 rounded-xl border"
                style={{ borderColor: TOKENS.border }}
              >
                <div className="text-lg font-semibold">Inter / System Sans</div>
                <div className="text-xs" style={{ color: TOKENS.muted }}>
                  Clean, legible for dashboards
                </div>
              </div>
            </div>
            <div>
              <div className="text-xs" style={{ color: TOKENS.muted }}>
                Accessibility
              </div>
              <ul className="list-disc pl-5 text-sm mt-2">
                <li>High contrast color palette</li>
                <li>Icon + text cues</li>
                <li>44px touch targets</li>
              </ul>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default SettingsPage;
