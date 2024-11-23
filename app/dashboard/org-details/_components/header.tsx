import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Label } from "@/components/ui/label";


const header = () => {
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarFallback>{orgData.orgDetails.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <CardTitle className="text-2xl">{orgData.orgDetails.name}</CardTitle>
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
  );
};

export default header;
