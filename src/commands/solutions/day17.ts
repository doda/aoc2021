import { GluegunCommand } from 'gluegun'
const DAY = '17'

const part = (input: string, part: number): number => {
  const shoot = (x: number, y: number, xVel: number, yVel: number): number => {
    let highestY = y
    while (x <= x2 && y >= y1) {
      x += xVel
      y += yVel
      highestY = Math.max(y, highestY)
      xVel = Math.max(0, xVel - 1)
      yVel -= 1
      if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {
        // target hit
        return highestY
      }
    }
    return -Infinity
  }
  const [x1, x2, y1, y2] = input.match(/[-\d]+/g).map(x => parseInt(x))

  let validYVelocities: number[] = []
  for (let yVel = -1000; yVel < 1000; yVel++) {
    if (shoot(x1, 0, 0, yVel) !== -Infinity) validYVelocities.push(yVel)
  }

  validYVelocities.reverse()

  let validResults: string[] = []
  for (let yVel of validYVelocities) {
    for (let xVel = -1000; xVel < 1000; xVel++) {
      let result = shoot(0, 0, xVel, yVel)
      if (result !== -Infinity) {
        if (part === 1) {
          return result
        }
        validResults.push(`${xVel},${yVel}`)
      }
    }
  }
  return validResults.length
}

const command: GluegunCommand = {
  name: `day${DAY}`,
  run: async toolbox => {
    const { print, readInput } = toolbox
    const input = readInput(DAY)
    print.info(`Part 1: ${part(input[0], 1)}`)
    print.info(`Part 2: ${part(input[0], 2)}`)
  }
}

module.exports = command
