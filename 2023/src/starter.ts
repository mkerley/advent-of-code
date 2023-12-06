import { eachLine } from '../utils'

async function v1(file: string) {}

async function v2(file: string) {}

async function main() {
  const file =
    process.argv.filter((arg) => !arg.includes('ts-node'))[1] ?? 'input.txt'
  await v1(file)
  await v2(file)
}

main()
