'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function OnboardingPage() {
  const [orgName, setOrgName] = useState('')
  const [orgDescription, setOrgDescription] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [error, setError] = useState('')

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!orgName.trim()) {
      setError('organisation name is required')
      return
    }
    console.log('Creating organisation:', { name: orgName, description: orgDescription })
    // Here you would typically make an API call to create the organisation
  }

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!inviteCode.trim()) {
      setError('Invite code is required')
      return
    }
    console.log('Joining organisation with invite code:', inviteCode)
    // Here you would typically make an API call to join the organisation
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to Our Platform</CardTitle>
          <CardDescription>Let's get you set up with an organisation</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="create">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">Create organisation</TabsTrigger>
              <TabsTrigger value="join">Join organisation</TabsTrigger>
            </TabsList>
            <TabsContent value="create">
              <form onSubmit={handleCreateSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="org-name">organisation Name</Label>
                  <Input
                    id="org-name"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="Enter organisation name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-description">organisation Description</Label>
                  <Textarea
                    id="org-description"
                    value={orgDescription}
                    onChange={(e) => setOrgDescription(e.target.value)}
                    placeholder="Enter organisation description"
                  />
                </div>
                <Button type="submit" className="w-full">Create organisation</Button>
              </form>
            </TabsContent>
            <TabsContent value="join">
              <form onSubmit={handleJoinSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="invite-code">Invite Code</Label>
                  <Input
                    id="invite-code"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="Enter invite code"
                  />
                </div>
                <Button type="submit" className="w-full">Join organisation</Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        {error && (
          <CardFooter>
            <Alert variant="destructive" className="w-full">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}