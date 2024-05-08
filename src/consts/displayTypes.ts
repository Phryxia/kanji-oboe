import type { DisplayType, LabelPair } from '../model/types'

export const DisplayTypes: DisplayType[] = ['kanji', 'onyomi', 'kunyomi']

export const LabeledDisplayTypes: LabelPair<DisplayType>[] = [
  {
    value: 'kanji',
    label: '한자',
  },
  {
    value: 'onyomi',
    label: '음독',
  },
  {
    value: 'kunyomi',
    label: '훈독',
  },
]
