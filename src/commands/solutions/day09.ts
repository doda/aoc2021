import { GluegunCommand } from 'gluegun'

const DAY = '09'

const DELTAS = [
  [0, 1],
  [1, 0],
  [-1, 0],
  [0, -1]
]

let valid = (i: number, j: number, N: number, M: number) =>
  i >= 0 && i < N && j >= 0 && j < M

let neighbors = (
  mat: number[][],
  i: number,
  j: number,
  N: number,
  M: number
): number[] => {
  let result = []
  for (const [di, dj] of DELTAS) {
    if (valid(i + di, j + dj, N, M)) result.push(mat[i + di][j + dj])
  }
  return result
}

const part1 = (mat: number[][]) => {
  return findLowPoints(mat).reduce((acc, [i, j]) => acc + mat[i][j] + 1, 0)
}

const findLowPoints = (mat: number[][]): number[][] => {
  const N = mat.length
  const M = mat[0].length
  let result: number[][] = []
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      const val = mat[i][j]
      const neighs = neighbors(mat, i, j, N, M)
      if (neighs.every(n => n > val)) {
        result.push([i, j])
      }
    }
  }
  return result
}

const makeKey = (i: number, j: number): string => `${i}.${j}`

const fillBasin = (
  mat: number[][],
  i: number,
  j: number,
  N: number,
  M: number,
  visited: Set<string>
) => {
  const key = makeKey(i, j)
  if (visited.has(key)) return
  visited.add(key)
  for (const [di, dj] of DELTAS) {
    if (
      valid(i + di, j + dj, N, M) &&
      mat[i + di][j + dj] > mat[i][j] &&
      mat[i + di][j + dj] < 9
    ) {
      fillBasin(mat, i + di, j + dj, N, M, visited)
    }
  }
}

const part2 = (mat: number[][]): number => {
  const N = mat.length
  const M = mat[0].length

  let basins: Record<string, number> = {}
  const lowPoints = findLowPoints(mat)
  for (const [i, j] of lowPoints) {
    let basin: Set<string> = new Set()
    fillBasin(mat, i, j, N, M, basin)
    basins[makeKey(i, j)] = basin.size
  }

  let sorted = Object.entries(basins).sort((a, b) => b[1] - a[1])
  return sorted.slice(0, 3).reduce((a, x) => a * x[1], 1)
}

const command: GluegunCommand = {
  name: `day${DAY}`,
  run: async toolbox => {
    const { print, readInput } = toolbox
    const input: string[] = readInput(DAY)
    const mat: number[][] = input.map(row =>
      row.split('').map(val => parseInt(val))
    )

    print.info(`Part 1: ${part1(mat)}`)
    print.info(`Part 2: ${part2(mat)}`)
  }
}

module.exports = command
