import type { CharacterStatistics } from '../../model/statistics'

interface Props {
  stat: CharacterStatistics
}

export function CharacterStatisticsView({ stat: { kanji } }: Props) {
  return (
    <div>
      <div>{kanji}</div>
    </div>
  )
}
