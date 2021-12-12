import { GluegunCommand } from 'gluegun'

const DAY = '02'

const part1 = (input: string[]) => {
  let depth = 0
  let position = 0
  input.map(line => {
    let [direction, amount] = line.split(' ')
    let amountNum = Number(amount)
    switch (direction) {
      case 'forward':
        position += amountNum
        break
      case 'up':
        amountNum = -amountNum
      default:
        depth += amountNum
    }
  })
  return depth * position
}

const part2 = (input: string[]) => {
  let depth = 0
  let aim = 0
  let position = 0
  input.map(line => {
    let [direction, amount] = line.split(' ')
    let amountNum = Number(amount)
    switch (direction) {
      case 'forward':
        position += amountNum
        depth += aim * amountNum
        break
      case 'up':
        amountNum = -amountNum
      default:
        aim += amountNum
    }
  })
  return depth * position
}

const command: GluegunCommand = {
  name: `day${DAY}`,
  run: async toolbox => {
    const { print, readInput } = toolbox
    let input = readInput(DAY)

    print.info(`Part 1: ${part1(input)}`)
    print.info(`Part 2: ${part2(input)}`)
  }
}

module.exports = command
