import * as lineReader from 'line-reader'

export function eachLine(
  filename: string,
  iteratee: (line: string, last: boolean) => void
) {
  return new Promise<void>(function (resolve, reject) {
    lineReader.eachLine(filename, {}, iteratee, function (err) {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

export async function readLines(filename: string) {
  const lines: string[] = []
  await eachLine(filename, (line) => {
    lines.push(line)
  })
  return lines
}
