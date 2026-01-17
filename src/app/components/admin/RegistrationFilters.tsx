'use client'

import { useState, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Filter, X } from 'lucide-react'
import CardBox from '../shared/CardBox'
import { Badge } from '@/components/ui/badge'

interface RegistrationFiltersProps {
  registrations: any[]
  categories: string[]
  onFilteredResults: (filtered: any[]) => void
}

export const RegistrationFilters = ({ 
  registrations, 
  categories,
  onFilteredResults 
}: RegistrationFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedOrgType, setSelectedOrgType] = useState<string>('all')
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>('all')
  const [selectedAimag, setSelectedAimag] = useState<string>('all')

  // Extract unique organisation names
  const organisations = useMemo(() => {
    const uniqueOrgs = Array.from(
      new Set(
        registrations
          .map((r: any) => {
            if (r.organisationId && typeof r.organisationId === 'object') {
              return r.organisationId.typeDetail
            }
            return null
          })
          .filter(Boolean)
      )
    )
    return uniqueOrgs.sort()
  }, [registrations])

  // Extract unique aimags (provinces)
  const aimags = useMemo(() => {
    const uniqueAimags = Array.from(
      new Set(
        registrations
          .map((r: any) => {
            if (r.organisationId && typeof r.organisationId === 'object') {
              return r.organisationId.aimag
            }
            return null
          })
          .filter(Boolean)
      )
    )
    return uniqueAimags.sort()
  }, [registrations])

  // Filter registrations
  const filteredRegistrations = useMemo(() => {
    let filtered = [...registrations]

    // Search filter (search in org name, org ID, category)
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((reg: any) => {
        const orgId = reg.organisationId 
          ? (typeof reg.organisationId === 'string' 
              ? reg.organisationId 
              : reg.organisationId._id || reg.organisationId.organisationId || String(reg.organisationId))
          : ''
        const orgName = reg.organisationId && typeof reg.organisationId === 'object'
          ? reg.organisationId.typeDetail || ''
          : ''
        const category = Array.isArray(reg.categories) && reg.categories.length > 0
          ? reg.categories.join(' ')
          : (reg.category || '')
        
        return (
          orgId.toLowerCase().includes(query) ||
          orgName.toLowerCase().includes(query) ||
          category.toLowerCase().includes(query)
        )
      })
    }

    // Registration status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((reg: any) => reg.status === selectedStatus)
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((reg: any) => {
        if (Array.isArray(reg.categories)) {
          return reg.categories.includes(selectedCategory)
        }
        return reg.category === selectedCategory
      })
    }

    // Organisation type filter
    if (selectedOrgType !== 'all') {
      filtered = filtered.filter((reg: any) => {
        if (reg.organisationId && typeof reg.organisationId === 'object') {
          return reg.organisationId.type === selectedOrgType
        }
        return false
      })
    }

    // Payment status filter
    if (selectedPaymentStatus !== 'all') {
      filtered = filtered.filter((reg: any) => {
        const paymentStatus = reg.paymentStatus || 'not_uploaded'
        return paymentStatus === selectedPaymentStatus
      })
    }

    // Aimag filter
    if (selectedAimag !== 'all') {
      filtered = filtered.filter((reg: any) => {
        if (reg.organisationId && typeof reg.organisationId === 'object') {
          return reg.organisationId.aimag === selectedAimag
        }
        return false
      })
    }

    return filtered
  }, [
    registrations,
    searchQuery,
    selectedStatus,
    selectedCategory,
    selectedOrgType,
    selectedPaymentStatus,
    selectedAimag,
  ])

  // Update parent whenever filters change
  useEffect(() => {
    onFilteredResults(filteredRegistrations)
  }, [filteredRegistrations, onFilteredResults])

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('')
    setSelectedStatus('all')
    setSelectedCategory('all')
    setSelectedOrgType('all')
    setSelectedPaymentStatus('all')
  }

  // Count active filters
  const activeFiltersCount =
    (searchQuery ? 1 : 0) +
    (selectedStatus !== 'all' ? 1 : 0) +
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedOrgType !== 'all' ? 1 : 0) +
    (selectedPaymentStatus !== 'all' ? 1 : 0)

  return (
    <CardBox className='mb-6'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-2'>
          <Filter size={20} />
          <h3 className='font-semibold'>Шүүлтүүр</h3>
          {activeFiltersCount > 0 && (
            <Badge variant='secondary' className='ml-2'>
              {activeFiltersCount} идэвхтэй
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button variant='ghost' size='sm' onClick={handleClearFilters}>
            <X size={16} className='mr-1' />
            Цэвэрлэх
          </Button>
        )}
      </div>

      {/* Search Bar */}
      <div className='mb-4'>
        <Label htmlFor='search' className='text-xs mb-1'>Хайлт</Label>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground' size={18} />
          <Input
            id='search'
            placeholder='Байгууллага, ID эсвэл категори...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10'
          />
        </div>
      </div>

      {/* Filter Dropdowns */}
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3'>
        {/* Registration Status */}
        <div>
          <Label htmlFor='status' className='text-xs'>Бүртгэлийн төлөв</Label>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger id='status' className='h-9 mt-1'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Бүх төлөв</SelectItem>
              <SelectItem value='pending'>Хүлээгдэж буй</SelectItem>
              <SelectItem value='approved'>Зөвшөөрсөн</SelectItem>
              <SelectItem value='rejected'>Татгалзсан</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Payment Status */}
        <div>
          <Label htmlFor='payment' className='text-xs'>Төлбөрийн төлөв</Label>
          <Select value={selectedPaymentStatus} onValueChange={setSelectedPaymentStatus}>
            <SelectTrigger id='payment' className='h-9 mt-1'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Бүх төлөв</SelectItem>
              <SelectItem value='verified'>Баталгаажсан</SelectItem>
              <SelectItem value='pending'>Хүлээгдэж буй</SelectItem>
              <SelectItem value='not_uploaded'>Төлөөгүй</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Organisation Type */}
        <div>
          <Label htmlFor='orgType' className='text-xs'>Байгууллагын төрөл</Label>
          <Select value={selectedOrgType} onValueChange={setSelectedOrgType}>
            <SelectTrigger id='orgType' className='h-9 mt-1'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Бүх төрөл</SelectItem>
              <SelectItem value='company'>Компани</SelectItem>
              <SelectItem value='school'>Сургууль</SelectItem>
              <SelectItem value='individual'>Хувь хүн</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Aimag (Province) */}
        <div>
          <Label htmlFor='aimag' className='text-xs'>Аймаг/Хот</Label>
          <Select value={selectedAimag} onValueChange={setSelectedAimag}>
            <SelectTrigger id='aimag' className='h-9 mt-1'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Бүх аймаг</SelectItem>
              {aimags.map((aimag) => (
                <SelectItem key={aimag} value={aimag}>
                  {aimag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category */}
        <div>
          <Label htmlFor='category' className='text-xs'>Категори</Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger id='category' className='h-9 mt-1'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Бүх категори</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Summary */}
      <div className='mt-4 pt-4 border-t text-sm text-muted-foreground'>
        <span className='font-medium text-foreground'>{filteredRegistrations.length}</span> бүртгэл олдлоо
        {registrations.length !== filteredRegistrations.length && (
          <span className='ml-2'>({registrations.length}-с)</span>
        )}
      </div>
    </CardBox>
  )
}
