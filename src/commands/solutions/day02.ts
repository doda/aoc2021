import { GluegunCommand } from 'gluegun'

const DAY = '02'

const part1 = (input: Array<number>) => {}

const part2 = (input: Array<number>) => {}

const command: GluegunCommand = {
  name: `day${DAY}`,
  run: async toolbox => {
    const { print, readInput } = toolbox
    let input = readInput(DAY)

    let numInput = input.map(line => Number(line))

    print.info(`Part 1: ${part1(numInput)}`)
    print.info(`Part 2: ${part2(numInput)}`)
  }
}

module.exports = command
