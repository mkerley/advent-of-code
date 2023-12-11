import { readLines } from '../utils'

interface Vector2D {
  row: number
  col: number
}
type Position = Vector2D
type Direction = Vector2D

interface PosDir {
  pos: Position
  dir: Direction
}

interface PosDirWithNormal {
  pos: Position
  dir: Direction
  normal: Direction
}

async function v1(file: string) {
  const maze = (await readLines(file)).map((line) => line.split(''))
  const row = maze.findIndex((row) => row.includes('S'))
  const col = maze[row].indexOf('S')

  const pos: PosDir[] = findConnectedDirections(maze, { row, col }).map(
    (dir) => ({ pos: { row, col }, dir })
  )

  if (pos.length !== 2) {
    throw new Error(
      `Invalid maze; starting position connected to ${pos.length} pipes`
    )
  }

  let steps = 0
  // let prevPos = [...pos]

  do {
    console.log(`  pos: ${JSON.stringify(pos)}`)
    pos.forEach((p, i) => {
      pos[i] = move(maze, p)
    })
    steps++
  } while (
    pos[0].pos.row !== pos[1].pos.row ||
    pos[0].pos.col !== pos[1].pos.col
  )

  return steps
}

function findConnectedDirections(maze: string[][], pos: Position): Direction[] {
  /*
  | is a vertical pipe connecting north and south.
  - is a horizontal pipe connecting east and west.
  L is a 90-degree bend connecting north and east.
  J is a 90-degree bend connecting north and west.
  7 is a 90-degree bend connecting south and west.
  F is a 90-degree bend connecting south and east.
  */
  const connected: Direction[] = []
  const { row, col } = pos

  // Up
  if ('|7F'.includes(getPipe(maze, row - 1, col))) {
    connected.push({ row: -1, col: 0 })
  }

  // Right
  if ('-J7'.includes(getPipe(maze, row, col + 1))) {
    connected.push({ row: 0, col: 1 })
  }

  // Down
  if ('|LJ'.includes(getPipe(maze, row + 1, col))) {
    connected.push({ row: 1, col: 0 })
  }

  // Left
  if ('-LF'.includes(getPipe(maze, row, col - 1))) {
    connected.push({ row: 0, col: -1 })
  }

  return connected
}

function getPipe(maze: string[][], row: number, col: number): string {
  try {
    return maze[row][col] ?? '.'
  } catch (e) {
    return '.'
  }
}

function move(maze: string[][], posDir: PosDir): PosDir {
  const pos: Position = {
    row: posDir.pos.row + posDir.dir.row,
    col: posDir.pos.col + posDir.dir.col,
  }

  return { pos, dir: newDir(posDir.dir, maze[pos.row][pos.col]) }
}

function newDir(dir: Direction, pipeShape: string): Direction {
  /*
  | is a vertical pipe connecting north and south.
  - is a horizontal pipe connecting east and west.
  L is a 90-degree bend connecting north and east.
  J is a 90-degree bend connecting north and west.
  7 is a 90-degree bend connecting south and west.
  F is a 90-degree bend connecting south and east.
  */
  switch (pipeShape) {
    case '|':
    case '-':
      return dir
    case 'L':
    case '7':
      // (0,1) -> (1,0)
      // (-1,0) -> (0,-1)
      // (0,-1) -> (-1,0)
      // (1,0) -> (0,1)
      return { row: dir.col, col: dir.row }
    case 'J':
    case 'F':
      // (0,1) -> (-1,0)
      // (1,0) -> (0,-1)
      // (-1,0) -> (0,1)
      // (0,-1) -> (1,0)
      return { row: -dir.col, col: -dir.row }
  }

  throw new Error(
    `Invalid combination: pipeShape = ${pipeShape}; dir = ${JSON.stringify(
      dir
    )}`
  )
}

async function v2(file: string) {
  const maze = await readAndCleanMaze(file)
  logMaze(maze)

  const row = maze.findIndex((row) => row.includes('F'))
  const col = maze[row].indexOf('F')

  console.log(`Starting position: row ${row}, col ${col}`)
  let pos: PosDirWithNormal = {
    pos: { row, col },
    dir: { row: 0, col: 1 },
    normal: { row: 1, col: 0 },
  }

  do {
    const oldNormal = pos.normal
    pos = moveNormal(maze, pos)

    let [r, c] = [pos.pos.row + pos.normal.row, pos.pos.col + pos.normal.col]
    if (maze[r][c] === '.') {
      floodFill(maze, r, c)
      console.log(`Inside: ${r},${c}`)
    }

    ;[r, c] = [pos.pos.row + oldNormal.row, pos.pos.col + oldNormal.col]
    if (maze[r][c] === '.') {
      floodFill(maze, r, c)
      console.log(`Inside: ${r},${c}`)
    }
    //logMaze(maze, pos)
  } while (pos.pos.row !== row || pos.pos.col !== col)

  logMaze(maze)

  return maze
    .map((row) =>
      row.reduce((count, cell) => (cell === 'I' ? count + 1 : count), 0)
    )
    .reduce((a, b) => a + b, 0)
}

