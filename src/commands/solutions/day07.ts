import { GluegunCommand } from 'gluegun'

const DAY = '07'

const part = (input: string[], partNum: number) => {
  let numbers = input[0].split(/\D+/).map(x => parseInt(x))
  let counter = Array(Math.max(...numbers) + 1).fill(0)
  let cost = Array(Math.max(...numbers) + 1).fill(0)
  for (const number of numbers) {
    counter[number] = (counter[number] || 0) + 1
  }

  if (partNum === 1) {
    for (let i = 0; i < counter.length; i++) {
      const nCrabs = counter[i]
      for (let j = 0; j < counter.length; j++) {
        const distance = Math.abs(i - j)
        cost[j] += nCrabs * distance
      }
    }
  } else if (partNum === 2) {
    for (let i = 0; i < counter.length; i++) {
      const nCrabs = counter[i]
      let moveCost = 0
      for (let j = i - 1; j >= 0; j--) {
        const distance = Math.abs(i - j)
        moveCost += distance
        cost[j] += nCrabs * moveCost
      }
      moveCost = 0
      for (let j = i + 1; j < counter.length; j++) {
        const distance = Math.abs(i - j)
        moveCost += distance
        cost[j] += nCrabs * moveCost
      }
    }
  }
  return Math.min(...cost)
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
