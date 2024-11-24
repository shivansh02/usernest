'use client'

import { useState, useTransition } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Users, Trash } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { deleteOrganization } from "@/server/actions/deleteOrg"
import { useSession } from "next-auth/react"
import { getPermsById } from "@/server/actions/getPermsInOrg"

interface QuickActionsCardProps {
  organizationId: string
}

export function QuickActionsCard({ organizationId }: QuickActionsCardProps) {
  const {data: session, update} =  useSession();

  const user = session?.user;
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      
      const result = await deleteOrganization(organizationId)
      if (result.success) {
        await update({
          user: {
            ...session!.user,
            orgId: result.newOrgId,
            perms: await getPermsById(result.newOrgId, user!.id),
          },
        });
        setIsOpen(false)

    }})
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Button asChild>
          <Link href={`/dashboard/analytics`} className="flex gap-4">
            <BarChart className="h-4 w-4" />
            View Full Analytics
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={`/dashboard/user-action`} className="flex gap-4">
            <Users className="h-4 w-4" />
            Manage Members
          </Link>
        </Button>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive">
              <Trash className="h-4 w-4 mr-2" />
              Delete Organisation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure you want to delete this organization?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                organization and remove all associated users.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
                {isPending ? "Deleting..." : "Delete Organization"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

