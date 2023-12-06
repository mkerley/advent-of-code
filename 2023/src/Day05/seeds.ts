import { readLines } from '../utils'

interface SeedMapEntry {
  destinationStart: number
  sourceStart: number
  rangeLength: number
  delta: number
}

interface SeedMap {
  name: string
  entries: SeedMapEntry[]
}

interface SeedRange {
  start: number
  length: number
}

async function v1(file: string): Promise<number> {
  const [seedsLine, ...lines] = await readLines(file)

  const seeds = parseSeedsLine(seedsLine)
  console.log(`seeds = ${seeds}`)

  const maps = parseSeedMaps(lines)
  // console.log(`maps = ${JSON.stringify(maps, null, 2)}`)

  const locations = seeds.map((seed) => applyMaps(seed, maps))
  return Math.min(...locations)
}

function parseSeedsLine(line: string): number[] {
  return line
    .split(' ')
    .slice(1)
    .map((n) => parseInt(n))
}

function parseSeedMaps(lines: string[]): SeedMap[] {
  const maps: SeedMap[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.endsWith('map:')) {
      maps.push({ name: line.split(' ')[0], entries: [] })
    } else if (line.match(/\d/)) {
      maps[maps.length - 1].entries.push(parseSeedMapEntry(line))
    }
  }

  return maps
}

function parseSeedMapEntry(line: string): SeedMapEntry {
  const [destinationStart, sourceStart, rangeLength] = line
    .split(' ')
    .map((n) => parseInt(n, 10))
  return {
    destinationStart,
    sourceStart,
    rangeLength,
    delta: destinationStart - sourceStart,
  }
}

function applyMaps(seed: number, maps: SeedMap[]): number {
  return maps.reduce(applyMap, seed)
}

function applyMap(origSeed: number, seedMap: SeedMap): number {
  let mapped = origSeed

  for (const entry of seedMap.entries) {
    if (
      origSeed >= entry.sourceStart &&
      origSeed < entry.sourceStart + entry.rangeLength
    ) {
      mapped = origSeed + entry.delta
    }
  }

  return mapped
}

async function v2(file: string): Promise<number> {
  const [seedsLine, ...lines] = await readLines(file)

  const seedRanges = parseSeedRangesLine(seedsLine)
  console.log(`seedRanges = ${JSON.stringify(seedRanges, null, 2)}`)

  const numSeeds = seedRanges.map((r) => r.length).reduce((a, b) => a + b, 0)
  console.log(`Number of seeds: ${numSeeds}`)
  const onePercent = Math.floor(numSeeds / 100)

  const maps = parseSeedMaps(lines)
  // console.log(`maps = ${JSON.stringify(maps, null, 2)}`)

  let minLocation = Number.MAX_SAFE_INTEGER
  let seedsChecked = 0
  for (const { start, length } of seedRanges) {
    for (let seed = start; seed < start + length; seed++) {
      const location = applyMaps(seed, maps)
      if (location < minLocation) {
        minLocation = location
      }

      seedsChecked++
      if (onePercent > 10 && seedsChecked % onePercent === 0) {
        console.log(seedsChecked / onePercent, '%')
      }
    }
  }

  return minLocation
}

function parseSeedRangesLine(line: string): SeedRange[] {
  const nums = line
    .split(' ')
    .slice(1)
    .map((n) => parseInt(n))

  const ranges: SeedRange[] = []
  for (let i = 0; i < nums.length; i += 2) {
    ranges.push({ start: nums[i], length: nums[i + 1] })
  }

  return ranges
}

async function main() {
  const file =
    process.argv.filter((arg) => !arg.includes('ts-node'))[1] ?? 'input.txt'
  console.log('Min location v1:', await v1(file))
  console.log('Min location v2:', await v2(file))
}

main()
