export function onSatisfied<T>(
  criteria: boolean | ((value: T) => boolean),
  fn: (value: T) => T,
) {
  return (value: T) =>
    criteria === true || (typeof criteria === 'function' && criteria(value))
      ? fn(value)
      : value
}
