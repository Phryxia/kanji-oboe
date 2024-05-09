import { compareKankenLevel } from '../../utils/character'
import { ETC } from './consts'

export function sortJLPTGroup(g1: string, g2: string) {
  if (g1 === ETC) {
    if (g2 === ETC) {
      return 0
    }
    return 1
  }
  if (g2 === ETC) {
    return -1
  }
  return Number(g2) - Number(g1)
}

export function sortKankenGroup(g1: string, g2: string) {
  if (g1 === ETC) {
    if (g2 === ETC) {
      return 0
    }
    return 1
  }
  if (g2 === ETC) {
    return -1
  }
  return -compareKankenLevel(g1, g2)
}
