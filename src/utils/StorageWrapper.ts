export class StorageWrapper<T> {
  private listeners: (() => void)[] = []
  private globalHandler: (this: Window, event: StorageEvent) => void

  constructor(
    private storage: Storage,
    private key: string,
    private parse: (s: string) => T,
    private stringify: (v: T) => string,
  ) {
    const self = this
    this.globalHandler = function (this: Window, e: StorageEvent) {
      if (e.storageArea !== storage) return

      self.invoke()
    }
    addEventListener('storage', this.globalHandler)
  }

  addListener(listener: () => void) {
    this.listeners.push(listener)
  }

  removeListener(listener: () => void) {
    const index = this.listeners.findIndex((l) => l === listener)

    if (index === -1) return

    this.listeners[index] = this.listeners[this.listeners.length - 1]
    this.listeners.pop()
  }

  getItem() {
    const s = this.storage.getItem(this.key)

    if (s == null) return undefined

    return this.parse(s)
  }

  setItem(value: T) {
    this.storage.setItem(this.key, this.stringify(value))
    this.invoke()
  }

  private invoke() {
    this.listeners.forEach((h) => h())
  }

  destroy() {
    removeEventListener('storage', this.globalHandler)
  }
}
