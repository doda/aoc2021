import { GluegunCommand } from 'gluegun'
import {
  MinPriorityQueue,
  PriorityQueueItem
} from '@datastructures-js/priority-queue'

const DAY = '15'

const DELTAS = [
  [0, 1],
  [1, 0],
  [-1, 0],
  [0, -1]
]

class Pos {
  i: number
  j: number
  distance?: number

  constructor(i: number, j: number, distance?: number) {
    this.i = i
    this.j = j
    this.distance = distance
  }

  key() {
    return `${this.i}.${this.j}`
  }
}

const part = (mat: number[][], factor: number): number => {
  const N = mat.length
  const M = mat[0].length
  const expN = N * factor
  const expM = M * factor

  const valid = (i: number, j: number) =>
    i >= 0 && i < expN && j >= 0 && j < expM

  const matGet = (i, j) => {
    const gridI = Math.floor(i / N)
    const gridJ = Math.floor(j / M)
    const risk = mat[i % N][j % M] + gridI + gridJ
    return risk > 9 ? risk - 9 : risk
  }

  const tentative = new MinPriorityQueue<Pos>({
    priority: (pos: Pos) => pos.distance
  })

  let dist: Record<string, number> = {}

  for (let i = 0; i < expN; i++) {
    for (let j = 0; j < expM; j++) {
      const distance = i === 0 && j === 0 ? 0 : Infinity

      const pos = new Pos(i, j, distance)
      dist[pos.key()] = Infinity
      tentative.enqueue(pos)
    }
  }
  const start = new Pos(0, 0)
  dist[start.key()] = 0

  while (!tentative.isEmpty()) {
    const item = tentative.dequeue() as PriorityQueueItem<Pos>
    const pos = item.element

    for (const [di, dj] of DELTAS) {
      if (valid(pos.i + di, pos.j + dj)) {
        const neigh = new Pos(
          pos.i + di,
          pos.j + dj,
          dist[pos.key()] + matGet(pos.i + di, pos.j + dj)
        )
        if (neigh.distance < dist[neigh.key()]) {
          // Found a new best path to neigh
          dist[neigh.key()] = neigh.distance
          neigh.distance = neigh.distance
          tentative.enqueue(neigh)
        }
      }
    }
  }
  const end = new Pos(expN - 1, expM - 1)
  return dist[end.key()]
}

const command: GluegunCommand = {
  name: `day${DAY}`,
  run: async toolbox => {
    const { print, readInput } = toolbox
    const input = readInput(DAY)
    const numInput = input.map(line =>
      line.split('').map(number => parseInt(number))
    )
    print.info(`Part 1: ${part(numInput, 1)}`)
    print.info(`Part 2: ${part(numInput, 5)}`)
  }
}

module.exports = command
