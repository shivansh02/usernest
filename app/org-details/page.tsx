"use client";

import { useState, useCallback, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import CountUp from "react-countup";
import { RegenerateInvite } from "@/server/actions/regenerateInvite";
import { EditOrgDetails } from "@/server/actions/editOrgDetails";
import { GetOrgDetails } from "@/server/actions/getOrgDetails";

import {
  BarChart,
  Users,
  ShieldCheck,
  Crown,
  Calendar,
  Pencil,
  Copy,
  RefreshCw,
  CalendarCheck2,
} from "lucide-react";

export default function OrganizationDashboard() {
  interface OrgDetails {
    orgDetails: {
      id: string;
      name: string;
      desc: string;
      inviteCode: string;
      createdAt: string;
      updatedAt: string;
      creator: {
        name: string;
      };
    };
    users: number;
    managers: number;
    admins: number;
  }

  const [orgData, setOrgData] = useState<OrgDetails | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrgDetails = async () => {
      const res = await GetOrgDetails("cm3ionqef0001iddgkvufvs4r");
      setOrgData(res);
      setEditedName(res.orgDetails.name);
      setEditedDescription(res.orgDetails.desc);
    };
    fetchOrgDetails();
  }, []);

  if (!orgData) {
    return <div>Loading...</div>;
  }

  const totalMembers = orgData.users + orgData.managers + orgData.admins;

  function copyInviteCode() {
    if (orgData?.orgDetails.inviteCode) {
      navigator.clipboard.writeText(orgData.orgDetails.inviteCode);
      toast({
        title: "Invite Code Copied",
        description:
          "Share this invite code with others to join your organization.",
      });
    }
  }

  async function regenerateInviteCode(organisationId: string) {
    const newInvite = Math.floor(100000 + Math.random() * 900000).toString();
    const success = await RegenerateInvite(organisationId, newInvite);
    if (success) {
      setOrgData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          orgDetails: {
            ...prev.orgDetails,
            inviteCode: newInvite,
          },
        };
      });
      toast({
        title: "Invite Code Regenerated",
        description: "A new invite code has been generated.",
      });
    }
  }

  const handleSave = async (organisationId: string) => {
    const success = await EditOrgDetails(
      organisationId,
      editedName,
      editedDescription
    );
    if (success) {
      setOrgData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          orgDetails: {
            ...prev.orgDetails,
            name: editedName,
            desc: editedDescription,
          },
          users: prev.users,
          managers: prev.managers,
          admins: prev.admins,
        };
      });
      setIsEditing(false);
      toast({
        title: "Organization Updated",
        description: "Organization details have been successfully updated.",
      });
    } else {
      toast({
        title: "Update Failed",
        description: "Failed to update organization details.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarFallback>
              {orgData.orgDetails.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <CardTitle className="text-2xl">
              {orgData.orgDetails.name}
            </CardTitle>
            <CardDescription className="mt-2 max-w-2xl">
              {orgData.orgDetails.desc}
            </CardDescription>
          </div>
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit organization details</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Organization Details</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => handleSave(orgData.orgDetails.id)}>
                  Save changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CountUp
              className="text-2xl font-bold"
              end={totalMembers}
              decimals={0}
              duration={2}
              separator=","
              start={0}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CountUp
              className="text-2xl font-bold"
              end={orgData.users}
              decimals={0}
              duration={2}
              separator=","
              start={0}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Managers</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CountUp
              className="text-2xl font-bold"
              end={orgData.managers}
              decimals={0}
              duration={2}
              separator=","
              start={0}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CountUp
              className="text-2xl font-bold"
              end={orgData.admins}
              decimals={0}
              duration={2}
              separator=","
              start={0}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 mt-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Organization Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Founded on{" "}
                {new Date(orgData.orgDetails.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Last updated on{" "}
                {new Date(orgData.orgDetails.updatedAt).toLocaleDateString()}
              </span>
            </div>
            <div className="text-sm font-semibold mb-2">
              Created by: {orgData.orgDetails.creator.name}
            </div>

            <div className="space-y-4">
              <div>
                <div className="mb-2 text-sm font-medium">
                  Member Composition
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">
                    Users:{" "}
                    {totalMembers
                      ? ((orgData.users / totalMembers) * 100).toFixed(1)
                      : 0}
                    %
                  </Badge>
                  <Badge variant="secondary">
                    Managers:{" "}
                    {totalMembers
                      ? ((orgData.managers / totalMembers) * 100).toFixed(1)
                      : 0}
                    %
                  </Badge>
                  <Badge variant="secondary">
                    Admins:{" "}
                    {totalMembers
                      ? ((orgData.admins / totalMembers) * 100).toFixed(1)
                      : 0}
                    %
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>RBAC Policies</CardTitle>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      </div>

      <div className="grid gap-6 mt-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Invite Code</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-mono tracking-wider">
                {orgData.orgDetails.inviteCode}
              </div>
              <div className="space-x-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => regenerateInviteCode(orgData.orgDetails.id)}
                >
                  <RefreshCw className="h-4 w-4" />
                  <span className="sr-only">Regenerate invite code</span>
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    copyInviteCode();
                  }}
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy invite code</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button>
              <BarChart className="mr-2 h-4 w-4" />
              View Full Analytics
            </Button>
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Manage Members
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
