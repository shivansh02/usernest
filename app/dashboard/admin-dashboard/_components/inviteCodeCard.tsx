"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Copy } from "lucide-react";
import { RegenerateInvite } from "@/server/actions/orgs/regenerateInvite";

interface InviteCodeCardProps {
  organizationId: string;
  inviteCode: string;
}

export function InviteCodeCard({
  organizationId,
  inviteCode,
}: InviteCodeCardProps) {
  const [currentInviteCode, setCurrentInviteCode] = useState(inviteCode);
  const { toast } = useToast();

  function copyInviteCode() {
    navigator.clipboard.writeText(currentInviteCode);
    toast({
      title: "Invite Code Copied",
      description:
        "Share this invite code with others to join your organization.",
    });
  }

  async function regenerateInviteCode() {
    const newInvite = Math.floor(100000 + Math.random() * 900000).toString();
    const success = await RegenerateInvite(organizationId, newInvite);
    if (success) {
      setCurrentInviteCode(newInvite);
      toast({
        title: "Invite Code Regenerated",
        description: "A new invite code has been generated.",
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite Code</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-3xl font-mono tracking-wider">
            {currentInviteCode}
          </div>
          <div className="space-x-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => regenerateInviteCode()}
            >
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only">Regenerate invite code</span>
            </Button>
            <Button size="icon" variant="outline" onClick={copyInviteCode}>
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy invite code</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
