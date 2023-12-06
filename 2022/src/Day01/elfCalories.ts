import { eachLine } from 'utils'

async function main() {
  const elves: number[] = []
  let elfSum = 0
  await eachLine('input.txt', (line, last) => {
    if (line) {
      const calories = parseInt(line)
      elfSum += calories
    }

    if (last || !line) {
      elves.push(elfSum)
      elfSum = 0
    }
  })

  elves.sort((a, b) => a - b)
  console.log('Top elf:', elves.slice(-1)[0])
  console.log(
    'Top 3 elves combined:',
    elves.slice(-3).reduce((total, current) => total + current, 0)
  )
}

main()
