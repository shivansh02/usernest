import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

interface OrgDetailsCardProps {
  organization: {
    createdAt: string;
    updatedAt: string;
    creator: {
      name: string;
    };
  };
  stats: {
    users: number;
    managers: number;
    admins: number;
    totalMembers: number;
  };
}

export function OrgDetailsCard({ organization, stats }: OrgDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Founded on {new Date(organization.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Last updated on{" "}
            {new Date(organization.updatedAt).toLocaleDateString()}
          </span>
        </div>
        <div className="text-sm font-semibold mb-2">
          Created by: {organization.creator.name}
        </div>

        <div className="space-y-4">
          <div>
            <div className="mb-2 text-sm font-medium">Member Composition</div>
            <div className="flex gap-2">
              <Badge variant="secondary">
                Users:{" "}
                {stats.totalMembers
                  ? ((stats.users / stats.totalMembers) * 100).toFixed(1)
                  : 0}
                %
              </Badge>
              <Badge variant="secondary">
                Managers:{" "}
                {stats.totalMembers
                  ? ((stats.managers / stats.totalMembers) * 100).toFixed(1)
                  : 0}
                %
              </Badge>
              <Badge variant="secondary">
                Admins:{" "}
                {stats.totalMembers
                  ? ((stats.admins / stats.totalMembers) * 100).toFixed(1)
                  : 0}
                %
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
