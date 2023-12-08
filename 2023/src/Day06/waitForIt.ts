import { readLines } from '../utils'

async function v1(file: string) {
  const [times, distanceRecords] = (await readLines(file)).map((line) =>
    line
      .split(/: +/)[1]
      .split(/ +/)
      .map((n) => parseInt(n, 10))
  )

  return calcMarginOfError(times, distanceRecords)
}

function calcMarginOfError(times: number[], distanceRecords: number[]) {
  let marginOfError = 1
  for (let i = 0; i < times.length; i++) {
    const [time, distanceRecord] = [times[i], distanceRecords[i]]
    console.log(`${time}ms -> ${distanceRecord}mm`)

    let waysToWin = 0
    for (let wait = 0; wait < time; wait++) {
      const speed = wait
      const remainingTime = time - wait
      const distance = speed * remainingTime
      const win = distance > distanceRecord
      if (win) {
        waysToWin++
      }

      // const newRecord = win ? ' **' : ''
      // console.log(`  Wait ${wait}ms -> ${distance}mm${newRecord}`)
    }
    marginOfError *= waysToWin
  }

  return marginOfError
}

async function v2(file: string) {
  const [times, distanceRecords] = (await readLines(file)).map((line) => [
    parseInt(line.split(/: +/)[1].replaceAll(/ +/g, ''), 10),
  ])

  return calcMarginOfError(times, distanceRecords)
}

async function main() {
  const file =
    process.argv.filter((arg) => !arg.includes('ts-node'))[1] ?? 'input.txt'
  console.log('v1 Margin of error:', await v1(file))
  console.log('v2 Margin of error:', await v2(file))
}

main()
