import { CrateStack, Move } from './types'

export function isNumLine(line: string) {
  return /^[0-9 ]+$/.test(line)
}

export function readStacks(
  lines: string[],
  numLineIndex: number
): CrateStack[] {
  const isNumChar = (s: string): boolean => /[0-9]+/.test(s)
  const isAlpha = (s: string): boolean => /[a-zA-Z]/.test(s)
  const spaces = / +/

  const numStacks = lines[numLineIndex].split(spaces).filter(isNumChar).length

  const stacks: CrateStack[] = [...Array(numStacks)].map(() => [])

  // Read crates and build stacks from the bottom up
  for (let i = numLineIndex - 1; i >= 0; i--) {
    const line = lines[i]

    for (let stack = 0; stack < numStacks; stack++) {
      const charIndex = 4 * stack + 1
      const c = line.charAt(charIndex)
      if (isAlpha(c)) {
        stacks[stack].push(c)
      }
    }
  }

  // console.log(stacks.map((s) => s.join(', ')))
  return stacks
}

export function readMoveLine(line: string): Move {
  const res = /move (\d+) from (\d+) to (\d+)/.exec(line)
  if (!res || res.length < 4) throw new Error('Parse error: ' + line)

  return {
    quantity: parseInt(res[1]),
    from: parseInt(res[2]) - 1,
    to: parseInt(res[3]) - 1,
  }
}
