import classnames from 'classnames/bind'
import styles from './TagCheckboxes.module.css'
import { useLayoutEffect, useState } from 'react'
import { ToggleButton } from './ToggleButton'
import type { LabelPair } from '../../model/types'

const cx = classnames.bind(styles)

interface Props<T> {
  entries: LabelPair<T>[]
  selectedValues?: T[]
  onChange(selectedValues: T[]): void
}

export function TagCheckboxes<T>({ entries, selectedValues, onChange }: Props<T>) {
  const [isChecked, setIsChecked] = useState(
    entries.map(({ value }) => !!selectedValues?.includes(value)),
  )

  function createHandleChange(index: number) {
    return (newValue: boolean) => {
      const newIsChecked = isChecked.map((value, i) => (i === index ? newValue : value))
      setIsChecked(newIsChecked)
      onChange(entries.filter((_, i) => newIsChecked[i]).map(({ value }) => value))
    }
  }

  useLayoutEffect(() => {
    setIsChecked(entries.map(({ value }) => !!selectedValues?.includes(value)))
  }, [selectedValues])

  return (
    <ul className={cx('tags')}>
      {entries.map(({ label }, i) => (
        <ToggleButton
          key={label}
          label={label}
          value={isChecked[i]}
          onChange={createHandleChange(i)}
        />
      ))}
    </ul>
  )
}
