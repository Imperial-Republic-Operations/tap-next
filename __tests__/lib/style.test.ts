import { classNames, getProperCapitalization } from '@/lib/style'

describe('style utilities', () => {
  describe('classNames', () => {
    it('should concatenate class names', () => {
      const result = classNames('class1', 'class2', 'class3')
      expect(result).toBe('class1 class2 class3')
    })

    it('should handle conditional classes', () => {
      const result = classNames(
        'base-class',
        true && 'conditional-true',
        false && 'conditional-false'
      )
      expect(result).toBe('base-class conditional-true')
    })

    it('should filter out falsy values', () => {
      const result = classNames(
        'class1',
        null,
        undefined,
        '',
        'class2',
        0,
        'class3'
      )
      expect(result).toBe('class1 class2 class3')
    })

    it('should handle empty input', () => {
      const result = classNames()
      expect(result).toBe('')
    })

    it('should handle mixed types', () => {
      const condition = true
      const result = classNames(
        'always',
        condition ? 'when-true' : 'when-false',
        !condition && 'when-not-condition'
      )
      expect(result).toBe('always when-true')
    })
  })

  describe('getProperCapitalization', () => {
    it('should capitalize first letter and lowercase the rest', () => {
      expect(getProperCapitalization('hello')).toBe('Hello')
      expect(getProperCapitalization('WORLD')).toBe('World')
      expect(getProperCapitalization('tEST')).toBe('Test')
    })

    it('should handle single character strings', () => {
      expect(getProperCapitalization('a')).toBe('A')
      expect(getProperCapitalization('Z')).toBe('Z')
    })

    it('should handle empty string', () => {
      expect(getProperCapitalization('')).toBe('')
    })

    it('should handle strings with underscores (role names)', () => {
      expect(getProperCapitalization('SYSTEM_ADMIN')).toBe('System_admin')
      expect(getProperCapitalization('GAME_MODERATOR')).toBe('Game_moderator')
    })

    it('should handle mixed case with spaces', () => {
      expect(getProperCapitalization('hello world')).toBe('Hello world')
      expect(getProperCapitalization('HELLO WORLD')).toBe('Hello world')
    })
  })
})