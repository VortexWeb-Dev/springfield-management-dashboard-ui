import { useState, useMemo } from "react";
import { Users } from "lucide-react";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  LoadingSpinner,
  TOKENS,
} from "./primitives";
import { useTeamsData } from "../hooks/useTeamsData";

function TeamsPage() {
  const { data: teams, isLoading, isError, error } = useTeamsData();
  const [searchQuery, setSearchQuery] = useState("");

  // Memoize the filtering logic to avoid re-calculating on every render
  const filteredTeams = useMemo(() => {
    if (!teams) return [];

    // If there's no search query, return all teams
    if (!searchQuery.trim()) {
      return teams;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();

    // 1. Filter members within each team
    // 2. Filter out teams that have no matching members left
    return teams
      .map((team) => {
        const filteredMembers = team.members.filter(
          (member) =>
            member.name.toLowerCase().includes(lowerCaseQuery) ||
            member.role.toLowerCase().includes(lowerCaseQuery)
        );
        return { ...team, members: filteredMembers };
      })
      .filter((team) => team.members.length > 0);
  }, [teams, searchQuery]);

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
    <div className="space-y-4">
      {/* Search Bar */}
      <Card>
        <CardBody>
          <div className="relative">
            <Input
              className="pl-10 w-full"
              placeholder="Search by name or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardBody>
      </Card>

      {/* Display Filtered Teams */}
      {filteredTeams && filteredTeams.length > 0 ? (
        filteredTeams.map((team) => (
          <Card key={team.name}>
            <CardHeader
              title={`${team.name} (${team.members.length})`}
              icon={<Users size={18} style={{ color: TOKENS.primary }} />}
            />
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {team.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-3 rounded-xl border transition-shadow duration-200 hover:shadow-md"
                    style={{ borderColor: TOKENS.border }}
                  >
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover bg-gray-200"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://placehold.co/100x100/E2E8F0/4A5568?text=${member.name.charAt(
                          0
                        )}`;
                      }}
                    />
                    <div>
                      <div className="font-semibold text-gray-800">
                        {member.name}
                      </div>
                      <div className="text-sm" style={{ color: TOKENS.muted }}>
                        {member.role}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        ))
      ) : (
        <Card>
          <CardBody>
            <p className="text-center text-gray-500">
              No members found matching your search.
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

export default TeamsPage;
