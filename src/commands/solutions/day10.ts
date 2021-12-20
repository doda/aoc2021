import { GluegunCommand } from 'gluegun'

const DAY = '10'

const braces: string[][] = [
  ['(', ')'],
  ['[', ']'],
  ['{', '}'],
  ['<', '>']
]

const braceValues1: Record<string, number> = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137
}

const braceValues2: Record<string, number> = {
  '(': 1,
  '[': 2,
  '{': 3,
  '<': 4
}

const isClosing = (stack: string[], char: string, pair: string[]) => {
  let [open, close] = pair
  return (
    char === close && stack.length !== 0 && stack[stack.length - 1] === open
  )
}

const part = (input: string[], partNum: number): number => {
  let result = 0
  let lineScores: number[] = []
  for (let line of input) {
    let stack: string[] = []
    let valid = true
    for (let char of line) {
      if (['(', '[', '{', '<'].includes(char)) {
        stack.push(char)
      } else if (braces.some(pair => isClosing(stack, char, pair))) {
        stack.pop()
      } else {
        if (partNum === 1) {
          result += braceValues1[char]
        }
        valid = false
        break
      }
    }
    if (partNum === 2 && valid) {
      lineScores.push(
        stack.reverse().reduce((a, x) => a * 5 + braceValues2[x], 0)
      )
    }
  }
  if (partNum == 2) {
    lineScores.sort((a, b) => a - b)
    return lineScores[Math.floor(lineScores.length / 2)]
  }
  return result
}

const command: GluegunCommand = {
  name: `day${DAY}`,
  run: async toolbox => {
    const { print, readInput } = toolbox
    let input = readInput(DAY)

    print.info(`Part 1: ${part(input, 1)}`)
    print.info(`Part 2: ${part(input, 2)}`)
  }
}

module.exports = command
