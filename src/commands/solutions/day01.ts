import { GluegunCommand } from 'gluegun'

const DAY = '01'

const part1 = (input: number[]) => {
  let result = 0
  let prevNum = Number.MAX_SAFE_INTEGER
  input.map(num => {
    if (num > prevNum) result++
    prevNum = num
  })

  return result
}

const part2 = (input: number[]) => {
  const triples = input.slice(2).map((x, i) => x + input[i] + input[i + 1])
  return triples.slice(1).reduce((a, x, i) => a + (triples[i] < x ? 1 : 0), 0)
}

const command: GluegunCommand = {
  name: `day${DAY}`,
  run: async toolbox => {
    const { print, readInput } = toolbox
    const input = readInput(DAY)
    const numInput = input.map(line => parseInt(line))

    print.info(`Part 1: ${part1(numInput)}`)
    print.info(`Part 2: ${part2(numInput)}`)
  }
}

module.exports = command
