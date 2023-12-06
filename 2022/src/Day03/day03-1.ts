import { oneCommon } from './common'
import { priority } from './priority'
import { splitLinesInHalf } from './splitLinesInHalf'

async function main() {
  const groups = await splitLinesInHalf()

  const prioritySum = groups.reduce(
    (sum, group) => sum + priority(oneCommon(...group)),
    0
  )

  console.log('Priority sum: %o', prioritySum)
}

main()
