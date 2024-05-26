import classnames from 'classnames/bind'
import styles from './PageNavigator.module.css'
import { map } from '@fxts/core'
import { integers } from '../../utils/math'

const cx = classnames.bind(styles)

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
    <nav className={cx('root')}>
      <button
        className={cx('button')}
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
      >
        이전
      </button>
      <div className={cx('fill')}>{start > 0 && '...'}</div>
      <div className={cx('pages')}>
        {[
          ...map(
            (i) => (
              <button
                key={i}
                className={cx('button', { selected: currentPage === i })}
                onClick={() => onPageChange(i)}
              >
                {i}
              </button>
            ),
            integers(start, end),
          ),
        ]}
      </div>
      <div className={cx('fill')}>{end < maxPage && '...'}</div>
      <button
        className={cx('button')}
        disabled={currentPage === maxPage}
        onClick={() => onPageChange(currentPage + 1)}
      >
        다음
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
