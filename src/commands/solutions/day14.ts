import { GluegunCommand } from 'gluegun'

const DAY = '14'

const part = (input: string[], steps: number): number => {
  let [template, rulesList] = [input[0], input.slice(2)]
  let [firstLetter, lastLetter] = [template[0], template[template.length - 1]]
  let pairsCounter: Record<string, number> = {}
  let rules: Record<string, string> = {}
  for (let i = 0; i < template.length - 1; i++) {
    const key = `${template[i]}${template[i + 1]}`
    pairsCounter[key] = (pairsCounter[key] || 0) + 1
  }
  for (let line of rulesList) {
    let [pair, insert] = line.split(' -> ')
    rules[pair] = insert
  }

  let nextCounter = {}
  for (let step = 0; step < steps; step++) {
    nextCounter = Object.assign({}, pairsCounter)
    for (let [pair, count] of Object.entries(pairsCounter)) {
      if (rules.hasOwnProperty(pair)) {
        const insert = rules[pair]

        nextCounter[`${pair[0]}${insert}`] =
          (nextCounter[`${pair[0]}${insert}`] || 0) + count
        nextCounter[`${insert}${pair[1]}`] =
          (nextCounter[`${insert}${pair[1]}`] || 0) + count
        nextCounter[pair] -= count
      }
    }
    pairsCounter = nextCounter
  }

  let letterCounter: Record<string, number> = {}

  for (let [pair, count] of Object.entries(pairsCounter)) {
    letterCounter[pair[0]] = (letterCounter[pair[0]] || 0) + count
    letterCounter[pair[1]] = (letterCounter[pair[1]] || 0) + count
  }
  letterCounter[firstLetter] += 1
  letterCounter[lastLetter] += 1
  let max = Math.max(...Object.values(letterCounter)) / 2
  let min = Math.min(...Object.values(letterCounter)) / 2
  return max - min
}

const command: GluegunCommand = {
  name: `day${DAY}`,
  run: async toolbox => {
    const { print, readInput } = toolbox
    const input = readInput(DAY)

    print.info(`Part 1: ${part(input, 10)}`)
    print.info(`Part 2: ${part(input, 40)}`)
  }
}

module.exports = command
