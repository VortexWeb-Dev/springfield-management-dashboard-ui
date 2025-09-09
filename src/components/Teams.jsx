import { Users } from "lucide-react";
import { Card, CardBody, CardHeader, TEAMS, TOKENS } from "./primitives";

function TeamsPage() {
  return (
    <div className="space-y-4">
      {TEAMS.map((team) => (
        <Card key={team.name}>
          <CardHeader
            title={`Team ${team.name}`}
            icon={<Users size={18} style={{ color: TOKENS.primary }} />}
          />
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {team.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-3 rounded-xl border hover:shadow-sm"
                  style={{ borderColor: TOKENS.border }}
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold">{member.name}</div>
                    <div className="text-xs" style={{ color: TOKENS.muted }}>
                      {member.team}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

export default TeamsPage;
