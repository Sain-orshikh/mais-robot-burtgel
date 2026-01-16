'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

export default function HomePage() {
  const { login, register } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  })

  // Register form state
  const [registerData, setRegisterData] = useState({
    type: '',
    typeDetail: '',
    aimag: '',
    phoneNumber: '',
    ner: '',
    ovog: '',
    registriinDugaar: '',
    email: '',
    password: '',
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(loginData.email, loginData.password)
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
      })
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'Please check your credentials',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await register(registerData)
      toast({
        title: 'Registration successful',
        description: 'Your account has been created!',
      })
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: error instanceof Error ? error.message : 'Please check your information',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">MAIS Robot Challenge</h1>
          <p className="text-gray-600">Welcome to the Mongolian Aspiration Robot Challenge</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login to Your Account</CardTitle>
                <CardDescription>Enter your email and password to access your dashboard</CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                  </Button>
                  <Button type="button" variant="link" className="text-sm text-gray-500">
                    Forgot Password? (Coming Soon)
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create an Account</CardTitle>
                <CardDescription>Register your organization for the robot challenge</CardDescription>
              </CardHeader>
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Organization Type *</Label>
                      <Select
                        value={registerData.type}
                        onValueChange={(value) => setRegisterData({ ...registerData, type: value })}
                        required
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
                      <Label htmlFor="typeDetail">Organization Name *</Label>
                      <Input
                        id="typeDetail"
                        placeholder="Name of your organization"
                        value={registerData.typeDetail}
                        onChange={(e) => setRegisterData({ ...registerData, typeDetail: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="aimag">Aimag (State) *</Label>
                      <Input
                        id="aimag"
                        placeholder="e.g., Tuv, Uvs"
                        value={registerData.aimag}
                        onChange={(e) => setRegisterData({ ...registerData, aimag: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number *</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        placeholder="Contact phone number"
                        value={registerData.phoneNumber}
                        onChange={(e) => setRegisterData({ ...registerData, phoneNumber: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ner">Ner (First Name) *</Label>
                      <Input
                        id="ner"
                        placeholder="First name"
                        value={registerData.ner}
                        onChange={(e) => setRegisterData({ ...registerData, ner: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ovog">Ovog (Last Name) *</Label>
                      <Input
                        id="ovog"
                        placeholder="Last name"
                        value={registerData.ovog}
                        onChange={(e) => setRegisterData({ ...registerData, ovog: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="registriinDugaar">Registriin Dugaar (Registration Number) *</Label>
                      <Input
                        id="registriinDugaar"
                        placeholder="Registration/ID number"
                        value={registerData.registriinDugaar}
                        onChange={(e) => setRegisterData({ ...registerData, registriinDugaar: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email *</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="register-password">Password *</Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Create a password (min 6 characters)"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
