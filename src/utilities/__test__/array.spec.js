import { addArrayItem, replaceArrayItem, removeArrayItem } from '../array'

describe('array utilities helper', () => {
  let initialArray
  beforeEach(() => {
    initialArray = [1, 2, 3, 4]
  })
  describe('#addArrayItem', () => {
    it('should insert item to array', () => {
      expect(addArrayItem(initialArray, 0, false)).toEqual([0, 1, 2, 3, 4])
    })
    it('should add an item to array', () => {
      expect(addArrayItem(initialArray, 0)).toEqual([1, 2, 3, 4, 0])
    })
  })
  describe('#replaceArrayItem', () => {
    it('should replace an item of array', () => {
      expect(replaceArrayItem(initialArray, 1, 0)).toEqual([1, 0, 3, 4])
    })
    it('should return initialArray when can not find index', () => {
      expect(replaceArrayItem(initialArray, -1, 4)).toEqual(initialArray)
    })
    it('should replace an item of array when input predicate', () => {
      expect(replaceArrayItem(initialArray, it => it % 2 === 0, 0)).toEqual([1, 0, 3, 4])
    })
    it('should return initialArray when input predicate can not match', () => {
      expect(replaceArrayItem(initialArray, it => it === 0, 4)).toEqual(initialArray)
    })
  })
  describe('#removeArrayItem', () => {
    it('should remove an item from array', () => {
      expect(removeArrayItem(initialArray, 0)).toEqual([2, 3, 4])
    })
  })
})
