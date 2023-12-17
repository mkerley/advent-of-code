import { readLines } from '../utils'

async function v1(file: string) {
  const input = await readLines(file)
  return 0
}

async function v2(file: string) {
  const input = await readLines(file)
  return 0
}

async function main() {
  const file =
    process.argv.filter((arg) => !arg.includes('ts-node'))[1] ?? 'input.txt'
  console.log('v1:', await v1(file))
  console.log('v2:', await v2(file))
}

main()
