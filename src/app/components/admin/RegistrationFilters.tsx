'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
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
import { COMPETITION_CATEGORIES } from '@/data/mockRegistrations'
import type { Registration, RegistrationStatus, PaymentStatus } from '@/data/mockRegistrations'
import { Search, Filter, X, Calendar } from 'lucide-react'
import CardBox from '../shared/CardBox'
import { Badge } from '@/components/ui/badge'

interface RegistrationFiltersProps {
  registrations: Registration[]
  onFilteredResults: (filtered: Registration[]) => void
}

export const RegistrationFilters = ({ registrations, onFilteredResults }: RegistrationFiltersProps) => {
  const searchParams = useSearchParams()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedSchool, setSelectedSchool] = useState<string>('all')
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>('all')
  const [selectedLocation, setSelectedLocation] = useState<string>('all')

  // Initialize filters from URL parameters on mount
  useEffect(() => {
    const status = searchParams.get('status')
    const paymentStatus = searchParams.get('paymentStatus')
    const category = searchParams.get('category')
    const school = searchParams.get('school')
    const location = searchParams.get('location')

    if (status) setSelectedStatus(status)
    if (paymentStatus) setSelectedPaymentStatus(paymentStatus)
    if (category) setSelectedCategory(category)
    if (school) setSelectedSchool(school)
    if (location) setSelectedLocation(location)
  }, [searchParams])

  // DYNAMIC LISTS: These automatically update based on actual registration data
  // If new schools or cities appear in registrations, they'll show up in filters
  const schools = useMemo(() => {
    const uniqueSchools = Array.from(new Set(registrations.map((r) => r.schoolName)))
    return uniqueSchools.sort()
  }, [registrations])

  const locations = useMemo(() => {
    const uniqueLocations = Array.from(new Set(registrations.map((r) => r.location)))
    return uniqueLocations.sort()
  }, [registrations])

  // Filter registrations
  const filteredRegistrations = useMemo(() => {
    let filtered = [...registrations]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (reg) =>
          reg.teamName.toLowerCase().includes(query) ||
          reg.registrationNumber.toLowerCase().includes(query) ||
          reg.schoolName.toLowerCase().includes(query) ||
          reg.contactPerson.name.toLowerCase().includes(query) ||
          reg.contactPerson.email.toLowerCase().includes(query)
      )
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((reg) => reg.status === selectedStatus)
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((reg) => reg.category === selectedCategory)
    }

    // School filter
    if (selectedSchool !== 'all') {
      filtered = filtered.filter((reg) => reg.schoolName === selectedSchool)
    }

    // Payment status filter
    if (selectedPaymentStatus !== 'all') {
      filtered = filtered.filter((reg) => reg.paymentStatus === selectedPaymentStatus)
    }

    // Location filter
    if (selectedLocation !== 'all') {
      filtered = filtered.filter((reg) => reg.location === selectedLocation)
    }

    return filtered
  }, [
    registrations,
    searchQuery,
    selectedStatus,
    selectedCategory,
    selectedSchool,
    selectedPaymentStatus,
    selectedLocation,
  ])

  // Update parent whenever filters change
  useMemo(() => {
    onFilteredResults(filteredRegistrations)
  }, [filteredRegistrations, onFilteredResults])

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('')
    setSelectedStatus('all')
    setSelectedCategory('all')
    setSelectedSchool('all')
    setSelectedPaymentStatus('all')
    setSelectedLocation('all')
  }

  // Count active filters
  const activeFiltersCount =
    (searchQuery ? 1 : 0) +
    (selectedStatus !== 'all' ? 1 : 0) +
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedSchool !== 'all' ? 1 : 0) +
    (selectedPaymentStatus !== 'all' ? 1 : 0) +
    (selectedLocation !== 'all' ? 1 : 0)

  return (
    <CardBox className='mb-6'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-2'>
          <Filter size={20} />
          <h3 className='font-semibold'>Шүүлтүүр</h3>
          {activeFiltersCount > 0 && (
            <Badge className='bg-primary'>{activeFiltersCount} идэвхтэй</Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button variant='ghost' size='sm' onClick={handleClearFilters} className='gap-2'>
            <X size={16} />
            Цэвэрлэх
          </Button>
        )}
      </div>

      <div className='space-y-3'>
        {/* Search */}
        <div>
          <Label htmlFor='search' className='text-xs'>Хайлт</Label>
          <div className='relative mt-1'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground' size={16} />
            <Input
              id='search'
              placeholder='Багийн нэр, дугаар, сургууль, холбоо барих хүн...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-9 h-9'
            />
          </div>
        </div>

        {/* Filter buttons - aligned to left */}
        <div className='flex flex-wrap gap-2 items-end'>
          {/* Status */}
          <div className='min-w-[140px]'>
            <Label htmlFor='status' className='text-xs'>Төлөв</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger id='status' className='h-9 mt-1 w-[140px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Бүгд</SelectItem>
                <SelectItem value='pending'>Хүлээгдэж буй</SelectItem>
                <SelectItem value='approved'>Зөвшөөрсөн</SelectItem>
                <SelectItem value='rejected'>Татгалзсан</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment Status */}
          <div className='min-w-[140px]'>
            <Label htmlFor='paymentStatus' className='text-xs'>Төлбөр</Label>
            <Select value={selectedPaymentStatus} onValueChange={setSelectedPaymentStatus}>
              <SelectTrigger id='paymentStatus' className='h-9 mt-1 w-[140px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Бүгд</SelectItem>
                <SelectItem value='verified'>Баталгаажсан</SelectItem>
                <SelectItem value='uploaded'>Оруулсан</SelectItem>
                <SelectItem value='not_uploaded'>Оруулаагүй</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className='min-w-[140px]'>
            <Label htmlFor='location' className='text-xs'>Байршил</Label>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger id='location' className='h-9 mt-1 w-[140px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Бүх хот</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* School */}
          <div className='min-w-[160px]'>
            <Label htmlFor='school' className='text-xs'>Сургууль</Label>
            <Select value={selectedSchool} onValueChange={setSelectedSchool}>
              <SelectTrigger id='school' className='h-9 mt-1 w-[160px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Бүх сургууль</SelectItem>
                {schools.map((school) => (
                  <SelectItem key={school} value={school}>
                    {school}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className='min-w-[200px]'>
            <Label htmlFor='category' className='text-xs'>Төрөл</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger id='category' className='h-9 mt-1 w-[200px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Бүх төрөл</SelectItem>
                {COMPETITION_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className='mt-4 pt-4 border-t'>
        <p className='text-sm text-muted-foreground'>
          <strong className='text-foreground'>{filteredRegistrations.length}</strong> бүртгэл олдлоо
          {activeFiltersCount > 0 && (
            <span>
              {' '}
              (нийт <strong className='text-foreground'>{registrations.length}</strong> бүртгэлээс)
            </span>
          )}
        </p>
      </div>
    </CardBox>
  )
}
