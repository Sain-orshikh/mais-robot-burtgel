'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Separator } from '@/components/ui/separator'

export default function SettingsPage() {
  const { organisation } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

  const [formData, setFormData] = useState({
    type: '',
    typeDetail: '',
    aimag: '',
    phoneNumber: '',
    ner: '',
    ovog: '',
    email: '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    if (organisation) {
      setFormData({
        type: organisation.type || '',
        typeDetail: organisation.typeDetail || '',
        aimag: organisation.aimag || '',
        phoneNumber: organisation.phoneNumber || '',
        ner: organisation.ner || '',
        ovog: organisation.ovog || '',
        email: organisation.email || '',
      })
    }
  }, [organisation])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/organisations/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Update failed')
      }

      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully',
      })

      // Reload the page to refresh organisation data
      window.location.reload()
    } catch (error) {
      toast({
        title: 'Update failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'Password mismatch',
        description: 'New passwords do not match',
        variant: 'destructive',
      })
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/organisations/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Password change failed')
      }

      toast({
        title: 'Password changed',
        description: 'Your password has been changed successfully',
      })

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error) {
      toast({
        title: 'Password change failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!organisation) {
    return null
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Organisation Settings</h1>

      {/* Profile Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your organisation details</CardDescription>
        </CardHeader>
        <form onSubmit={handleUpdateProfile}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Organization Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="company">Company</SelectItem>
                    <SelectItem value="school">School</SelectItem>
                    <SelectItem value="individual">Individual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="typeDetail">Organization Name</Label>
                <Input
                  id="typeDetail"
                  value={formData.typeDetail}
                  onChange={(e) => setFormData({ ...formData, typeDetail: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aimag">Aimag (State)</Label>
                <Input
                  id="aimag"
                  value={formData.aimag}
                  onChange={(e) => setFormData({ ...formData, aimag: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ner">Ner (First Name)</Label>
                <Input
                  id="ner"
                  value={formData.ner}
                  onChange={(e) => setFormData({ ...formData, ner: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ovog">Ovog (Last Name)</Label>
                <Input
                  id="ovog"
                  value={formData.ovog}
                  onChange={(e) => setFormData({ ...formData, ovog: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Profile'}
            </Button>
          </CardContent>
        </form>
      </Card>

      {/* Registration Information (Read-only) */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Registration Information</CardTitle>
          <CardDescription>These details cannot be changed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <Label className="text-gray-600">Registration Number</Label>
              <p className="text-lg font-medium">{organisation.registriinDugaar}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <form onSubmit={handleChangePassword}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
                minLength={6}
              />
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Changing Password...' : 'Change Password'}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}
