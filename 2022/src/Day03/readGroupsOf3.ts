import { eachLine } from '../utils'

export async function readGroupsOf3() {
  const groups: string[][] = []
  let group: string[] = []

  await eachLine(`${__dirname}/input.txt`, (line) => {
    group.push(line)
    if (group.length === 3) {
      groups.push(group)
      group = []
    }
  })
  return groups
}
