import { parse } from 'csv/sync'
import { HIRAGANA_REGEXP, KATAKANA_REGEPX } from '../consts/character'
import type { Kanji, KankenLevel, Vocabulary } from '../model/types'

export async function loadKanjiList() {
  const [records, kankenLevels] = await Promise.all([
    loadCSV('/Kanji_20240506_130248.csv', ';'),
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
  const records = await loadCSV('/kanken.csv', ';')
  return Object.fromEntries(records)
}

async function loadCSV(url: string, delimiter: string) {
  const response = await fetch(url)
  const data = await response.text()
  return parse(data, {
    encoding: 'utf-8',
    delimiter: delimiter,
    onRecord(record, { lines }) {
      if (lines === 1) {
        return null
      }
      return record
    },
  })
}

export async function loadVocabs(): Promise<Vocabulary[]> {
  const records = await loadCSV('/jlpt_vocab.csv', ',')

  return records
    .map(([word, furigana, translateEn, jlptLevel]: string[]) => ({
      word,
      furigana,
      translateEn,
      jlptLevel: Number(jlptLevel.replace('N', '')),
    }))
    .filter(({ word }: Vocabulary) => isKanjiExists(word))
}

function isKanjiExists(word: string) {
  return (
    word
      .replaceAll('～', '')
      .replace(new RegExp(KATAKANA_REGEPX, 'g'), '')
      .replace(new RegExp(HIRAGANA_REGEXP, 'g'), '').length > 0
  )
}
