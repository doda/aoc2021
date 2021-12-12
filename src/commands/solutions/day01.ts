import { GluegunCommand } from 'gluegun'

const DAY = '01'

const rolling = (array: Array<any>, window: Number) => {
  let result = []
  let curWindow = []

  for (let value of array) {
    if (curWindow.length < window) {
      curWindow.push(value)
      continue
    }
    result.push([...curWindow])
    curWindow = curWindow.slice(1)
    curWindow.push(value)
  }
  result.push([...curWindow])
  return result
}

const part1 = (input: Array<number>) => {
  let result = 0
  let prevNum = Number.MAX_SAFE_INTEGER
  input.map(num => {
    if (num > prevNum) result++
    prevNum = num
  })

  return result
}

const part2 = (input: Array<number>) => {
  let result = 0
  let lastSum = Number.MAX_SAFE_INTEGER
  rolling(input, 3).map(triple => {
    let [a, b, c] = triple
    let newSum = a + b + c
    if (newSum > lastSum) result += 1
    lastSum = newSum
  })
  return result
}

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
