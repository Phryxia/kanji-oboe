export function guardZeroLength<T>(input: T[], fallback: T[]) {
  if (input.length) {
    return input
  }
  return fallback.slice(0, 1)
}

export function getLengthFoced<T>(list: T[], length: number) {
  const res = list.slice()
  res.length = length
  return res
}
