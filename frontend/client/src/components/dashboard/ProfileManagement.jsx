import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Camera } from "lucide-react"
import { useUser } from "@/hooks/useUser"

const ProfileManagement = () => {
  const { user, isLoading, isError } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (isError || !user) return <div>Failed to load user info.</div>;

  return (
    <Card className="glassmorphism rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-orange-200 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-orange-600" />
          </div>
          <Button variant="outline" className="rounded-xl bg-transparent">
            <Camera className="h-4 w-4 mr-2" />
            Change Photo
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="first-name">First Name</Label>
            <Input id="first-name" defaultValue={user.first_name} className="rounded-xl" />
          </div>
          <div>
            <Label htmlFor="last-name">Last Name</Label>
            <Input id="last-name" defaultValue={user.last_name} className="rounded-xl" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={user.email} className="rounded-xl" />
          </div>
          <div>
            <Label htmlFor="username">Username</Label>
            <Input id="username" defaultValue={user.username} className="rounded-xl" />
          </div>
        </div>

        <div className="flex gap-4">
          <Button className="bg-orange-600 hover:bg-orange-700 rounded-xl">Save Changes</Button>
          <Button variant="outline" className="rounded-xl bg-transparent">
            Change Password
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProfileManagement