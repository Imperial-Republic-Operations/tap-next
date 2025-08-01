import { GET, PUT } from '@/app/api/users/route'
import { getSession } from '@/lib/auth'
import { fetchAllUsers, updateUserRole } from '@/lib/_users'
import { NextRequest } from 'next/server'

// Mock the dependencies
jest.mock('@/lib/auth')
jest.mock('@/lib/_users')

const mockGetSession = getSession as jest.MockedFunction<typeof getSession>
const mockFetchAllUsers = fetchAllUsers as jest.MockedFunction<typeof fetchAllUsers>
const mockUpdateUserRole = updateUserRole as jest.MockedFunction<typeof updateUserRole>

describe('/api/users', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    it('should return 403 for non-admin users', async () => {
      mockGetSession.mockResolvedValue({
        session: { user: { role: 'PLAYER' } }
      })

      const request = new NextRequest('http://localhost/api/users')
      const response = await GET(request)
      
      expect(response.status).toBe(403)
      const body = await response.json()
      expect(body.error).toBe('Unauthorized')
    })

    it('should return users list for admin users', async () => {
      mockGetSession.mockResolvedValue({
        session: { user: { role: 'ADMIN' } }
      })

      const mockUsers = [
        { id: '1', name: 'Test User', email: 'test@example.com', role: 'PLAYER' }
      ]
      mockFetchAllUsers.mockResolvedValue({
        users: mockUsers,
        totalPages: 1,
        totalCount: 1
      })

      const request = new NextRequest('http://localhost/api/users?page=0')
      const response = await GET(request)
      
      expect(response.status).toBe(200)
      expect(mockFetchAllUsers).toHaveBeenCalledWith(0, '', '')
    })

    it('should pass search and role filters correctly', async () => {
      mockGetSession.mockResolvedValue({
        session: { user: { role: 'ADMIN' } }
      })

      mockFetchAllUsers.mockResolvedValue({
        users: [],
        totalPages: 0,
        totalCount: 0
      })

      const request = new NextRequest('http://localhost/api/users?page=1&search=test&role=STAFF')
      await GET(request)
      
      expect(mockFetchAllUsers).toHaveBeenCalledWith(1, 'test', 'STAFF')
    })
  })

  describe('PUT', () => {
    it('should return 403 for non-admin users', async () => {
      mockGetSession.mockResolvedValue({
        session: { user: { role: 'PLAYER' } }
      })

      const request = new NextRequest('http://localhost/api/users', {
        method: 'PUT',
        body: JSON.stringify({ userId: '1', role: 'STAFF' })
      })
      
      const response = await PUT(request)
      expect(response.status).toBe(403)
    })

    it('should update user role for admin users', async () => {
      mockGetSession.mockResolvedValue({
        session: { user: { id: 'admin-id', role: 'ADMIN' } }
      })

      const mockUpdatedUser = { id: '1', name: 'Test User', role: 'STAFF' }
      mockUpdateUserRole.mockResolvedValue(mockUpdatedUser)

      const request = new NextRequest('http://localhost/api/users', {
        method: 'PUT',
        body: JSON.stringify({ userId: '1', role: 'STAFF' })
      })
      
      const response = await PUT(request)
      expect(response.status).toBe(200)
      expect(mockUpdateUserRole).toHaveBeenCalledWith('1', 'STAFF')
    })

    it('should return 400 for invalid role', async () => {
      mockGetSession.mockResolvedValue({
        session: { user: { id: 'admin-id', role: 'ADMIN' } }
      })

      const request = new NextRequest('http://localhost/api/users', {
        method: 'PUT',
        body: JSON.stringify({ userId: '1', role: 'INVALID_ROLE' })
      })
      
      const response = await PUT(request)
      expect(response.status).toBe(400)
      const body = await response.json()
      expect(body.error).toBe('Invalid role')
    })

    it('should prevent non-system-admin from changing own role', async () => {
      mockGetSession.mockResolvedValue({
        session: { user: { id: 'admin-id', role: 'ADMIN' } }
      })

      const request = new NextRequest('http://localhost/api/users', {
        method: 'PUT',
        body: JSON.stringify({ userId: 'admin-id', role: 'SYSTEM_ADMIN' })
      })
      
      const response = await PUT(request)
      expect(response.status).toBe(403)
      const body = await response.json()
      expect(body.error).toBe('Cannot change your own role')
    })
  })
})