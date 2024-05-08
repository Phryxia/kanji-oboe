import classnames from 'classnames/bind'
import styles from './TagCheckboxes.module.css'
import { useState } from 'react'
import { ToggleButton } from './ToggleButton'

const cx = classnames.bind(styles)

interface Props<T> {
  label: string[]
  domain: T[]
  selectedValues: T[]
  onChange(selectedValues: T[]): void
}

export function TagCheckboxes<T>({ label, domain, selectedValues, onChange }: Props<T>) {
  const [isChecked, setIsChecked] = useState(
    domain.map((entry) => selectedValues.includes(entry)),
  )

  function createHandleChange(index: number) {
    return (newValue: boolean) => {
      const newIsChecked = isChecked.map((value, i) => (i === index ? newValue : value))
      setIsChecked(newIsChecked)
      onChange(domain.filter((_, i) => newIsChecked[i]))
    }
  }

  return (
    <ul className={cx('tags')}>
      {domain.map((_, i) => (
        <ToggleButton
          key={label[i]}
          label={label[i]}
          value={isChecked[i]}
          onChange={createHandleChange(i)}
        />
      ))}
    </ul>
  )
}
