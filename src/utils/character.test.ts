import { test, expect } from 'vitest'
import { compareKankenLevel } from './character'

test('compareKankenLevel', () => {
  const a = ['1', 'pre1', '2', 'pre2', '3', '4', '5', '6', '7', '8', '9', '10']
  const b = ['1', 'pre1', '2', 'pre2', '3', '4', '5', '6', '7', '8', '9', '10']

  for (let i = 0; i < a.length; ++i) {
    for (let j = 0; j < b.length; ++j) {
      expect(Math.sign(compareKankenLevel(a[i], b[j]))).toBe(Math.sign(i - j))
    }
  }
})
