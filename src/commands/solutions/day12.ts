import { GluegunCommand } from 'gluegun'

const DAY = '12'

const part = (input: string[], partNum: number): number => {
  let paths: Record<string, string[]> = {}
  let visited: Set<string> = new Set(['start'])
  // For part 2 we can visit a single small cave twice
  let extraVisit = partNum === 2

  let result = 0
  for (const line of input) {
    const [from, to] = line.split('-')
    paths[from] = paths[from] ?? []
    paths[from].push(to)
    paths[to] = paths[to] ?? []
    paths[to].push(from)
  }

  const visit = (cave: string) => {
    if (cave === 'end') {
      result++
      return
    }
    for (const otherCave of paths[cave]) {
      let usingExtraVisit = false
      if (visited.has(otherCave)) {
        if (extraVisit && !['start', 'end'].includes(otherCave)) {
          usingExtraVisit = true
          extraVisit = false
        } else {
          continue
        }
      }
      if (otherCave === otherCave.toLowerCase()) visited.add(otherCave)
      visit(otherCave)
      if (usingExtraVisit) {
        extraVisit = true
      } else {
        visited.delete(otherCave)
      }
    }
  }
  visit('start')
  return result
}

const command: GluegunCommand = {
  name: `day${DAY}`,
  run: async toolbox => {
    const { print, readInput } = toolbox
    const input = readInput(DAY)

    print.info(`Part 1: ${part(input, 1)}`)
    print.info(`Part 2: ${part(input, 2)}`)
  }
}

module.exports = command
