import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { organisation } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

  const [formData, setFormData] = useState({
    typeDetail: '',
    aimag: '',
    phoneNumber: '',
    ner: '',
    ovog: '',
    registriinDugaar: '',
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
        typeDetail: organisation.typeDetail || '',
        aimag: organisation.aimag || '',
        phoneNumber: organisation.phoneNumber || '',
        ner: organisation.ner || '',
        ovog: organisation.ovog || '',
        registriinDugaar: organisation.registriinDugaar || '',
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

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all password fields',
        variant: 'destructive',
      })
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: 'Validation Error',
        description: 'Password must be at least 6 characters',
        variant: 'destructive',
      })
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'Validation Error',
        description: 'Passwords do not match',
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
        throw new Error(error.error || 'Password update failed')
      }

      toast({
        title: 'Password updated',
        description: 'Your password has been updated successfully',
      })

      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
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

  if (!organisation) {
    return null
  }

  const formatRegisteredAt = (value?: string) => {
    if (!value) return 'N/A'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Ulaanbaatar',
      timeZoneName: 'short',
    }).format(date)
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
        <p className="text-gray-600 mt-1">View and manage your organisation information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-start">
        {/* Left Column - Read-only Info */}
        <div className="space-y-4 lg:h-full flex flex-col">
          {/* Organisation ID Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Organisation ID</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-3">
                <div className="text-3xl font-bold text-blue-600">{organisation.organisationId}</div>
                <Badge className="mt-2" variant="secondary">Read Only</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Type Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Organisation Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-3">
                <Badge className="text-lg px-4 py-2 capitalize" variant="outline">
                  {organisation.type}
                </Badge>
                <p className="text-sm text-gray-500 mt-2">Cannot be changed</p>
              </div>
            </CardContent>
          </Card>

          {/* Registration Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Registration Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-gray-600 text-xs">Registered At</Label>
                <p className="font-medium">
                  {formatRegisteredAt(organisation.createdAt)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Editable Form */}
        <div className="lg:col-span-2 lg:h-full flex flex-col space-y-6">
          <Card className="lg:flex-1 flex flex-col">
            <CardHeader>
              <CardTitle>Edit Profile Information</CardTitle>
              <CardDescription>Update your organisation details below</CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdateProfile}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="typeDetail">
                      Organization Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="typeDetail"
                      value={formData.typeDetail}
                      onChange={(e) => setFormData({ ...formData, typeDetail: e.target.value })}
                      required
                      placeholder="Your organization name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aimag">
                      Aimag (State) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="aimag"
                      value={formData.aimag}
                      onChange={(e) => setFormData({ ...formData, aimag: e.target.value })}
                      required
                      placeholder="e.g., Tuv, Uvs"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      required
                      placeholder="Contact phone number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ner">
                      Ner (First Name) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="ner"
                      value={formData.ner}
                      onChange={(e) => setFormData({ ...formData, ner: e.target.value })}
                      required
                      placeholder="First name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ovog">
                      Ovog (Last Name) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="ovog"
                      value={formData.ovog}
                      onChange={(e) => setFormData({ ...formData, ovog: e.target.value })}
                      required
                      placeholder="Last name"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="registriinDugaar">
                      Registriin Dugaar (National ID) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="registriinDugaar"
                      value={formData.registriinDugaar}
                      onChange={(e) => setFormData({ ...formData, registriinDugaar: e.target.value })}
                      required
                      placeholder="National identification number"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading ? 'Saving Changes...' : 'Save Changes'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>

          <Card id="password">
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
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
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
                  />
                </div>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update Password'}
                </Button>
              </CardContent>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
