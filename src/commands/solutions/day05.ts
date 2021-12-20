import { GluegunCommand } from 'gluegun'

const DAY = '05'

interface Point {
  x: number
  y: number
}

const part = (input: string[], partNum: number) => {
  let counter = {}
  const delta = (a: number, b: number): number => (a === b ? 0 : a < b ? 1 : -1)
  const makeKey = (x: number, y: number): string => `${x}.${y}`

  for (let line of input) {
    const [x1, y1, x2, y2] = line.split(/\D+/).map(x => parseInt(x))
    const a: Point = { x: x1, y: y1 }
    const b: Point = { x: x2, y: y2 }

    const xDelta = delta(a.x, b.x)
    const yDelta = delta(a.y, b.y)
    if (partNum === 1 && xDelta !== 0 && yDelta !== 0) {
      // ignore diagonals for part 1
      continue
    }
    let [x, y] = [a.x, a.y]
    while (true) {
      const key = makeKey(x, y)
      counter[key] = (counter[key] || 0) + 1
      if (x === b.x && y === b.y) break
      x += xDelta
      y += yDelta
    }
  }
  let result = 0
  for (const [_, value] of Object.entries(counter)) {
    if (value >= 2) result += 1
  }
  return result
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
