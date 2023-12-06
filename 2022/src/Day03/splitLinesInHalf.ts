import { eachLine } from '../utils'

export function splitInHalf(s: string): [string, string] {
  const a = s.slice(0, s.length / 2)
  const b = s.slice(s.length / 2)
  return [a, b]
}

export async function splitLinesInHalf() {
  const groups: string[][] = []
  await eachLine(`${__dirname}/input.txt`, (line) => {
    groups.push(splitInHalf(line))
  })
  return groups
}
