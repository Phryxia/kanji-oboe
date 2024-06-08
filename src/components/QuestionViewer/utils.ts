export function removeBracket(s: string) {
  return s.replace(/\[|\]/g, '').replace(/-/g, 'ー')
}

export function sortFurigana(furiganas: string[], main?: string) {
  return [...furiganas].sort((a, b) => {
    if (main) {
      if (a === main) return -1
      if (b === main) return 1
    }
    if (a > b) return 1
    if (a < b) return -1
    return 0
  })
}
