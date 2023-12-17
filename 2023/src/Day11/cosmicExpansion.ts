import { readLines } from '../utils'

interface Coords {
  r: number
  c: number
}

async function v1(file: string) {
  const image = (await readLines(file)).map((l) => l.split(''))
  // console.log('image:')
  //image.forEach((row) => console.log(row.join('')))

  // console.log('expanded:')
  expand(image)
  //image.forEach((row) => console.log(row.join('')))

  const galaxyCoords = findGalaxyCoords(image)
  return addShortestPaths(galaxyCoords)
}

function addShortestPaths(galaxyCoords: Coords[]) {
  let total = 0
  for (let i = 0; i < galaxyCoords.length; i++) {
    for (let j = i + 1; j < galaxyCoords.length; j++) {
      const shortestPath =
        Math.abs(galaxyCoords[i].c - galaxyCoords[j].c) +
        Math.abs(galaxyCoords[i].r - galaxyCoords[j].r)
      total += shortestPath
    }
  }
  return total
}

function findGalaxyCoords(image: string[][]): Coords[] {
  const galaxyCoords: Coords[] = []
  for (let r = 0; r < image.length; r++) {
    for (let c = 0; c < image[0].length; c++) {
      if (image[r][c] === '#') {
        galaxyCoords.push({ r, c })
      }
    }
  }
  return galaxyCoords
}

function expand(image: string[][]) {
  for (let r = image.length - 1; r >= 0; r--) {
    const row = image[r]
    if (row.every((cell) => cell === '.')) {
      image.splice(r, 1, [...row], [...row])
    }
  }

  for (let c = image[0].length - 1; c >= 0; c--) {
    const col = image.map((row) => row[c])
    if (col.every((cell) => cell === '.')) {
      for (const row of image) {
        row.splice(c, 1, '.', '.')
      }
    }
  }
}

async function v2(file: string) {
  const image = (await readLines(file)).map((l) => l.split(''))
  // console.log('image:')
  // image.forEach((row) => console.log(row.join('')))

  const expansionFactor = 1000000
  const galaxyCoords = findGalaxyCoordsV2(image, expansionFactor)

  return addShortestPaths(galaxyCoords)
}

function findGalaxyCoordsV2(image: string[][], expansionFactor: number) {
  const emptyRows = image.map((row, r) => isRowEmpty(image, r))
  const emptyCols = image[0].map((cell, c) => isColEmpty(image, c))

  const galaxyCoords: Coords[] = []
  for (let r = 0; r < image.length; r++) {
    for (let c = 0; c < image[0].length; c++) {
      if (image[r][c] === '#') {
        const numEmptyRows = emptyRows.slice(0, r).filter((e) => e).length
        const numEmptyCols = emptyCols.slice(0, c).filter((e) => e).length
        galaxyCoords.push({
          r: r + (expansionFactor - 1) * numEmptyRows,
          c: c + (expansionFactor - 1) * numEmptyCols,
        })
      }
    }
  }
  return galaxyCoords
}

function isRowEmpty(image: string[][], row: number): boolean {
  for (let col = 0; col < image[row].length; col++) {
    if (image[row][col] !== '.') {
      return false
    }
  }
  return true
}

function isColEmpty(image: string[][], col: number): boolean {
  for (let row = 0; row < image.length; row++) {
    if (image[row][col] !== '.') {
      return false
    }
  }
  return true
}

async function main() {
  const file =
    process.argv.filter((arg) => !arg.includes('ts-node'))[1] ?? 'input.txt'
  console.log('v1:', await v1(file))
  console.log('v2:', await v2(file))
}

main()
