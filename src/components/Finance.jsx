import { Banknote, Settings, CalendarClock } from "lucide-react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  LoadingSpinner,
  TOKENS,
} from "./primitives";
import { useFinanceData } from "../hooks/useFinanceData";

const formatCurrency = (value) =>
  `AED ${new Intl.NumberFormat("en-AE").format(value || 0)}`;

function Finance() {
  const { data, isLoading, isError, error } = useFinanceData();

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  if (isError)
    return (
      <div className="text-center p-8 text-red-500">Error: {error.message}</div>
    );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <Card className="xl:col-span-2">
        <CardHeader
          title="Commission Payout Trend (Last 6 Months)"
          icon={<Banknote size={18} style={{ color: TOKENS.primary }} />}
        />
        <CardBody>
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <LineChart data={data?.commissionSpendData}>
                <CartesianGrid strokeDasharray="3 3" stroke={TOKENS.border} />
                <XAxis dataKey="month" stroke={TOKENS.muted} />
                <YAxis
                  stroke={TOKENS.muted}
                  tickFormatter={(value) =>
                    new Intl.NumberFormat("en-US", {
                      notation: "compact",
                      compactDisplay: "short",
                    }).format(value)
                  }
                />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="payout"
                  name="Gross Commission"
                  stroke={TOKENS.primary}
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Commission Rules"
          icon={<Settings size={18} style={{ color: TOKENS.primary }} />}
        />
        <CardBody>
          <div className="text-sm" style={{ color: TOKENS.muted }}>
            Example slab (editable in production):
          </div>
          <ul className="list-disc pl-5 text-sm mt-2">
            <li>&lt; AED 200k → 1.0%</li>
            <li>AED 200k–500k → 1.5%</li>
            <li>&gt; AED 500k → 2.0%</li>
          </ul>
          <Button variant="ghost" className="mt-3">
            Edit Slabs
          </Button>
        </CardBody>
      </Card>

      <Card className="xl:col-span-3">
        <CardHeader
          title="Upcoming Payouts (Current Month)"
          icon={<CalendarClock size={18} style={{ color: TOKENS.primary }} />}
        />
        <CardBody>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left" style={{ color: TOKENS.muted }}>
                  <th className="py-2 pr-4">Agent</th>
                  <th className="py-2 pr-4">Team</th>
                  <th className="py-2 pr-4">Commission (AED)</th>
                  <th className="py-2 pr-4">%</th>
                  <th className="py-2 pr-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {data?.upcomingPayoutsData.map((a) => (
                  <tr
                    key={a.id}
                    className="border-t"
                    style={{ borderColor: TOKENS.border }}
                  >
                    <td className="py-2 pr-4 font-medium">{a.name}</td>
                    <td className="py-2 pr-4">{a.team}</td>
                    <td className="py-2 pr-4">
                      {formatCurrency(a.commissionAED)}
                    </td>
                    <td className="py-2 pr-4">{a.commissionPct}%</td>
                    <td className="py-2 pr-4">
                      <Button variant="ghost">Mark Paid</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default Finance;
