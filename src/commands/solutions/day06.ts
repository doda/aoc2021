import { GluegunCommand } from 'gluegun'

const DAY = '06'

const part = (input: string[], days: number) => {
  const numbers = input[0].split(/\D+/).map(x => parseInt(x))
  let counter = Array(9).fill(0)
  for (const number of numbers) {
    counter[number] += 1
  }
  for (let i = 0; i < days; i++) {
    const zeros = counter.shift()
    counter.push(zeros)
    counter[6] += zeros
  }
  let result = 0
  for (const value of counter) result += value
  return result
}

const command: GluegunCommand = {
  name: `day${DAY}`,
  run: async toolbox => {
    const { print, readInput } = toolbox
    const input = readInput(DAY)

    print.info(`Part 1: ${part(input, 80)}`)
    print.info(`Part 2: ${part(input, 256)}`)
  }
}

module.exports = command
