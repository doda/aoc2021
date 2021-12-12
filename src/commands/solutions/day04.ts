import { GluegunCommand } from 'gluegun'

const DAY = '04'

const parseBoards = (input: string[]): number[][][] => {
  let boards = []
  let curBoard = []
  for (let line of input.slice(2)) {
    if (line.length === 0) {
      boards.push(curBoard)
      curBoard = []
      continue
    }
    curBoard.push(
      line
        .trim()
        .split(/ +/)
        .map(x => parseInt(x))
    )
  }
  boards.push(curBoard)

  return boards
}

interface BoardCounter {
  rows: number[]
  cols: number[]
}

const sumPositive = (board: number[][]): number => {
  let result = 0
  for (let row of board) {
    for (let value of row) {
      if (value > 0) result += value
    }
  }
  return result
}

const part = (input: string[], partNum: number) => {
  let numbers = input[0].split(',').map(x => parseInt(x))
  let boards = parseBoards(input)
  let N = boards[0].length

  let counters: BoardCounter[] = boards.map(_ => {
    return { rows: Array(N).fill(0), cols: Array(N).fill(0) }
  })
  let winners: Set<number> = new Set()
  var solution: number

  for (let number of numbers) {
    for (let [boardIdx, board] of boards.entries()) {
      for (let [i, row] of board.entries()) {
        for (let [j, val] of row.entries()) {
          if (val === number) {
            counters[boardIdx].rows[i] += 1
            counters[boardIdx].cols[j] += 1
            // "Mark" number
            board[i][j] *= -1
          }
        }
      }
    }
    for (const [i, counter] of counters.entries()) {
      if (
        counter.cols.filter(x => x === N).length > 0 ||
        counter.rows.filter(x => x === N).length > 0
      ) {
        if (partNum === 1) return number * sumPositive(boards[i])
        else if (partNum === 2) {
          if (!winners.has(i)) {
            solution = number * sumPositive(boards[i])
            winners.add(i)
          }
        }
      }
    }
  }
  return solution
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
