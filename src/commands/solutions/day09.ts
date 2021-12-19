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
  for (let [di, dj] of DELTAS) {
    if (valid(i + di, j + dj, N, M)) result.push(mat[i + di][j + dj])
  }
  return result
}

const part1 = (mat: number[][]) => {
  return findLowPoints(mat).reduce((acc, [i, j]) => acc + mat[i][j] + 1, 0)
}

const findLowPoints = (mat: number[][]): number[][] => {
  let N = mat.length
  let M = mat[0].length
  let result: number[][] = []
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      let val = mat[i][j]
      let neighs = neighbors(mat, i, j, N, M)
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
  let key = makeKey(i, j)
  if (visited.has(key)) return
  visited.add(key)
  for (let [di, dj] of DELTAS) {
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
  let N = mat.length
  let M = mat[0].length

  let basins: Record<string, number> = {}
  let lowPoints = findLowPoints(mat)
  for (let [i, j] of lowPoints) {
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
    let input: string[] = readInput(DAY)
    let mat: number[][] = input.map(row =>
      row.split('').map(val => parseInt(val))
    )

    print.info(`Part 1: ${part1(mat)}`)
    print.info(`Part 2: ${part2(mat)}`)
  }
}

module.exports = command