function floodFill(maze: string[][], row: number, col: number) {
  if (row < 0 || col < 0 || row >= maze.length || col >= maze[0].length) {
    return
  }
  if (maze[row][col] === '.') {
    maze[row][col] = 'I'
    floodFill(maze, row - 1, col)
    floodFill(maze, row, col + 1)
    floodFill(maze, row + 1, col)
    floodFill(maze, row, col - 1)
  }
}

function logMaze(maze: string[][], pos?: PosDir) {
  if (pos) {
    maze.forEach((row, rowIndex) => {
      if (rowIndex === pos.pos.row) {
        const sub = [
          ...row.slice(0, pos.pos.col),
          '*',
          ...row.slice(pos.pos.col + 1),
        ]
        console.log(sub.join(''))
      } else {
        console.log(row.join(''))
      }
    })
  } else {
    maze.forEach((row) => console.log(row.join('')))
  }
}

function moveNormal(
  maze: string[][],
  posDir: PosDirWithNormal
): PosDirWithNormal {
  const pos: Position = {
    row: posDir.pos.row + posDir.dir.row,
    col: posDir.pos.col + posDir.dir.col,
  }

  return {
    pos,
    dir: newDir(posDir.dir, maze[pos.row][pos.col]),
    normal: newNormal(posDir.normal, maze[pos.row][pos.col]),
  }
}

function newNormal(normal: Direction, pipeShape: string): Direction {
  /*
  | is a vertical pipe connecting north and south.
  - is a horizontal pipe connecting east and west.
  L is a 90-degree bend connecting north and east.
  J is a 90-degree bend connecting north and west.
  7 is a 90-degree bend connecting south and west.
  F is a 90-degree bend connecting south and east.
  */
  switch (pipeShape) {
    case '|':
    case '-':
      return normal
    case 'L':
    case '7':
      // (-1,  0) -> ( 0,  1)
      // ( 0,  1) -> (-1,  0)
      // ( 1,  0) -> ( 0, -1)
      // ( 0, -1) -> ( 1,  0)
      return { row: -normal.col, col: -normal.row }
    case 'J':
    case 'F':
      // (-1,  0) -> ( 0, -1)
      // ( 0,  1) -> ( 1,  0)
      // ( 1,  0) -> ( 0,  1)
      // ( 0, -1) -> (-1,  0)
      return { row: normal.col, col: normal.row }
  }

  throw new Error(
    `Invalid combination: pipeShape = ${pipeShape}; dir = ${JSON.stringify(
      normal
    )}`
  )
}

async function readAndCleanMaze(file: string) {
  const maze = (await readLines(file)).map((row) => ('.' + row + '.').split(''))
  maze.unshift(maze[0].map(() => '.'))
  maze.push(maze[0].map(() => '.'))

  const row = maze.findIndex((row) => row.includes('S'))
  const col = maze[row].indexOf('S')

  const dirs = findConnectedDirections(maze, { row, col })
  // TODO: Replace starting pos with valid pipe shape
  let replacement: string | undefined
  if (dirs[0].col === -1) {
    if (dirs[1].row === 1) {
      replacement = 'L'
    } else if (dirs[1].row === -1) {
      replacement = 'J'
    } else {
      replacement = '|'
    }
  } else if (dirs[0].col === 1) {
    if (dirs[1].col === -1) {
      replacement = '-'
    } else {
      replacement = 'F'
    }
  } else {
    replacement = '7'
  }
  console.log(
    `findConnectedDirections: dirs = ${JSON.stringify(
      dirs
    )}; replacement = ${replacement}`
  )
  maze[row][col] = replacement

  let pos: PosDir = dirs.map((dir) => ({ pos: { row, col }, dir }))[0]

  const cleanMaze = [...maze].map((row) => row.map(() => '.'))
  do {
    pos = move(maze, pos)
    cleanMaze[pos.pos.row][pos.pos.col] = maze[pos.pos.row][pos.pos.col]
  } while (pos.pos.row !== row || pos.pos.col !== col)

  return cleanMaze
}

async function main() {
  const file =
    process.argv.filter((arg) => !arg.includes('ts-node'))[1] ?? 'input.txt'
  console.log('v1:', await v1(file))
  console.log('v2:', await v2(file))
}

main()
