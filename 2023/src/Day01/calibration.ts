import { eachLine } from '../utils'

async function v1(file: string) {
  let total = 0

  await eachLine(file, (line) => {
    const digits = line.split('').filter((c) => c >= '0' && c <= '9')
    const firstDigit = digits[0]
    const lastDigit = digits[digits.length - 1]
    const num = parseInt(`${firstDigit}${lastDigit}`, 10)

    // console.log(`${line} -> ${num}`)

    total += num
  })

  console.log(`v1: ${total}`)
}

async function v2(file: string) {
  let total = 0
  let lineCount = 0

  await eachLine(file, (line) => {
    const firstDigit = findFirstDigit(line)
    const lastDigit = findLastDigit(line)
    const num = parseInt(`${firstDigit}${lastDigit}`, 10)

    console.log(`${line} -> ${num}`)

    total += num
    lineCount += 1
  })

  console.log(`v2: ${total} (${lineCount} lines)`)
}

function minIndex(...indices: number[]): number {
  return Math.min(...indices.filter((i) => i >= 0))
}

function findFirstDigit(str: string): number {
  // console.log(`findFirstDigit(${str})`)
  const strIndices = [
    minIndex(str.indexOf('0'), str.indexOf('zero')),
    minIndex(str.indexOf('1'), str.indexOf('one')),
    minIndex(str.indexOf('2'), str.indexOf('two')),
    minIndex(str.indexOf('3'), str.indexOf('three')),
    minIndex(str.indexOf('4'), str.indexOf('four')),
    minIndex(str.indexOf('5'), str.indexOf('five')),
    minIndex(str.indexOf('6'), str.indexOf('six')),
    minIndex(str.indexOf('7'), str.indexOf('seven')),
    minIndex(str.indexOf('8'), str.indexOf('eight')),
    minIndex(str.indexOf('9'), str.indexOf('nine')),
  ]

  // console.log(`  strIndices = ${strIndices}`)

  const lowestStrIndex = Math.min(...strIndices)
  // console.log(`  lowestStrIndex = ${lowestStrIndex}`)

  const lowestDigit = strIndices.indexOf(lowestStrIndex)
  // console.log(`  lowestDigit = ${lowestDigit}`)

  return lowestDigit
}

function findLastDigit(str: string): number {
  // console.log(`findLastDigit(${str})`)

  const strIndices = [
    Math.max(str.lastIndexOf('0'), str.lastIndexOf('zero')),
    Math.max(str.lastIndexOf('1'), str.lastIndexOf('one')),
    Math.max(str.lastIndexOf('2'), str.lastIndexOf('two')),
    Math.max(str.lastIndexOf('3'), str.lastIndexOf('three')),
    Math.max(str.lastIndexOf('4'), str.lastIndexOf('four')),
    Math.max(str.lastIndexOf('5'), str.lastIndexOf('five')),
    Math.max(str.lastIndexOf('6'), str.lastIndexOf('six')),
    Math.max(str.lastIndexOf('7'), str.lastIndexOf('seven')),
    Math.max(str.lastIndexOf('8'), str.lastIndexOf('eight')),
    Math.max(str.lastIndexOf('9'), str.lastIndexOf('nine')),
  ]

  // console.log(`  strIndices = ${strIndices}`)

  const lowestStrIndex = Math.max(...strIndices)
  return strIndices.indexOf(lowestStrIndex)
}

async function main() {
  const file =
    process.argv.filter((arg) => !arg.includes('ts-node'))[1] ?? 'input.txt'
  console.log(`argv: ${process.argv}`)
  console.log(`file: ${file}`)
  await v1(file)
  await v2(file)
}

main()
