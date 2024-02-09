import { eachLine } from '../utils'

const digitWords = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
]

async function part1(file: string) {
  let total = 0

  await eachLine(file, (line) => {
    const firstDigit = findFirstDigit(line)
    const lastDigit = findLastDigit(line)
    const num = parseInt(`${firstDigit}${lastDigit}`, 10)

    total += num
  })

  console.log(`part1: ${total}`)
}

function findFirstDigit(str: string): number {
  const re = /[0-9]/
  return parseInt(str.match(re)![0])
}

function findLastDigit(str: string): number {
  const re = /.*([0-9])/
  return parseInt(str.match(re)![1])
}

async function part2(file: string) {
  let total = 0

  await eachLine(file, (line) => {
    const firstDigit = findFirstDigitOrWord(line)
    const lastDigit = findLastDigitOrWord(line)
    const num = parseInt(`${firstDigit}${lastDigit}`, 10)

    total += num
  })

  console.log(`part2: ${total}`)
}

function findFirstDigitOrWord(str: string): number {
  // [0-9]|zero|one|two|...
  const pattern = ['[0-9]', ...digitWords].join('|')
  const re = new RegExp(pattern)
  return parseDigit(str.match(re)![0])
}

function findLastDigitOrWord(str: string): number {
  // .*([0-9]|zero|one|two|...)
  const pattern = '.*(' + ['[0-9]', ...digitWords].join('|') + ')'
  const re = new RegExp(pattern)
  return parseDigit(str.match(re)![1])
}

function parseDigit(digit: string) {
  const num = parseInt(digit)
  if (isNaN(num)) {
    return digitWords.indexOf(digit)
  }
  return num
}

async function main() {
  const file =
    process.argv.filter((arg) => !arg.includes('node'))[1] ?? 'input.txt'
  await part1(file)
  await part2(file)
}

main()
