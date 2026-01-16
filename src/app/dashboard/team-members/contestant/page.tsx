'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Search, Edit, Trash2, Plus } from 'lucide-react'
import Link from 'next/link'
import { mockContestants, type Contestant } from '@/data/mockUserData'

export default function ContestantLibraryPage() {
  const [contestants, setContestants] = useState<Contestant[]>(mockContestants)
  const [searchQuery, setSearchQuery] = useState('')
  const [entriesPerPage, setEntriesPerPage] = useState('10')
  const [currentPage, setCurrentPage] = useState(1)

  // Filter contestants based on search
  const filteredContestants = contestants.filter((contestant) =>
    contestant.listName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contestant.youngId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contestant.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Pagination
  const totalPages = Math.ceil(filteredContestants.length / parseInt(entriesPerPage))
  const startIndex = (currentPage - 1) * parseInt(entriesPerPage)
  const paginatedContestants = filteredContestants.slice(
    startIndex,
    startIndex + parseInt(entriesPerPage)
  )

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this contestant?')) {
      setContestants((prev) => prev.filter((c) => c.id !== id))
    }
  }

  return (
    <div className='container mx-auto px-6 py-8'>
      {/* Breadcrumb */}
      <div className='mb-6 text-sm text-gray-600'>
        <Link href='/dashboard/team-members' className='hover:text-blue-500'>
          Team Members
        </Link>
        {' > '}
        <span className='text-gray-900 font-medium'>Contestant</span>
      </div>

      {/* Header */}
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>Contestant Library</h1>
        <Link href='/dashboard/team-members/contestant/add'>
          <Button className='bg-blue-500 hover:bg-blue-600'>
            <Plus size={18} className='mr-2' />
            Add
          </Button>
        </Link>
      </div>

      {/* Table Card */}
      <div className='bg-white rounded-lg shadow'>
        {/* Controls */}
        <div className='p-4 border-b flex justify-between items-center'>
          <div className='flex items-center gap-2'>
            <span className='text-sm text-gray-600'>Show</span>
            <Select value={entriesPerPage} onValueChange={setEntriesPerPage}>
              <SelectTrigger className='w-20'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='10'>10</SelectItem>
                <SelectItem value='25'>25</SelectItem>
                <SelectItem value='50'>50</SelectItem>
              </SelectContent>
            </Select>
            <span className='text-sm text-gray-600'>entries</span>
          </div>

          <div className='flex items-center gap-2'>
            <span className='text-sm text-gray-600'>Search:</span>
            <Input
              type='text'
              placeholder=''
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-48'
            />
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>List Name</TableHead>
              <TableHead>YOUNG+ ID</TableHead>
              <TableHead>YOUNG+ ID Password</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Birthdate</TableHead>
              <TableHead>Passport No.</TableHead>
              <TableHead className='text-right'>Operate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedContestants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className='text-center py-8 text-gray-500'>
                  No data available in table
                </TableCell>
              </TableRow>
            ) : (
              paginatedContestants.map((contestant) => (
                <TableRow key={contestant.id}>
                  <TableCell className='font-medium'>{contestant.listName}</TableCell>
                  <TableCell>{contestant.youngId}</TableCell>
                  <TableCell>{contestant.youngPassword}</TableCell>
                  <TableCell>
                    {new Date(contestant.createdAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell>{contestant.birthdate}</TableCell>
                  <TableCell>{contestant.passportNo}</TableCell>
                  <TableCell>
                    <div className='flex justify-end gap-2'>
                      <Link href={`/dashboard/team-members/contestant/${contestant.id}`}>
                        <Button size='sm' className='bg-blue-500 hover:bg-blue-600'>
                          <Edit size={14} className='mr-1' />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        size='sm'
                        variant='destructive'
                        onClick={() => handleDelete(contestant.id)}
                      >
                        <Trash2 size={14} className='mr-1' />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Footer */}
        <div className='p-4 border-t flex justify-between items-center'>
          <div className='text-sm text-gray-600'>
            Showing {startIndex + 1} to {Math.min(startIndex + parseInt(entriesPerPage), filteredContestants.length)} of {filteredContestants.length} entries
          </div>

          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size='sm'
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? 'bg-blue-500 hover:bg-blue-600' : ''}
              >
                {page}
              </Button>
            ))}

            <Button
              variant='outline'
              size='sm'
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
