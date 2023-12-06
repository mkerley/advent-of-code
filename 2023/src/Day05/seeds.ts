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
  // console.log(`seeds = ${seeds}`)

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

  let seedRanges = consolidateSeedRanges(parseSeedRangesLine(seedsLine))
  logSeedRanges(seedRanges)

  const numSeeds = countSeeds(seedRanges)
  // console.log(`Number of seeds: ${numSeeds}`)

  const maps = parseSeedMaps(lines)
  // console.log(`maps = ${JSON.stringify(maps, null, 2)}`)

  for (const seedMap of maps) {
    seedRanges = consolidateSeedRanges(applyMapToRanges(seedRanges, seedMap))

    console.log(`After ${seedMap.name}:`)
    logSeedRanges(seedRanges)

    // Safety check
    const newNumSeeds = countSeeds(seedRanges)
    if (newNumSeeds !== numSeeds) {
      throw new Error(
        `Seed count changed in ${seedMap.name}; ${numSeeds} -> ${newNumSeeds}`
      )
    }
  }

  return seedRanges[0].start
}

function logSeedRanges(seedRanges: SeedRange[]) {
  console.log(
    `seedRanges = ${JSON.stringify(
      seedRanges.map((r) => `${r.start} - ${r.start + r.length - 1}`),
      null,
      2
    )}`
  )
}

function applyMapToRanges(
  seedRanges: SeedRange[],
  seedMap: SeedMap
): SeedRange[] {
  const ranges = [...seedRanges]
  const newRanges: SeedRange[] = []

  let range: SeedRange | undefined
  let prevRange: SeedRange | undefined
  while ((range = ranges.pop())) {
    // console.log(
    //   `applyMapToRanges: ${seedMap.name} evaluating ${JSON.stringify(range)}`
    // )
    if (range.start === prevRange?.start && range.length === prevRange.length) {
      throw new Error(`${seedMap.name} stuck on ${JSON.stringify(range)}`)
    }
    prevRange = range
    const rangeFragments = splitRange(range, seedMap)

    if (rangeFragments.length === 1) {
      // No split at all; this one is done
      // console.log(`  newRanges.push(${JSON.stringify(rangeFragments[0])})`)
      newRanges.push(rangeFragments[0])
    } else {
      // This one got split up; evaluate each fragment in the next pass
      // console.log(`  ranges.push(...${JSON.stringify(rangeFragments)})`)
      ranges.push(...rangeFragments)
    }
  }

  return newRanges
}

function splitRange(range: SeedRange, seedMap: SeedMap): SeedRange[] {
  for (const entry of seedMap.entries) {
    if (range.length <= 0) {
      return []
    }

    if (contains(entry, range)) {
      // console.log(
      //   `  ${JSON.stringify(entry)} contains ${JSON.stringify(range)}`
      // )
      return [
        {
          start: range.start + entry.delta,
          length: range.length,
        },
      ]
    }

    if (splits(entry, range)) {
      // console.log(`  ${JSON.stringify(entry)} splits ${JSON.stringify(range)}`)
      return [
        {
          start: range.start,
          length: entry.sourceStart - range.start,
        },
        {
          start: entry.sourceStart,
          length: entry.rangeLength,
        },
        {
          start: entry.sourceStart + entry.rangeLength,
          length:
            range.start +
            range.length -
            (entry.sourceStart + entry.rangeLength),
        },
      ]
    }

    if (containsEnd(entry, range)) {
      // console.log(
      //   `  ${JSON.stringify(entry)} contains end of ${JSON.stringify(range)}`
      // )
      return [
        {
          start: range.start,
          length: entry.sourceStart - range.start,
        },
        {
          start: entry.sourceStart,
          length: range.start + range.length - entry.sourceStart,
        },
      ]
    }

    if (containsStart(entry, range)) {
      // console.log(
      //   `  ${JSON.stringify(entry)} contains start of ${JSON.stringify(range)}`
      // )
      return [
        {
          start: range.start,
          length: entry.sourceStart + entry.rangeLength - range.start,
        },
        {
          start: entry.sourceStart + entry.rangeLength,
          length:
            range.start +
            range.length -
            (entry.sourceStart + entry.rangeLength),
        },
      ]
    }
  }

  return [range]
}

function contains(entry: SeedMapEntry, range: SeedRange): boolean {
  return (
    entry.sourceStart <= range.start &&
    range.start + range.length <= entry.sourceStart + entry.rangeLength
  )
}

function containsStart(entry: SeedMapEntry, range: SeedRange): boolean {
  return (
    entry.sourceStart <= range.start &&
    range.start < entry.sourceStart + entry.rangeLength
  )
}

function containsEnd(entry: SeedMapEntry, range: SeedRange): boolean {
  return (
    entry.sourceStart < range.start + range.length &&
    range.start + range.length < entry.sourceStart + entry.rangeLength
  )
}

function splits(entry: SeedMapEntry, range: SeedRange): boolean {
  return (
    // ( range  [entry]  )
    range.start < entry.sourceStart &&
    entry.sourceStart + entry.rangeLength <= range.start + range.length
  )
}

function consolidateSeedRanges(seedRanges: SeedRange[]): SeedRange[] {
  const sorted = [...seedRanges].sort((a, b) => a.start - b.start)
  for (let i = sorted.length - 1; i > 0; i--) {
    if (sorted[i - 1].start + sorted[i - 1].length === sorted[i].start) {
      // We can combine these
      sorted.splice(i - 1, 2, {
        start: sorted[i - 1].start,
        length: sorted[i - 1].length + sorted[i].length,
      })
    }
  }

  return sorted
}

function countSeeds(seedRanges: SeedRange[]) {
  return seedRanges.map((r) => r.length).reduce((a, b) => a + b, 0)
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
