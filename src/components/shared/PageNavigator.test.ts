import { test, expect } from 'vitest'
import { getPageSlice } from './PageNavigator'

test('getPageSlice', () => {
  expect(getPageSlice(0, 10, 2)).toMatchObject([0, 1])
  expect(getPageSlice(0, 10, 3)).toMatchObject([0, 2])
  expect(getPageSlice(1, 10, 2)).toMatchObject([1, 2])
  expect(getPageSlice(1, 10, 3)).toMatchObject([0, 2])
  expect(getPageSlice(1, 10, 4)).toMatchObject([0, 3])
  expect(getPageSlice(9, 10, 4)).toMatchObject([7, 10])
  expect(getPageSlice(5, 10, 15)).toMatchObject([0, 10])
})
