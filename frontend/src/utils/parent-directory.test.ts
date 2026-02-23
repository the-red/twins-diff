import { describe, it, expect } from 'vitest'
import { parentDirectory } from './parent-directory'

describe('parentDirectory', () => {
  it('should return parent directory href when from and to are provided', () => {
    const result = parentDirectory({
      from: '/path/to/old/file.txt',
      to: '/path/to/new/file.txt',
    })

    expect(result.href).toBe('/?from=/path/to/old&to=/path/to/new')
    expect(result.icon).toBe('↩')
    expect(result.text).toBe('Parent Directory')
  })

  it('should return # when from is missing', () => {
    const result = parentDirectory({
      from: undefined,
      to: '/path/to/new',
    })

    expect(result.href).toBe('#')
  })

  it('should return # when to is missing', () => {
    const result = parentDirectory({
      from: '/path/to/old',
      to: undefined,
    })

    expect(result.href).toBe('#')
  })

  it('should return # when both are missing', () => {
    const result = parentDirectory({})

    expect(result.href).toBe('#')
  })

  it('should handle root paths correctly', () => {
    const result = parentDirectory({
      from: '/file.txt',
      to: '/other.txt',
    })

    expect(result.href).toBe('/?from=/&to=/')
  })

  it('should handle paths without leading slash', () => {
    const result = parentDirectory({
      from: 'relative/path/file.txt',
      to: 'other/relative/file.txt',
    })

    expect(result.href).toBe('/?from=relative/path&to=other/relative')
  })

  it('should handle single filename without path', () => {
    const result = parentDirectory({
      from: 'file.txt',
      to: 'other.txt',
    })

    // dirname('file.txt') should return '.'
    expect(result.href).toBe('/?from=.&to=.')
  })
})
