import { readLines } from '../utils'

function oneContainsOther(a: number[], b: number[]): boolean {
  return (a[0] <= b[0] && a[1] >= b[1]) || (b[0] <= a[0] && b[1] >= a[1])
}

export function isOverlap(a: number[], b: number[]): boolean {
  return (
    oneContainsOther(a, b) ||
    (a[0] <= b[0] && a[1] >= b[0]) ||
    (a[0] <= b[1] && a[1] >= b[1])
  )
}

function parseLine(line: string) {
  return line
    .split(',')
    .map((r) => r.split('-'))
    .map((range) => range.map((s) => parseInt(s)))
}

async function main() {
  const input = await readLines(`${__dirname}/input.txt`)

  const ranges = input.map(parseLine)

  const containCount = ranges.filter((rangePair) =>
    oneContainsOther(rangePair[0], rangePair[1])
  ).length
  console.log('Count of redundant ranges: %o', containCount)

  const overlapCount = ranges.filter((rangePair) =>
    isOverlap(rangePair[0], rangePair[1])
  ).length
  console.log('Count of overlapping ranges: %o', overlapCount)
}
/*

0..............
0..............

01.............
.12............

.12............
01.............

...345.........
....4..........

 */

main()
