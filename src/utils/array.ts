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

export function getSubArrayWithPage<T>(list: T[], pageSize: number, pageIndex: number) {
  return list.slice(pageSize * pageIndex, pageSize * (pageIndex + 1))
}

export function swapAndRemove<T>(list: T[], index: number) {
  if (!list.length) return undefined

  const old = list[index]
  const top = list.pop()!
  list[index] = top
  return old
}
