"use client";

import { useState } from "react";
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
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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
import {
  BarChart,
  Users,
  ShieldCheck,
  Crown,
  Calendar,
  Pencil,
} from "lucide-react";
import CountUp from "react-countup";

export default function OrganizationDashboard() {
  const [orgData, setOrgData] = useState({
    name: "TechInnovators Inc.",
    description:
      "Pioneering the future of technology with innovative solutions and cutting-edge research.",
    imageUrl:
      "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=300&dpr=2&q=80",
    totalMembers: 50,
    users: 40,
    managers: 8,
    admins: 2,
    foundingDate: "2015-03-15",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(orgData.name);
  const [editedDescription, setEditedDescription] = useState(
    orgData.description
  );

  const handleSave = () => {
    setOrgData((prev) => ({
      ...prev,
      name: editedName,
      description: editedDescription,
    }));
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={orgData.imageUrl} alt={orgData.name} />
            <AvatarFallback>{orgData.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <CardTitle className="text-2xl">{orgData.name}</CardTitle>
            <CardDescription className="mt-2 max-w-2xl">
              {orgData.description}
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
                <Button onClick={handleSave}>Save changes</Button>
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
              end={orgData.totalMembers}
              decimals={0}
              duration={2}
              separator=","
              start={0}
            />
            {/* <div className="text-2xl font-bold">{orgData.totalMembers}</div> */}
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
            />{" "}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 mt-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Organization Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Founded on {orgData.foundingDate}
              </span>
            </div>
            <div className="space-y-4">
              {/* <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    Project Completion
                  </span>
                  <span className="text-sm font-medium">{orgData.projectCompletion}%</span>
                </div>
                <Progress value={orgData.projectCompletion} className="h-2" />
              </div> */}
              <div>
                <div className="mb-2 text-sm font-medium">
                  Member Composition
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">
                    Users:{" "}
                    {((orgData.users / orgData.totalMembers) * 100).toFixed(1)}%
                  </Badge>
                  <Badge variant="secondary">
                    Mods:{" "}
                    {((orgData.managers / orgData.totalMembers) * 100).toFixed(
                      1
                    )}
                    %
                  </Badge>
                  <Badge variant="secondary">
                    Admins:{" "}
                    {((orgData.admins / orgData.totalMembers) * 100).toFixed(1)}
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

      <Card className="mt-6">
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
  );
}
