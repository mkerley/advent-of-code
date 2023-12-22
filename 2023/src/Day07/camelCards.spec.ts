import { expect, describe, test } from 'vitest'
import {
  HandType,
  calcHandType,
  calcHandTypeJokers,
  rankHands,
  rankHandsJokers,
  v1,
  v2,
} from './camelCards'

// Five of a kind, where all five cards have the same label: AAAAA
// Four of a kind, where four cards have the same label and one card has a different label: AA8AA
// Full house, where three cards have the same label, and the remaining two cards share a different label: 23332
// Three of a kind, where three cards have the same label, and the remaining two cards are each different from any other card in the hand: TTT98
// Two pair, where two cards share one label, two other cards share a second label, and the remaining card has a third label: 23432
// One pair, where two cards share one label, and the other three cards have a different label from the pair and each other: A23A4
// High card, where all cards' labels are distinct: 23456

describe('v1: J = Jack', () => {
  test('calcHandType should calculate correct hand types', () => {
    expect(calcHandType('AAAAA')).to.equal(HandType.FIVE_OF_A_KIND)
    expect(calcHandType('22222')).to.equal(HandType.FIVE_OF_A_KIND)

    expect(calcHandType('AA8AA')).to.equal(HandType.FOUR_OF_A_KIND)
    expect(calcHandType('A8888')).to.equal(HandType.FOUR_OF_A_KIND)

    expect(calcHandType('23332')).to.equal(HandType.FULL_HOUSE)

    expect(calcHandType('TTT98')).to.equal(HandType.THREE_OF_A_KIND)

    expect(calcHandType('23432')).to.equal(HandType.TWO_PAIR)

    expect(calcHandType('A23A4')).to.equal(HandType.ONE_PAIR)

    expect(calcHandType('23456')).to.equal(HandType.HIGH_CARD)
  })

  test('rankHands should order hands of different types in ascending order', () => {
    const hands = [
      { cards: '32T3K', bid: 1 },
      { cards: 'T55J5', bid: 2 },
      { cards: 'KK677', bid: 3 },
      { cards: '55555', bid: 4 },
      { cards: '98765', bid: 5 },
      { cards: '4444T', bid: 6 },
      { cards: '22333', bid: 7 },
    ]

    expect(rankHands(hands)).to.deep.equal([
      { cards: '98765', bid: 5, rank: 1 },
      { cards: '32T3K', bid: 1, rank: 2 },
      { cards: 'KK677', bid: 3, rank: 3 },
      { cards: 'T55J5', bid: 2, rank: 4 },
      { cards: '22333', bid: 7, rank: 5 },
      { cards: '4444T', bid: 6, rank: 6 },
      { cards: '55555', bid: 4, rank: 7 },
    ])
  })

  test('rankHands should order hands with duplicate types in ascending order', () => {
    const hands = [
      '32T3K 765',
      'T55J5 684',
      'KK677 28',
      'KTJJT 220',
      'QQQJA 483',
    ]
      .map((line) => line.split(' '))
      .map(([cards, bidStr]) => ({ cards, bid: parseInt(bidStr) }))

    expect(rankHands(hands)).to.deep.equal([
      { cards: '32T3K', bid: 765, rank: 1 },
      { cards: 'KTJJT', bid: 220, rank: 2 },
      { cards: 'KK677', bid: 28, rank: 3 },
      { cards: 'T55J5', bid: 684, rank: 4 },
      { cards: 'QQQJA', bid: 483, rank: 5 },
    ])
  })

  test('v1 should return 6440 for sample input', async () => {
    expect(await v1(`${__dirname}/sampleinput.txt`)).to.equal(6440)
  })
})

describe('v2: J = Joker', () => {
  test('calcHandTypeJokers should calculate correct hand types', () => {
    expect(calcHandTypeJokers('AAAAA')).to.equal(HandType.FIVE_OF_A_KIND)
    expect(calcHandTypeJokers('22222')).to.equal(HandType.FIVE_OF_A_KIND)

    expect(calcHandTypeJokers('AA8AA')).to.equal(HandType.FOUR_OF_A_KIND)
    expect(calcHandTypeJokers('A8888')).to.equal(HandType.FOUR_OF_A_KIND)

    expect(calcHandTypeJokers('23332')).to.equal(HandType.FULL_HOUSE)

    expect(calcHandTypeJokers('TTT98')).to.equal(HandType.THREE_OF_A_KIND)

    expect(calcHandTypeJokers('23432')).to.equal(HandType.TWO_PAIR)

    expect(calcHandTypeJokers('A23A4')).to.equal(HandType.ONE_PAIR)

    expect(calcHandTypeJokers('23456')).to.equal(HandType.HIGH_CARD)

    expect(calcHandTypeJokers('32T3K')).to.equal(HandType.ONE_PAIR)
    expect(calcHandTypeJokers('T55J5')).to.equal(HandType.FOUR_OF_A_KIND)
    expect(calcHandTypeJokers('KK677')).to.equal(HandType.TWO_PAIR)
    expect(calcHandTypeJokers('KTJJT')).to.equal(HandType.FOUR_OF_A_KIND)
    expect(calcHandTypeJokers('QQQJA')).to.equal(HandType.FOUR_OF_A_KIND)
  })

  test('rankHandsJokers should order hands with duplicate types in ascending order', () => {
    const hands = [
      '32T3K 765',
      'T55J5 684',
      'KK677 28',
      'KTJJT 220',
      'QQQJA 483',
    ]
      .map((line) => line.split(' '))
      .map(([cards, bidStr]) => ({ cards, bid: parseInt(bidStr) }))

    expect(rankHandsJokers(hands)).to.deep.equal([
      { cards: '32T3K', bid: 765, rank: 1 },
      { cards: 'KK677', bid: 28, rank: 2 },
      { cards: 'T55J5', bid: 684, rank: 3 },
      { cards: 'QQQJA', bid: 483, rank: 4 },
      { cards: 'KTJJT', bid: 220, rank: 5 },
    ])
  })

  test('v2 should return 5905 for sample input', async () => {
    expect(await v2(`${__dirname}/sampleinput.txt`)).to.equal(5905)
  })
})
