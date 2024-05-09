import type { Kanji } from '../../model/types'

interface Props {
  title: string
  kanjis: Kanji[]
}

export function GroupStatistics({ title, kanjis }: Props) {
  return (
    <section>
      <details>
        <summary>{title}</summary>
        {kanjis.map(({ kanji }) => (
          <button>{kanji}</button>
        ))}
      </details>
    </section>
  )
}
