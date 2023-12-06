function charsOf(s: string): string[] {
  return s.split('')
}

export function common(...args: string[]) {
  const [first, ...rest] = args
  const commonItems = rest.reduce((commonItems, nextStr) => {
    const next = new Set(charsOf(nextStr))
    return commonItems.filter((x) => next.has(x))
  }, charsOf(first))

  return commonItems
}

export function oneCommon(...args: string[]) {
  return common(...args)[0]
}
