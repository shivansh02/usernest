"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { Pencil } from "lucide-react";
import { EditOrgDetails } from "@/server/actions/orgs/editOrgDetails";

interface OrgHeaderProps {
  organization: {
    id: string;
    name: string;
    desc: string;
  };
}

export function OrgHeader({ organization }: OrgHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(organization.name);
  const [editedDescription, setEditedDescription] = useState(organization.desc);
  const { toast } = useToast();

  const handleSave = async () => {
    const success = await EditOrgDetails(
      organization.id,
      editedName,
      editedDescription,
    );
    if (success) {
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
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarFallback>{organization.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <CardTitle className="text-2xl">{organization.name}</CardTitle>
          <CardDescription className="mt-2 max-w-2xl">
            {organization.desc}
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
  );
}
