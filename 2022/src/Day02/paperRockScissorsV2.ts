import { eachLine } from '../utils'
import { DesiredOutcome, Opponent, Player } from './enums'
import { outcomes } from './outcomes'

function playerFor(opponent: string, desiredOutcome: string): Player {
  switch (opponent) {
    case Opponent.rock:
      switch (desiredOutcome) {
        case DesiredOutcome.lose:
          return Player.scissors
        case DesiredOutcome.draw:
          return Player.rock
        case DesiredOutcome.win:
          return Player.paper
      }
      break
    case Opponent.paper:
      switch (desiredOutcome) {
        case DesiredOutcome.lose:
          return Player.rock
        case DesiredOutcome.draw:
          return Player.paper
        case DesiredOutcome.win:
          return Player.scissors
      }
      break
    case Opponent.scissors:
      switch (desiredOutcome) {
        case DesiredOutcome.lose:
          return Player.paper
        case DesiredOutcome.draw:
          return Player.scissors
        case DesiredOutcome.win:
          return Player.rock
      }
      break
  }
}

async function main() {
  let total = 0
  await eachLine(`${__dirname}/input.txt`, (line) => {
    const [opponent, desiredOutcome] = line.split(' ')
    const player = playerFor(opponent, desiredOutcome)
    const score = outcomes[opponent][player]
    console.log(
      '%s vs %s -> %d (desired outcome: %s)',
      opponent,
      player,
      score,
      desiredOutcome
    )
    total += score
  })
  console.log('Total score: %d', total)
}

main()
