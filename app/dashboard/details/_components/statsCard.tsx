import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, ShieldCheck, Crown } from "lucide-react";
import { StatsCounter } from "./statsCounter";

interface StatsCardsProps {
  users: number;
  managers: number;
  admins: number;
  totalMembers: number;
}

export function StatsCards({
  users,
  managers,
  admins,
  totalMembers,
}: StatsCardsProps) {
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <StatsCounter value={totalMembers} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <StatsCounter value={users} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Managers</CardTitle>
          <ShieldCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <StatsCounter value={managers} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Admins</CardTitle>
          <Crown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <StatsCounter value={admins} />
        </CardContent>
      </Card>
    </>
  );
}