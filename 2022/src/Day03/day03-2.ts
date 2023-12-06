import { oneCommon } from './common'
import { priority } from './priority'
import { readGroupsOf3 } from './readGroupsOf3'

async function main() {
  const groups = await readGroupsOf3()

  const prioritySum = groups.reduce(
    (sum, group) => sum + priority(oneCommon(...group)),
    0
  )

  console.log('Priority sum: %o', prioritySum)
}

main()
