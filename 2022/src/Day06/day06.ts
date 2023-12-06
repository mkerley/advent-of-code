import { readLines } from '../utils'

const LEN_START_PACKET_MARKER = 4
const LEN_START_MESSAGE_MARKER = 14

function charsReadToFindFirstUniqueSequence(
  input: string,
  targetLength: number
) {
  for (let i = targetLength; i < input.length; i++) {
    if (allUnique(input.slice(i - targetLength, i))) {
      return i
    }
  }
}

function allUnique(buf: string): boolean {
  const seen = {}
  for (const c of buf) {
    if (seen[c]) {
      return false
    }
    seen[c] = true
  }

  return true
}

async function main() {
  const input = (await readLines(`${__dirname}/input.txt`))[0]

  console.log(
    'Characters read to find first start-of-packet marker:',
    charsReadToFindFirstUniqueSequence(input, LEN_START_PACKET_MARKER)
  )
  console.log(
    'Characters read to find first start-of-message marker:',
    charsReadToFindFirstUniqueSequence(input, LEN_START_MESSAGE_MARKER)
  )
}

main()
