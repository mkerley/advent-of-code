import { readLines } from '../utils'

async function part1_calculateTotalPoints(file: string) {
  return (await readLines(file))
    .map(calculateMatchCount)
    .map(calculatePoints)
    .reduce((a, b) => a + b, 0)
}

function calculatePoints(matches: number) {
  const points = matches === 0 ? 0 : Math.pow(2, matches - 1)

  console.log(`  ${matches} matches -> ${points} points`)
  return points
}

function calculateMatchCount(card: string) {
  // Example card:
  // Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
  const [winning, have] = card
    .split(':')[1]
    .split('|')
    .map((s) => s.trim())
    .map((str) => new Set(str.split(/ +/).map((s) => parseInt(s, 10))))

  const matches = union(have, winning).size
  console.log(`${card} -> ${matches} matches`)
  return matches
}

function union<T>(a: Set<T>, b: Set<T>): Set<T> {
  const u = new Set<T>()

  for (const item of a) {
    if (b.has(item)) {
      u.add(item)
    }
  }

  return u
}

async function part2_calculateTotalScratchers(file: string) {
  const matchCounts = (await readLines(file)).map(calculateMatchCount)

  const copies = matchCounts.map(() => 1)
  for (let i = 0; i < matchCounts.length; i++) {
    const matchCount = matchCounts[i]
    for (let j = 0; j < matchCount; j++) {
      copies[i + j + 1] += copies[i]
    }

    console.log(
      'Card %d: %o copies, %o matches',
      i + 1,
      copies[i],
      matchCounts[i]
    )
  }

  return copies.reduce((a, b) => a + b, 0)
}

async function main() {
  const file =
    process.argv.filter((arg) => !arg.includes('ts-node'))[1] ?? 'input.txt'
  console.log('Total scratcher value:', await part1_calculateTotalPoints(file))
  console.log(
    'Total scratcher count:',
    await part2_calculateTotalScratchers(file)
  )
}

main()
