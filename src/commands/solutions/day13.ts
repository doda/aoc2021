import { GluegunCommand } from 'gluegun'
import { reduce } from 'lodash'

const DAY = '13'

const display = <T>(matrix: T[][]) => {
  for (let line of matrix) {
    console.log(line.map(v => (v ? '#' : '.')).join(''))
  }
  console.log()
}

const sum = (matrix: number[][]) => {
  return reduce(
    matrix.map(row => reduce(row, (a, x) => a + x, 0)),
    (a, x) => a + x,
    0
  )
}

const rotate = <T>(matrix: T[][]) =>
  matrix[0].map((val, index) => matrix.map(row => row[index]).reverse())

const foldUp = (matrix: number[][]): number[][] => {
  let newMatrix: number[][] = []
  const N = matrix.length
  for (let y = 0; y < Math.floor(matrix.length / 2); y++) {
    newMatrix.push(matrix[y].map((x, idx) => x | matrix[N - y - 1][idx]))
  }
  return newMatrix
}

interface Instruction {
  axis: 'x' | 'y'
  value: number
}

const part = (
  matrix: number[][],
  instructions: Instruction[],
  partNum: number
): number => {
  for (const instruction of instructions.slice(0, partNum === 1 ? 1 : 100)) {
    if (instruction.axis === 'y') {
      // fold up
      matrix = foldUp(matrix)
    }
    if (instruction.axis === 'x') {
      // simulate fold left by doing:
      // rotate, fold up, rotate 3x
      // NB: When do you ever get to write code like this? ^_^
      matrix = rotate(rotate(rotate(foldUp(rotate(matrix)))))
    }
  }
  if (partNum === 1) {
    return sum(matrix)
  } else {
    console.log('Part 2:')
    display(matrix)
  }
}

const parseInput = (input: string[]): [number[][], Instruction[]] => {
  let [maxX, maxY] = [0, 0]
  let coords: number[][] = []

  let instructions: Instruction[] = []
  let i = 0
  for (; i < input.length; i++) {
    const line = input[i]
    if (line.trim().length === 0) {
      i++
      break
    }
    const [x, y] = line.split(',').map(x => parseInt(x))
    coords.push([x, y])
    maxX = x > maxX ? x : maxX
    maxY = y > maxY ? y : maxY
  }
  let matrix: number[][] = Array(maxY + 1)
    .fill(0)
    .map(() => Array(maxX + 1).fill(0))

  for (const [x, y] of coords) {
    matrix[y][x] = 1
  }

  for (; i < input.length; i++) {
    const line = input[i]
    const [axis, value] = line.split(' ')[2].split('=')
    instructions.push({
      axis: axis as Instruction['axis'],
      value: parseInt(value)
    })
  }

  return [matrix, instructions]
}

const command: GluegunCommand = {
  name: `day${DAY}`,
  run: async toolbox => {
    const { print, readInput } = toolbox
    const input = readInput(DAY)
    const [matrix, instructions] = parseInput(input)
    print.info(`Part 1: ${part(matrix, instructions, 1)}`)
    part(matrix, instructions, 2)
  }
}

module.exports = command
