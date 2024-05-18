export interface CharacterStatistics {
  kanji: string
  lastSolvedDate?: Date
  kanjiToOnSolved?: Record<string, number>
  kanjiToOnCorrected?: Record<string, number>
  kanjiToKunSolved?: Record<string, number>
  kanjiToKunCorrected?: Record<string, number>
  onToKanjiSolved?: number
  onToKanjiCorrected?: number
  kunToKanjiSolved?: number
  kunToKanjiCorrected?: number
}

export interface GroupStatistics {
  groupName: string
  solvedCount: number
  lastSolvedDate: Date
}
