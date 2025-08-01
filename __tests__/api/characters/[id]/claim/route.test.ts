import { PUT } from '@/app/api/characters/[id]/claim/route'
import { getSession } from '@/lib/auth'
import { claimNPC } from '@/lib/_characters'
import { NextRequest } from 'next/server'

// Mock the dependencies
jest.mock('@/lib/auth')
jest.mock('@/lib/_characters')

const mockGetSession = getSession as jest.MockedFunction<typeof getSession>
const mockClaimNPC = claimNPC as jest.MockedFunction<typeof claimNPC>

describe('/api/characters/[id]/claim', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('PUT', () => {
    it('should return 403 for non-staff users', async () => {
      mockGetSession.mockResolvedValue({
        session: { user: { role: 'PLAYER' } }
      })

      const request = new NextRequest('http://localhost/api/characters/123/claim', {
        method: 'PUT'
      })
      const params = Promise.resolve({ id: '123' })
      
      const response = await PUT(request, { params })
      expect(response.status).toBe(403)
      const body = await response.json()
      expect(body.error).toBe('Unauthorized')
    })

    it('should successfully claim NPC for staff users', async () => {
      mockGetSession.mockResolvedValue({
        session: { user: { id: 'user-123', role: 'STAFF' } }
      })

      const mockClaimedCharacter = {
        id: BigInt(123),
        name: 'Test NPC',
        userId: 'user-123'
      }
      mockClaimNPC.mockResolvedValue(mockClaimedCharacter)

      const request = new NextRequest('http://localhost/api/characters/123/claim', {
        method: 'PUT'
      })
      const params = Promise.resolve({ id: '123' })
      
      const response = await PUT(request, { params })
      expect(response.status).toBe(200)
      expect(mockClaimNPC).toHaveBeenCalledWith(BigInt(123), 'user-123')

      const body = await response.json()
      expect(body.id).toBe('123') // BigInt should be serialized as string
      expect(body.name).toBe('Test NPC')
      expect(body.userId).toBe('user-123')
    })

    it('should return 500 when claimNPC throws an error', async () => {
      mockGetSession.mockResolvedValue({
        session: { user: { id: 'user-123', role: 'STAFF' } }
      })

      mockClaimNPC.mockRejectedValue(new Error('Character is not an NPC'))

      const request = new NextRequest('http://localhost/api/characters/123/claim', {
        method: 'PUT'
      })
      const params = Promise.resolve({ id: '123' })
      
      const response = await PUT(request, { params })
      expect(response.status).toBe(500)
      const body = await response.json()
      expect(body.error).toBe('Character is not an NPC')
    })

    it('should allow GAME_MODERATOR to claim NPCs', async () => {
      mockGetSession.mockResolvedValue({
        session: { user: { id: 'mod-123', role: 'GAME_MODERATOR' } }
      })

      const mockClaimedCharacter = {
        id: BigInt(456),
        name: 'Another NPC',
        userId: 'mod-123'
      }
      mockClaimNPC.mockResolvedValue(mockClaimedCharacter)

      const request = new NextRequest('http://localhost/api/characters/456/claim', {
        method: 'PUT'
      })
      const params = Promise.resolve({ id: '456' })
      
      const response = await PUT(request, { params })
      expect(response.status).toBe(200)
      expect(mockClaimNPC).toHaveBeenCalledWith(BigInt(456), 'mod-123')
    })
  })
})