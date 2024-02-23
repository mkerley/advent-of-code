import { eachLine } from '../utils'

type Game = { id: number; sets: GameSet[] }
type GameSet = Record<string, number>

async function part1(file: string) {
  // console.log(`part1(${file})`)

  let sumOfPossibleIds = 0
  await eachLine(file, async (line) => {
    const game = parseGame(line)
    // const possible = isPossible(game)

    // console.log(
    //   `${JSON.stringify(game)} -> ${possible ? 'POSSIBLE' : 'IMPOSSIBLE'}`
    // )
    if (isPossible(game)) {
      sumOfPossibleIds += game.id
    }
  })

  return sumOfPossibleIds
}

function parseGame(line: string): Game {
  // console.log(`  parseGame('${line}')`)
  // Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
  const id = parseInt(line.split(':')[0].split(' ')[1])
  // console.log(`id: ${id}`)

  const sets = line.split(': ')[1].split(';').map(parseSet)
  // console.log(`    sets: ${sets.map((s) => JSON.stringify(s))}`)

  return { id, sets }
}

function parseSet(set: string) {
  const cubeStrs = set.split(',').map((c) => c.trim())
  // console.log(`      cubeStrs: ${cubeStrs}`)

  const cubeCounts: GameSet = { red: 0, green: 0, blue: 0 }
  for (const s of cubeStrs) {
    // console.log(`        s = ${s}`)
    const [num, color] = s.split(' ')
    cubeCounts[color] = parseInt(num)
  }

  return cubeCounts
}

function isPossible(game: Game) {
  // Determine which games would have been possible if the bag had been loaded with only
  // 12 red cubes, 13 green cubes, and 14 blue cubes.
  for (const set of game.sets) {
    if (set.red > 12 || set.green > 13 || set.blue > 14) {
      return false
    }
  }

  return true
}

async function part2(file: string) {
  // console.log(`part2(${file})`)

  let sumOfPowers = 0
  await eachLine(file, async (line) => {
    const game = parseGame(line)
    const mins = minPossible(game)
    const power = mins.red * mins.green * mins.blue

    //console.log(JSON.stringify(game))
    //console.log(`  ${JSON.stringify(mins)} -> ${power}`)
    sumOfPowers += power
  })

  return sumOfPowers
}

function minPossible(game: Game) {
  // in each game you played, what is the fewest number of cubes of each color that could have been in the bag to make the game possible?
  const mins: GameSet = { red: 0, green: 0, blue: 0 }

  for (const set of game.sets) {
    mins.red = Math.max(mins.red, set.red)
    mins.green = Math.max(mins.green, set.green)
    mins.blue = Math.max(mins.blue, set.blue)
  }

  return mins
}

async function main() {
  const file =
    process.argv.filter((arg) => !arg.includes('ts-node'))[1] ?? 'input.txt'
  console.log('part1:', await part1(file))
  console.log('part2:', await part2(file))
}

main()
