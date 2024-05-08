import classnames from 'classnames/bind'
import styles from './ToggleButton.module.css'

const cx = classnames.bind(styles)

export interface Props {
  label: string
  value: boolean
  onChange(value: boolean): void
}

export function ToggleButton({ label, value, onChange }: Props) {
  return (
    <label className={cx('toggle-button', { checked: value })}>
      <input
        type="checkbox"
        value={value ? 'true' : 'false'}
        onChange={(e) => {
          onChange(e.target.value === 'false')
        }}
        defaultChecked={value}
      />
      {label}
    </label>
  )
}
