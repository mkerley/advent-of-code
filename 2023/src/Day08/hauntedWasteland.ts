import { readLines } from '../utils'

interface Paths {
  left: string
  right: string
}

type Direction = keyof Paths
const instMap: Record<string, Direction> = { L: 'left', R: 'right' }

async function v1(file: string) {
  const [instLine, ...nodeDescriptions] = (await readLines(file)).filter(
    (line) => line !== ''
  )

  const instructions = instLine.split('').map((i) => instMap[i])

  const nodes: Record<string, Paths> = {}

  for (const desc of nodeDescriptions) {
    const [label, left, right] = desc
      .match(/(\w+) = \((\w+), (\w+)\)/)!
      .slice(1)

    nodes[label] = { left, right }
  }

  let steps = 0
  let node = 'AAA'
  while (node !== 'ZZZ') {
    const step = instructions[steps % instructions.length]
    node = nodes[node][step]
    steps++
  }

  return steps
}

async function v2(file: string) {
  const [instLine, ...nodeDescriptions] = (await readLines(file)).filter(
    (line) => line !== ''
  )

  const instructions = instLine.split('').map((i) => instMap[i])

  const nodes: Record<string, Paths> = {}

  for (const desc of nodeDescriptions) {
    // console.log('desc =', desc)
    const [label, left, right] = desc
      .match(/(\w+) = \((\w+), (\w+)\)/)!
      .slice(1)

    nodes[label] = { left, right }
  }

  console.log(
    'Starting nodes:',
    Object.keys(nodes).filter((n) => n.endsWith('A'))
  )
  console.log(
    'Ending nodes:  ',
    Object.keys(nodes).filter((n) => n.endsWith('Z'))
  )

  let steps = 0
  const curr = Object.keys(nodes).filter((n) => n.endsWith('A'))
  const requiredEndCount = curr.length

  const winningSteps: number[][] = curr.map(() => [])

  console.log(`curr = ${curr}`)
  let endCount = 0
  // let maxEndCount = 0
  while (
    endCount < requiredEndCount &&
    winningSteps.find((s) => s.length < 10)
  ) {
    const step = instructions[steps % instructions.length]
    endCount = 0
    for (let i = 0; i < curr.length; i++) {
      curr[i] = nodes[curr[i]][step]
      if (curr[i].endsWith('Z')) {
        endCount++
        winningSteps[i].push(steps + 1)
      }
    }
    steps++

    // if (endCount > maxEndCount) {
    //   console.log(
    //     `curr = ${curr} (${endCount} ending nodes; next step: ${
    //       instructions[steps % instructions.length]
    //     }; ${steps} steps; next step index: ${steps % instructions.length})`
    //   )
    //   maxEndCount = endCount
    // }
  }

  const increments = findIncrements(winningSteps)

  //return increments.reduce((a, b) => a * b, 1)
  // let mult = increments[0]
  // while (mult > 0) {
  //   if (increments.every((i) => i % mult === 0)) {
  //     return mult
  //   }
  //   mult += increments[0]
  // }

  // throw new Error('no common multiple found')

  const factors: number[] = []
  let fact: number = 1
  while ((fact = anyFactor(increments)) > 1) {
    factors.push(fact)
    for (let i = 0; i < increments.length; i++) {
      if (increments[i] % fact === 0) {
        increments[i] /= fact
      }
    }
  }
  console.log('factors =', JSON.stringify(factors, null, 2))

  return factors.reduce((a, b) => a * b, 1)
}

function findIncrements(winningSteps: number[][]) {
  const increments = winningSteps.map(() => 0)
  winningSteps.forEach((s, idx) => {
    console.log(`Ghost ${idx}:`)

    let prevStep = 0
    for (const step of s) {
      if (increments[idx] === 0) {
        increments[idx] = step - prevStep
        console.log(`  Increment: ${increments[idx]}`)
      } else if (increments[idx] !== step - prevStep) {
        throw new Error(
          `  SHIT!! Increment is ${
            step - prevStep
          } but previous increment was ${increments[idx]}`
        )
      }
      prevStep = step
    }
  })

  return increments
}

function anyFactor(nums: number[]): number {
  console.log(`anyFactor(${nums})`)
  for (const num of nums) {
    if (num <= 1) continue

    console.log(`  num: ${num}`)
    for (let fact = 2; fact <= Math.sqrt(num); fact++) {
      if (num % fact === 0) {
        console.log(`    fact: ${fact} (${num} / ${fact} = ${num / fact})`)
        return fact
      }
    }
  }

  if (nums.every((n) => n === nums[0])) {
    return nums[0]
  }
  return 1
}

async function main() {
  const file =
    process.argv.filter((arg) => !arg.includes('ts-node'))[1] ?? 'input.txt'
  console.log('v1:', await v1(file))
  console.log('v2:', await v2(file))
}

main()
