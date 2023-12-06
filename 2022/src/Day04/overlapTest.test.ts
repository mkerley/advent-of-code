import { isOverlap } from './day04-1'

describe('isOverlap', () => {
  it('should detect a contains b', () => {
    expect(isOverlap([2, 5], [3, 4])).toBeTruthy()
  })

  it('should detect b contains a', () => {
    expect(isOverlap([3, 4], [2, 5])).toBeTruthy()
  })

  it('should detect a === b', () => {
    expect(isOverlap([3, 4], [3, 4])).toBeTruthy()
  })

  it('should detect [3, 4] overlaps [4, 5]', () => {
    expect(isOverlap([3, 4], [4, 5])).toBeTruthy()
  })

  it('should detect [5, 6] overlaps [4, 5]', () => {
    expect(isOverlap([5, 6], [4, 5])).toBeTruthy()
  })

  it('should detect [3, 4] does not overlap [5, 6]', () => {
    expect(isOverlap([3, 4], [5, 6])).toBeFalsy()
  })

  it('should detect 58-98, 23-57 does not overlap', () => {
    expect(isOverlap([58, 98], [23, 57])).toBeFalsy()
  })
})
