import { readLines } from '../utils'

async function part1_partNumbers(file: string) {
  const lines = await readLines(file)
  let total = 0

  for (let row = 0; row < lines.length; row++) {
    const line = lines[row]

    let numStr = ''
    let start = -1
    let end = -1
    const rowNums: number[] = []

    for (let col = 0; col < line.length; col++) {
      if (isDigit(line[col])) {
        if (start < 0) start = col
        end = col
        numStr += line[col]
      } else {
        if (col > 0 && end === col - 1) {
          // That was the end of a number - check for symbols and add
          if (isAdjacentToSymbol(numStr, row, start, end, lines)) {
            rowNums.push(parseInt(numStr))
          }
        }

        numStr = ''
        start = end = -1
      }
    }

    if (start > 0 && end > 0) {
      // line ended with a number
      if (isAdjacentToSymbol(numStr, row, start, end, lines)) {
        rowNums.push(parseInt(numStr))
      }
    }

    console.log(`${line} -> ${JSON.stringify(rowNums)}`)
    total += rowNums.reduce((a, b) => a + b, 0)
  }

  console.log(`Total of part numbers: ${total}`)
}

function isAdjacentToSymbol(
  numStr: string,
  row: number,
  start: number,
  end: number,
  lines: string[]
) {
  const rMin = Math.max(row - 1, 0)
  const rMax = Math.min(row + 2, lines.length)
  const cMin = Math.max(start - 1, 0)
  const cMax = Math.min(end + 2, lines[row].length)

  console.log(
    `isAdjacentToSymbol(${numStr}, ${row}, ${start}, ${end}): ${rMin} <= row < ${rMax}, ${cMin} <= col < ${cMax}`
  )

  for (let r = rMin; r < rMax; r++) {
    for (let c = cMin; c < cMax; c++) {
      if (isSymbol(lines[r][c])) {
        return true
      }
    }
  }

  return false
}

function isDigit(c: string) {
  return c.length === 1 && c >= '0' && c <= '9'
}

function isSymbol(c: string) {
  return c.length === 1 && c !== '.' && (c < '0' || c > '9')
}

function isGear(c: string) {
  return c === '*'
}

async function part2_gearRatios(file: string) {
  const lines = await readLines(file)
  const gearParts: Record<string, number[]> = {}

  for (let row = 0; row < lines.length; row++) {
    const line = lines[row]

    let numStr = ''
    let start = -1
    let end = -1

    for (let col = 0; col < line.length; col++) {
      if (isDigit(line[col])) {
        if (start < 0) start = col
        end = col
        numStr += line[col]
      } else {
        if (col > 0 && end === col - 1) {
          // That was the end of a number - check for symbols and add
          const partNumber = parseInt(numStr)
          const adjacentGears = findAdjacentGears(
            partNumber,
            row,
            start,
            end,
            lines
          )
          for (const gearPosition of adjacentGears) {
            gearParts[gearPosition] = [
              ...(gearParts[gearPosition] ?? []),
              partNumber,
            ]
          }
        }

        numStr = ''
        start = end = -1
      }
    }

    if (start > 0 && end > 0) {
      // line ended with a number
      const partNumber = parseInt(numStr)
      const adjacentGears = findAdjacentGears(
        partNumber,
        row,
        start,
        end,
        lines
      )
      for (const gearPosition of adjacentGears) {
        gearParts[gearPosition] = [
          ...(gearParts[gearPosition] ?? []),
          partNumber,
        ]
      }
    }
  }

  const gearRatioSum = Object.values(gearParts)
    .filter((partList) => partList.length === 2)
    .map((pair) => pair[0] * pair[1])
    .reduce((a, b) => a + b, 0)

  console.log(`Total of gear ratios: ${gearRatioSum}`)
}

function findAdjacentGears(
  _partNumber: number,
  row: number,
  start: number,
  end: number,
  lines: string[]
) {
  const rMin = Math.max(row - 1, 0)
  const rMax = Math.min(row + 2, lines.length)
  const cMin = Math.max(start - 1, 0)
  const cMax = Math.min(end + 2, lines[row].length)

  // console.log(
  //   `isAdjacentToGear(${partNumber}, ${row}, ${start}, ${end}): ${rMin} <= row < ${rMax}, ${cMin} <= col < ${cMax}`
  // )

  const adjacentGears: string[] = []

  for (let r = rMin; r < rMax; r++) {
    for (let c = cMin; c < cMax; c++) {
      if (isGear(lines[r][c])) {
        adjacentGears.push(gearPositionString(r, c))
      }
    }
  }

  return adjacentGears
}

function gearPositionString(row: number, col: number): string {
  return `${row},${col}`
}

async function main() {
  const file =
    process.argv.filter((arg) => !arg.includes('ts-node'))[1] ?? 'input.txt'
  await part1_partNumbers(file)

  console.time('part2')
  await part2_gearRatios(file)
  console.timeEnd('part2')
}

main()
