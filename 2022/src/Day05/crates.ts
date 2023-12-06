import { readLines } from '../utils'
import { CrateStack, Move } from './types'
import { isNumLine, readMoveLine, readStacks } from './parsing'

function topsOf(stacks: CrateStack[]) {
  return stacks.map((s) => s[s.length - 1]).join('')
}

function moveOneAtATime(moves: Move[], stacks: CrateStack[]) {
  for (const move of moves) {
    for (let i = 0; i < move.quantity; i++) {
      const crate = stacks[move.from].pop()
      if (!crate) {
        throw new Error(`No crates left in ${move.from}`)
      }
      stacks[move.to].push(crate)
    }
  }
}

function moveInBulk(moves: Move[], stacks2: CrateStack[]) {
  for (const move of moves) {
    const temp: CrateStack = []
    for (let i = 0; i < move.quantity; i++) {
      const crate = stacks2[move.from].pop()
      if (!crate) {
        throw new Error(`No crates left in ${move.from}`)
      }
      temp.push(crate)
    }
    while (temp.length) {
      const crate = temp.pop()
      if (!crate) {
        throw new Error('No crates left in temp')
      }
      stacks2[move.to].push(crate)
    }
  }
}

async function main() {
  const lines = await readLines(`${__dirname}/input.txt`)

  const numLineIndex = lines.findIndex(isNumLine)

  const moves = lines
    .filter((line) => line.startsWith('move'))
    .map(readMoveLine)

  const stacks = readStacks(lines, numLineIndex)
  moveOneAtATime(moves, stacks)
  console.log('Tops of stacks (moving one at a time): %s', topsOf(stacks))

  const stacks2 = readStacks(lines, numLineIndex)
  moveInBulk(moves, stacks2)
  console.log('Tops of stacks (moving in bulk): %s', topsOf(stacks2))
}

main()
