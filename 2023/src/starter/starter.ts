import { readLines } from '../utils'

async function part1(file: string) {
  const input = await readLines(file)
  console.log(input)
  return 0
}

async function part2(file: string) {
  const input = await readLines(file)
  console.log(input)
  return 0
}

async function main() {
  const file =
    process.argv.filter((arg) => !arg.includes('ts-node'))[1] ?? 'input.txt'
  console.log('part1:', await part1(file))
  console.log('part2:', await part2(file))
}

main()
