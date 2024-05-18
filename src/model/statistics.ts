export interface CharacterStatistics {
  kanji: string
  lastSolvedDate?: Date
  kanjiToOnSolved?: number
  kanjiToOnCorrected?: number
  kanjiToKunSolved?: number
  kanjiToKunCorrected?: number
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
