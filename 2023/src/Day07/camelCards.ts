import _ from 'lodash'
import { eachLine, readLines } from '../utils'

export enum HandType {
  HIGH_CARD,
  ONE_PAIR,
  TWO_PAIR,
  THREE_OF_A_KIND,
  FULL_HOUSE,
  FOUR_OF_A_KIND,
  FIVE_OF_A_KIND,
}

interface Hand {
  cards: string
  bid: number
}

interface RankedHand extends Hand {
  rank: number
}

export function calcHandType(cards: string) {
  if (cards.length !== 5) {
    throw new Error('Hands must have exactly 5 cards')
  }

  const counts = calcCardCounts(cards)

  const sortedCounts = [...Object.values(counts)].sort().reverse()

  if (sortedCounts[0] === 5) return HandType.FIVE_OF_A_KIND
  if (sortedCounts[0] === 4) return HandType.FOUR_OF_A_KIND
  if (_.isEqual(sortedCounts, [3, 2])) return HandType.FULL_HOUSE
  if (sortedCounts[0] === 3) return HandType.THREE_OF_A_KIND
  if (_.isEqual(sortedCounts.slice(0, 2), [2, 2])) return HandType.TWO_PAIR
  if (sortedCounts[0] === 2) return HandType.ONE_PAIR

  return HandType.HIGH_CARD
}

function calcCardCounts(cards: string) {
  const counts: Record<string, number> = {}
  for (const card of cards) {
    counts[card] = counts[card] ? counts[card] + 1 : 1
  }
  return counts
}

export function calcHandTypeJokers(cards: string) {
  if (cards === 'JJJJJ') {
    // Special case
    return HandType.FIVE_OF_A_KIND
  }

  const counts = calcCardCounts(cards.replaceAll('J', ''))
  const mostCommonCard = _.sortBy(Object.entries(counts), '1').reverse()[0][0]

  const replaced = cards.replaceAll('J', mostCommonCard)
  return calcHandType(replaced)
}

export function cardStrength(cards: string, index: number) {
  return '23456789TJQKA'.indexOf(cards[index])
}

export function cardStrengthJokers(cards: string, index: number) {
  return 'J23456789TQKA'.indexOf(cards[index])
}

export function rankHands(hands: Hand[]): RankedHand[] {
  return _.sortBy(
    hands,
    (h) => calcHandType(h.cards),
    (h) => cardStrength(h.cards, 0),
    (h) => cardStrength(h.cards, 1),
    (h) => cardStrength(h.cards, 2),
    (h) => cardStrength(h.cards, 3),
    (h) => cardStrength(h.cards, 4)
  ).map((hand, idx) => ({ ...hand, rank: idx + 1 }))
}

export function rankHandsJokers(hands: Hand[]): RankedHand[] {
  console.log('rankHandsJokers: ', JSON.stringify(hands, null, 2))
  return _.sortBy(
    hands,
    (h) => calcHandTypeJokers(h.cards),
    (h) => cardStrengthJokers(h.cards, 0),
    (h) => cardStrengthJokers(h.cards, 1),
    (h) => cardStrengthJokers(h.cards, 2),
    (h) => cardStrengthJokers(h.cards, 3),
    (h) => cardStrengthJokers(h.cards, 4)
  ).map((hand, idx) => ({ ...hand, rank: idx + 1 }))
}

export async function v1(file: string) {
  const hands = (await readLines(file))
    .map((line) => line.split(' '))
    .map(([cards, bidStr]) => ({ cards, bid: parseInt(bidStr) }))

  return rankHands(hands)
    .map(({ rank, bid }) => rank * bid)
    .reduce((a, b) => a + b, 0)
}

export async function v2(file: string) {
  const hands = (await readLines(file))
    .map((line) => line.split(' '))
    .map(([cards, bidStr]) => ({ cards, bid: parseInt(bidStr) }))

  return rankHandsJokers(hands)
    .map(({ rank, bid }) => rank * bid)
    .reduce((a, b) => a + b, 0)
}

async function main() {
  const file =
    process.argv.filter((arg) => !arg.includes('ts-node'))[1] ?? 'input.txt'
  console.log('v1:', await v1(file))
  console.log('v2:', await v2(file))
}

main()
