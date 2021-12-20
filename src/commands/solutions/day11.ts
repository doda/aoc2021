import { GluegunCommand } from 'gluegun'

const DAY = '11'

let valid = (i: number, j: number, N: number, M: number) =>
  i >= 0 && i < N && j >= 0 && j < M

const part = (mat: number[][], partNum: number): number => {
  mat = mat.map(numbers => [...numbers])

  const flash = (i: number, j: number) => {
    if (mat[i][j] <= 9 || mat[i][j] >= 100) {
      return
    }
    result++
    mat[i][j] += 100 // >= 100 means it's been flashed this round
    for (const di of [1, 0, -1]) {
      for (const dj of [1, 0, -1]) {
        if (di === 0 && dj === 0) continue
        if (valid(i + di, j + dj, N, M)) {
          mat[i + di][j + dj]++
          flash(i + di, j + dj)
        }
      }
    }
  }
  let result = 0
  const steps = partNum === 1 ? 100 : Number.MAX_SAFE_INTEGER
  const N = mat.length
  const M = mat[0].length

  for (let step = 0; step < steps; step++) {
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < M; j++) {
        mat[i][j]++
      }
    }
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < M; j++) {
        if (mat[i][j] > 9) {
          flash(i, j)
        }
      }
    }
    let allFlashed = true
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < M; j++) {
        if (mat[i][j] > 9) {
          mat[i][j] = 0
        } else {
          allFlashed = false
        }
      }
    }
    if (partNum === 2 && allFlashed) {
      return step + 1
    }
  }

  return result
}

const command: GluegunCommand = {
  name: `day${DAY}`,
  run: async toolbox => {
    const { print, readInput } = toolbox
    const input = readInput(DAY).map((line: string) =>
      line.split('').map((x: string) => parseInt(x))
    )

    print.info(`Part 1: ${part(input, 1)}`)
    print.info(`Part 2: ${part(input, 2)}`)
  }
}

module.exports = command
