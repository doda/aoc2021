import { GluegunCommand } from 'gluegun'

const DAY = '03'

const getCounter = (input: string[]): number[] => {
  const nBits = input[0].length
  const counter = Array(nBits).fill(0)
  input.map(str => {
    str.split('').map((b, i) => (counter[i] += parseInt(b)))
  })
  return counter
}

const part1 = (input: string[]) => {
  const nRows = input.length
  let gamma = []
  let epsilon = []

  getCounter(input).map(value => {
    const majority1s = value >= nRows / 2
    gamma.push(majority1s ? 1 : 0)
    epsilon.push(majority1s ? 0 : 1)
  })
  const gammaNum = parseInt(gamma.join(''), 2)
  const epsilonNum = parseInt(epsilon.join(''), 2)
  return gammaNum * epsilonNum
}

const part2 = (input: string[]) => {
  let result = 1

  const gammaOrEpsilon = [true, false]
  gammaOrEpsilon.map(isGamma => {
    let candidates = [...input]
    let i = 0
    while (candidates.length > 1) {
      const counter = getCounter(candidates)

      const majority = isGamma
        ? counter[i] >= candidates.length / 2
        : counter[i] < candidates.length / 2
      candidates = candidates.filter(x => x[i] === (majority ? '1' : '0'))
      i++
    }
    // Multiply the 2 results
    result *= parseInt(candidates[0], 2)
  })

  return result
}

const command: GluegunCommand = {
  name: `day${DAY}`,
  run: async toolbox => {
    const { print, readInput } = toolbox
    const input = readInput(DAY)

    print.info(`Part 1: ${part1(input)}`)
    print.info(`Part 2: ${part2(input)}`)
  }
}

module.exports = command
