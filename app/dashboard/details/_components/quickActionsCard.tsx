import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Users, Trash } from "lucide-react";

interface QuickActionsCardProps {
  organizationId: string;
}

export function QuickActionsCard({ organizationId }: QuickActionsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-4">
        <Button>
          <BarChart className="h-4 w-4" />
          View Full Analytics
        </Button>
        <Button variant="outline">
          <Users className="h-4 w-4" />
          Manage Members
        </Button>
        <Button variant="destructive">
          <Trash className="h-4 w-4" />
          Delete Organisation
        </Button>
      </CardContent>
    </Card>
  );
}
