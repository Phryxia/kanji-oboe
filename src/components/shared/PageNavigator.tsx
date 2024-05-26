import { map } from '@fxts/core'
import { integers } from '../../utils/math'

interface Props {
  currentPage: number
  maxPage: number
  sliceSize?: number
  onPageChange(newPage: number): void
}

export function PageNavaigator({
  currentPage,
  maxPage,
  sliceSize = Infinity,
  onPageChange,
}: Props) {
  const [start, end] = getPageSlice(currentPage, maxPage, sliceSize)

  return (
    <nav>
      <button disabled={currentPage === 0} onClick={() => onPageChange(currentPage - 1)}>
        prev
      </button>
      {start > 0 && '...'}
      {[
        ...map(
          (i) => (
            <button key={i} onClick={() => onPageChange(i)}>
              {i}
            </button>
          ),
          integers(start, end),
        ),
      ]}
      {end < maxPage && '...'}
      <button
        disabled={currentPage === maxPage}
        onClick={() => onPageChange(currentPage + 1)}
      >
        next
      </button>
    </nav>
  )
}

export function getPageSlice(currentPage: number, maxPage: number, sliceSize: number) {
  if (sliceSize === Infinity) {
    return [0, maxPage]
  }
  const half = Math.floor(sliceSize / 2)
  const start = currentPage - (sliceSize % 2 ? half : half - 1)
  const end = currentPage + half

  if (start < 0) {
    return [0, Math.min(end - start, maxPage)]
  }
  if (end > maxPage) {
    return [Math.max(0, start - (end - maxPage)), maxPage]
  }
  return [start, end]
}
