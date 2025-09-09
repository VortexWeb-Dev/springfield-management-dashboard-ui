import { Building2 } from "lucide-react";
import { Button, Card, CardBody, CardHeader, TOKENS } from "./primitives";
function Compliance() {
  const items = [
    { label: "RERA/Trakheesi IDs Expiring (30d)", value: 2 },
    { label: "Visa/Contract Renewals (60d)", value: 4 },
    { label: "Listing Docs Missing", value: 7 },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((i) => (
        <Card key={i.label}>
          <CardBody>
            <div className="text-xs" style={{ color: TOKENS.muted }}>
              {i.label}
            </div>
            <div
              className="text-2xl font-semibold"
              style={{ color: TOKENS.text }}
            >
              {i.value}
            </div>
            <Button variant="ghost" className="mt-2">
              View
            </Button>
          </CardBody>
        </Card>
      ))}

      <Card className="md:col-span-3">
        <CardHeader
          title="Landlord SLA Tracker"
          icon={<Building2 size={18} style={{ color: TOKENS.primary }} />}
        />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div
              className="p-3 rounded-xl border"
              style={{ borderColor: TOKENS.border }}
            >
              <div className="text-xs" style={{ color: TOKENS.muted }}>
                Avg time to list
              </div>
              <div className="text-xl font-semibold">18h</div>
            </div>
            <div
              className="p-3 rounded-xl border"
              style={{ borderColor: TOKENS.border }}
            >
              <div className="text-xs" style={{ color: TOKENS.muted }}>
                Listing Quality ≥ 90
              </div>
              <div className="text-xl font-semibold">78%</div>
            </div>
            <div
              className="p-3 rounded-xl border"
              style={{ borderColor: TOKENS.border }}
            >
              <div className="text-xs" style={{ color: TOKENS.muted }}>
                Renewal reminders sent
              </div>
              <div className="text-xl font-semibold">42</div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default Compliance;
