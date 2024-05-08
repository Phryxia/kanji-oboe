import { parse } from 'csv/sync'
import { HIRAGANA_REGEXP, KATAKANA_REGEPX } from '../consts/character'
import { Kanji, KankenLevel } from '../model/types'

export async function loadKanjiList() {
  const [records, kankenLevels] = await Promise.all([
    loadCSV('/Kanji_20240506_130248.csv'),
    loadKankenList(),
  ])
  const kanjis: Kanji[] = records.map(
    ([id, kanji, strokes, jlptLevel, radicals, readings]: string[]) => ({
      id,
      kanji,
      strokes: Number(strokes),
      jlptLevel: Number(jlptLevel) || undefined,
      kankenLevel: kankenLevels[kanji],
      radicals: radicals.split(','),
      onyomi: readings
        .split('、')
        .filter((reading: string) => reading.match(KATAKANA_REGEPX)),
      kunyomi: readings
        .split('、')
        .filter((reading: string) => reading.match(HIRAGANA_REGEXP)),
    }),
  )
  return {
    kanjis,
    kankenLevels,
  }
}

async function loadKankenList(): Promise<Record<string, KankenLevel>> {
  const records = await loadCSV('/kanken.csv')
  return Object.fromEntries(records)
}

async function loadCSV(url: string) {
  const response = await fetch(url)
  const data = await response.text()
  return parse(data, {
    encoding: 'utf-8',
    delimiter: ';',
    onRecord(record, { lines }) {
      if (lines === 1) {
        return null
      }
      return record
    },
  })
}
