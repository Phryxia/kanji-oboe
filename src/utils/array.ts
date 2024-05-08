export function guardZeroLength<T>(input: T[], fallback: T[]) {
  if (input.length) {
    return input
  }
  return fallback.slice(0, 1)
}
