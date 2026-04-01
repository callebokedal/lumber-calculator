import { describe, it, expect } from 'vitest'
import { optimizeProject } from './optimizer.js'

// Helper to build a minimal LumberItem
const item = (width, height, length, quantity = 1) => ({ width, height, length, quantity })

describe('optimizeProject', () => {
  it('returns empty array when there are no items', () => {
    expect(optimizeProject([], {})).toEqual([])
  })

  it('places all cuts in unplacedCuts when no stock exists for a dimension', () => {
    const items = [item(45, 145, 1000, 2)]
    const result = optimizeProject(items, {})
    expect(result).toHaveLength(1)
    const r = result[0]
    expect(r.dimensionKey).toBe('45x145')
    expect(r.boards).toEqual([])
    expect(r.unplacedCuts).toEqual([1000, 1000])
    expect(r.totalLengthNeeded).toBe(2000)
    expect(r.totalLengthBought).toBe(0)
    expect(r.totalWaste).toBe(0)
  })

  it('produces zero waste when cut is an exact match for stock length', () => {
    const items = [item(45, 145, 3000)]
    const result = optimizeProject(items, { '45x145': [3000] })
    const r = result[0]
    expect(r.boards).toHaveLength(1)
    expect(r.boards[0].stockLength).toBe(3000)
    expect(r.boards[0].waste).toBe(0)
    expect(r.unplacedCuts).toEqual([])
  })

  it('picks the shortest stock length that fits the cut', () => {
    const items = [item(45, 145, 2400)]
    const result = optimizeProject(items, { '45x145': [2700, 3600, 4800] })
    const r = result[0]
    expect(r.boards).toHaveLength(1)
    expect(r.boards[0].stockLength).toBe(2700)
    expect(r.boards[0].waste).toBe(300)
  })

  it('packs multiple cuts into one board when they fit', () => {
    // 1500 + 1500 = 3000, fits in one 3600mm board
    const items = [item(45, 145, 1500, 2)]
    const result = optimizeProject(items, { '45x145': [3600] })
    const r = result[0]
    expect(r.boards).toHaveLength(1)
    expect(r.boards[0].cuts).toHaveLength(2)
    expect(r.boards[0].waste).toBe(600)
  })

  it('places a cut in unplacedCuts when it exceeds all stock lengths', () => {
    const items = [item(45, 145, 5000)]
    const result = optimizeProject(items, { '45x145': [3600, 4800] })
    const r = result[0]
    expect(r.unplacedCuts).toContain(5000)
    expect(r.boards).toHaveLength(0)
  })

  it('expands quantity correctly into individual cuts', () => {
    const items = [item(45, 145, 1000, 3)]
    const result = optimizeProject(items, { '45x145': [4000] })
    const r = result[0]
    expect(r.totalLengthNeeded).toBe(3000)
  })

  it('produces separate DimensionResult entries for different dimensions', () => {
    const items = [item(45, 145, 1000), item(45, 95, 800)]
    const result = optimizeProject(items, {
      '45x145': [3600],
      '45x95': [3600],
    })
    expect(result).toHaveLength(2)
    const keys = result.map((r) => r.dimensionKey).sort()
    expect(keys).toEqual(['45x145', '45x95'])
  })

  it('totalLengthBought minus totalLengthNeeded equals totalWaste', () => {
    const items = [item(45, 145, 1200, 3)]
    const result = optimizeProject(items, { '45x145': [2700, 3600] })
    const r = result[0]
    expect(r.totalLengthBought - r.totalLengthNeeded).toBe(r.totalWaste)
  })

  it('uses FFD large-first ordering to minimize boards used', () => {
    // Cuts: 2000, 1800, 1000 — FFD should place 2000+1000 and 1800 into 2 boards of 3600
    // A naive order might open 3 boards; FFD should use at most 2
    const items = [item(45, 145, 2000), item(45, 145, 1800), item(45, 145, 1000)]
    const result = optimizeProject(items, { '45x145': [3600] })
    const r = result[0]
    expect(r.boards.length).toBeLessThanOrEqual(2)
  })

  it('opens a new board when remaining space is insufficient for the next cut', () => {
    // 2500 + 2500 = 5000 > 3600, so two boards needed
    const items = [item(45, 145, 2500, 2)]
    const result = optimizeProject(items, { '45x145': [3600] })
    const r = result[0]
    expect(r.boards).toHaveLength(2)
    expect(r.totalLengthBought).toBe(7200)
    expect(r.totalWaste).toBe(2200)
  })
})
