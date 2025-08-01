import { userHasAccess, roles } from '@/lib/roles'

describe('roles utility', () => {
  describe('userHasAccess', () => {
    it('should return true when no required role is specified', () => {
      const result = userHasAccess(null, { role: 'PLAYER' })
      expect(result).toBe(true)
    })

    it('should return false when user is not provided', () => {
      const result = userHasAccess('ADMIN', null)
      expect(result).toBe(false)
    })

    it('should return false when user has no role', () => {
      const result = userHasAccess('ADMIN', {})
      expect(result).toBe(false)
    })

    it('should return true when user role meets requirement (exact match)', () => {
      const result = userHasAccess('ADMIN', { role: 'ADMIN' })
      expect(result).toBe(true)
    })

    it('should return true when user role exceeds requirement', () => {
      const result = userHasAccess('STAFF', { role: 'ADMIN' })
      expect(result).toBe(true)
    })

    it('should return false when user role is below requirement', () => {
      const result = userHasAccess('ADMIN', { role: 'STAFF' })
      expect(result).toBe(false)
    })

    it('should handle SYSTEM_ADMIN correctly', () => {
      const result = userHasAccess('SYSTEM_ADMIN', { role: 'SYSTEM_ADMIN' })
      expect(result).toBe(true)
    })

    it('should handle BANNED user correctly', () => {
      const result = userHasAccess('PLAYER', { role: 'BANNED' })
      expect(result).toBe(false)
    })
  })

  describe('roles array', () => {
    it('should have correct role hierarchy', () => {
      expect(roles).toEqual([
        'BANNED',
        'PLAYER', 
        'STAFF',
        'GAME_MODERATOR',
        'ASSISTANT_ADMIN',
        'ADMIN',
        'SYSTEM_ADMIN'
      ])
    })
  })
})