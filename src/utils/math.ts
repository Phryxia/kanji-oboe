export function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle<T>(arr: T[]) {
  const out = arr.slice()
  for (let t = 0; t < 2 * out.length; ++t) {
    const i = randomInteger(0, out.length - 1)
    const j = randomInteger(0, out.length - 1)
    const temp = out[i]
    out[i] = out[j]
    out[j] = temp
  }
  return out
}

export function takeRandom<T>(list: T[]) {
  return list[randomInteger(0, list.length - 1)]
}
