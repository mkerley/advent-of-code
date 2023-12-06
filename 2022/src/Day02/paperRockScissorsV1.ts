import { eachLine } from '../utils'
import { outcomes } from './outcomes'

async function main() {
  let total = 0
  await eachLine(`${__dirname}/input.txt`, (line) => {
    const [opponent, player] = line.split(' ')
    const score = outcomes[opponent][player]
    console.log('%s vs %s -> %d', opponent, player, score)
    total += score
  })
  console.log('Total score: %d', total)
}

main()
