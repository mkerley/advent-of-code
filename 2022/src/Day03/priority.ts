export function priority(item: string) {
  const base = /[A-Z]/.test(item) ? 'A' : 'a'
  const value = item.charCodeAt(0) - base.charCodeAt(0) + 1
  return base == 'A' ? value + 26 : value
}
