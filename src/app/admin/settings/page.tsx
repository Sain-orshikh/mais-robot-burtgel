import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2, Plus, Save, Settings, AlertTriangle } from 'lucide-react'
import { settingsApi, AdminCategory } from '@/lib/api/settings'
import { useToast } from '@/hooks/use-toast'
import { uploadToCloudinary } from '@/lib/cloudinary'

type EditableCategory = AdminCategory & { _tmpId: string }
type AdminOrganisation = {
  _id: string
  organisationId: string
  typeDetail: string
  aimag: string
  email: string
  hasPayments?: boolean
}

const createCategory = (): EditableCategory => ({
  _tmpId: Math.random().toString(36).slice(2),
  categoryCode: '',
  name: '',
  maxTeamsPerOrg: 1,
  minContestantsPerTeam: 1,
  maxContestantsPerTeam: 1,
})

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [orgLoading, setOrgLoading] = useState(false)
  const [logoUploading, setLogoUploading] = useState(false)
  const [bankName, setBankName] = useState('')
  const [bankAccountName, setBankAccountName] = useState('')
  const [bankAccountNumber, setBankAccountNumber] = useState('')
  const [loginLogoUrl, setLoginLogoUrl] = useState('/icons/12.jpg')
  const [categories, setCategories] = useState<EditableCategory[]>([])
  const [organisations, setOrganisations] = useState<AdminOrganisation[]>([])
  const [showAllOrganisations, setShowAllOrganisations] = useState(false)

  useEffect(() => {
    void fetchSettings()
    void fetchOrganisations()
  }, [])

  const isCategoriesValid = useMemo(() => {
    if (categories.length === 0) return true
    return categories.every((cat: EditableCategory) => {
      const hasRequired = cat.categoryCode.trim() && cat.name.trim()
      const hasValidNumbers =
        cat.maxTeamsPerOrg >= 1 &&
        cat.minContestantsPerTeam >= 1 &&
        cat.maxContestantsPerTeam >= cat.minContestantsPerTeam
      return Boolean(hasRequired && hasValidNumbers)
    })
  }, [categories])

  const visibleOrganisations = useMemo(() => {
    if (showAllOrganisations) return organisations
    return organisations.filter((org) => !org.hasPayments)
  }, [organisations, showAllOrganisations])

  const paidOrganisationCount = useMemo(() => organisations.filter((org) => org.hasPayments).length, [organisations])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const data = await settingsApi.getAdmin()
      setBankName(data.bankName || '')
      setBankAccountName(data.bankAccountName || '')
      setBankAccountNumber(data.bankAccountNumber || '')
      setLoginLogoUrl(data.loginLogoUrl || '/icons/12.jpg')
      const normalized = (data.availableCategories || []).map((cat: AdminCategory) => ({
        ...cat,
        _tmpId: `${cat.categoryCode}-${Math.random().toString(36).slice(2)}`,
      }))
      setCategories(normalized)
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load settings',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchOrganisations = async () => {
    try {
      setOrgLoading(true)
      const data = await settingsApi.getOrganisations()
      setOrganisations(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load organisations',
        variant: 'destructive',
      })
    } finally {
      setOrgLoading(false)
    }
  }

  const handleCategoryChange = (id: string, key: keyof AdminCategory, value: string) => {
    setCategories((prev: EditableCategory[]) =>
      prev.map((cat: EditableCategory) => {
        if (cat._tmpId !== id) return cat
        if (key === 'name' || key === 'categoryCode') {
          return { ...cat, [key]: value }
        }
        return { ...cat, [key]: Number(value || 0) }
      })
    )
  }

  const removeCategory = (id: string) => {
    setCategories((prev: EditableCategory[]) => prev.filter((cat: EditableCategory) => cat._tmpId !== id))
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      const payload: any = {
        bankName,
        bankAccountName,
        bankAccountNumber,
        loginLogoUrl,
      }

      if (isCategoriesValid && categories.length > 0) {
        payload.availableCategories = categories.map(({ _tmpId, ...cat }: EditableCategory) => ({
          ...cat,
          categoryCode: cat.categoryCode.toUpperCase().trim(),
          name: cat.name.trim(),
        }))
      }

      await settingsApi.updateAdmin({
        ...payload,
      })

      toast({
        title: 'Saved',
        description: isCategoriesValid
          ? 'Admin settings updated successfully.'
          : 'Logo/bank settings saved. Categories were skipped due to validation issues.',
      })

      await fetchSettings()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save settings',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleLogoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image under 5MB',
        variant: 'destructive',
      })
      return
    }

    setLogoUploading(true)
    try {
      const uploadedUrl = await uploadToCloudinary(file)
      setLoginLogoUrl(uploadedUrl)
      toast({
        title: 'Logo uploaded',
        description: 'Logo uploaded to cloud successfully. Click Save Settings to persist it.',
      })
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload logo',
        variant: 'destructive',
      })
    } finally {
      setLogoUploading(false)
      e.target.value = ''
    }
  }

  const deleteOrganisation = async (org: AdminOrganisation) => {
    if (!confirm(`Delete ${org.typeDetail} (${org.organisationId})? This removes all related contestants, coaches, and teams.`)) {
      return
    }

    try {
      await settingsApi.deleteOrganisation(org._id)
      toast({
        title: 'Deleted',
        description: 'Organisation removed successfully.',
      })
      await fetchOrganisations()
    } catch (error: any) {
      const code = error?.code
      toast({
        title: code === 'HAS_PAYMENTS' ? 'Cannot delete organisation' : 'Delete failed',
        description:
          code === 'HAS_PAYMENTS'
            ? 'This organisation has at least one payment and cannot be removed.'
            : error instanceof Error
              ? error.message
              : 'Failed to delete organisation',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-6 py-8 space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold flex items-center gap-2'>
            <Settings size={22} />
            Admin Settings
          </h1>
          <p className='text-sm text-muted-foreground'>Manage categories, bank account info, login logo, and organisations</p>
        </div>
        <Button onClick={saveSettings} disabled={saving} className='gap-2'>
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bank Account Information</CardTitle>
        </CardHeader>
        <CardContent className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='space-y-2'>
            <Label>Bank Name</Label>
            <Input value={bankName} onChange={(e: ChangeEvent<HTMLInputElement>) => setBankName(e.target.value)} placeholder='Bank Name' />
          </div>
          <div className='space-y-2'>
            <Label>Account Name</Label>
            <Input value={bankAccountName} onChange={(e: ChangeEvent<HTMLInputElement>) => setBankAccountName(e.target.value)} placeholder='Account holder name' />
          </div>
          <div className='space-y-2'>
            <Label>Account Number</Label>
            <Input value={bankAccountNumber} onChange={(e: ChangeEvent<HTMLInputElement>) => setBankAccountNumber(e.target.value)} placeholder='Account/IBAN' />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Login Logo URL</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label>Logo URL</Label>
            <Input value={loginLogoUrl} onChange={(e: ChangeEvent<HTMLInputElement>) => setLoginLogoUrl(e.target.value)} placeholder='https://example.com/logo.png' />
          </div>
          <div className='space-y-2'>
            <Label>Upload Logo Image</Label>
            <Input
              type='file'
              accept='image/*'
              onChange={handleLogoUpload}
              disabled={logoUploading}
            />
            <p className='text-xs text-muted-foreground'>
              {logoUploading ? 'Uploading logo to cloud...' : 'Upload to Cloudinary or keep using direct URL input.'}
            </p>
          </div>
          <div className='w-28 h-28 border rounded-lg overflow-hidden bg-muted'>
            <img src={loginLogoUrl || '/icons/12.jpg'} alt='Logo preview' className='w-full h-full object-contain' />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Competition Categories</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex justify-between'>
            <p className='text-sm text-muted-foreground'>These categories appear when creating/editing events.</p>
            <Button type='button' variant='outline' onClick={() => setCategories((prev: EditableCategory[]) => [...prev, createCategory()])} className='gap-2'>
              <Plus size={16} />
              Add Category
            </Button>
          </div>

          <div className='space-y-3'>
            {categories.map((category: EditableCategory) => (
              <div key={category._tmpId} className='grid grid-cols-1 md:grid-cols-6 gap-2 p-3 border rounded-lg'>
                <Input
                  value={category.categoryCode}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleCategoryChange(category._tmpId, 'categoryCode', e.target.value.toUpperCase())}
                  placeholder='Code'
                />
                <Input
                  value={category.name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleCategoryChange(category._tmpId, 'name', e.target.value)}
                  placeholder='Category name'
                  className='md:col-span-2'
                />
                <Input
                  type='number'
                  min={1}
                  value={category.maxTeamsPerOrg}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleCategoryChange(category._tmpId, 'maxTeamsPerOrg', e.target.value)}
                  placeholder='Max teams'
                />
                <Input
                  type='number'
                  min={1}
                  value={category.minContestantsPerTeam}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleCategoryChange(category._tmpId, 'minContestantsPerTeam', e.target.value)}
                  placeholder='Min contestants'
                />
                <div className='flex gap-2'>
                  <Input
                    type='number'
                    min={1}
                    value={category.maxContestantsPerTeam}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleCategoryChange(category._tmpId, 'maxContestantsPerTeam', e.target.value)}
                    placeholder='Max contestants'
                  />
                  <Button variant='destructive' size='icon' onClick={() => removeCategory(category._tmpId)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className='border-amber-300'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-amber-700'>
            <AlertTriangle size={18} />
            Organisation Cleanup
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          <p className='text-sm text-muted-foreground'>
            You can remove unused organisations. If the organisation has at least one payment, deletion is blocked.
          </p>
          <div className='flex items-center justify-between'>
            <p className='text-xs text-muted-foreground'>
              Hidden paid organisations: {paidOrganisationCount}
            </p>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={() => setShowAllOrganisations((prev) => !prev)}
            >
              {showAllOrganisations ? 'Hide Paid Orgs' : 'Show All Orgs'}
            </Button>
          </div>
          <div className='space-y-2 max-h-96 overflow-y-auto'>
            {orgLoading && <p className='text-sm text-muted-foreground'>Loading organisations...</p>}
            {!orgLoading && visibleOrganisations.length === 0 && <p className='text-sm text-muted-foreground'>No organisations found.</p>}
            {visibleOrganisations.map((org: AdminOrganisation) => (
              <div key={org._id} className='flex items-center justify-between p-3 border rounded-lg'>
                <div>
                  <p className='font-medium'>{org.typeDetail}</p>
                  <p className='text-xs text-muted-foreground'>
                    {org.organisationId} • {org.aimag} • {org.email} {org.hasPayments ? '• Paid' : ''}
                  </p>
                </div>
                <Button variant='destructive' size='sm' onClick={() => deleteOrganisation(org)}>
                  <Trash2 size={14} className='mr-2' />
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
