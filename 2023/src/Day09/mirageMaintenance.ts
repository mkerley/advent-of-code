import { readLines } from '../utils'

async function v1(file: string) {
  const histories = (await readLines(file)).map((line) =>
    line.split(' ').map((s) => parseInt(s))
  )
  let total = 0
  for (const history of histories) {
    const next = findNext(history)
    console.log(`${history.join(' ')} -> ${next}`)

    total += next
  }

  return total
}

function findNext(nums: number[]): number {
  if (nums.every((n) => n === 0)) {
    return 0
  }

  const offsets = nums
    .slice(0, nums.length - 1)
    .map((n, i) => nums[i + 1] - nums[i])
  const nextOffset = findNext(offsets)
  const next = nums[nums.length - 1] + nextOffset

  return next
}

async function v2(file: string) {
  const histories = (await readLines(file)).map((line) =>
    line.split(' ').map((s) => parseInt(s))
  )
  let total = 0
  for (const history of histories) {
    const prev = findPrev(history)
    console.log(`${prev} <- ${history.join(' ')}`)

    total += prev
  }

  return total
}

function findPrev(nums: number[]): number {
  if (nums.every((n) => n === 0)) {
    return 0
  }

  const offsets = nums
    .slice(0, nums.length - 1)
    .map((n, i) => nums[i + 1] - nums[i])
  const prevOffset = findPrev(offsets)
  const prev = nums[0] - prevOffset

  return prev
}

async function main() {
  const file =
    process.argv.filter((arg) => !arg.includes('ts-node'))[1] ?? 'input.txt'
  console.log('v1:', await v1(file))
  console.log('v2:', await v2(file))
}

main()
