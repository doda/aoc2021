import { GluegunCommand } from 'gluegun'

const DAY = '08'

interface Entry {
  patterns: Set<string>[]
  outputs: Set<string>[]
}

const subset = <T>(a: Set<T>, b: Set<T>) => {
  return [...b].every(x => a.has(x))
}

const intersection = <T>(a: Set<T>, b: Set<T>) => {
  return new Set([...a].filter(i => b.has(i)))
}

const equal = <T>(a: Set<T>, b: Set<T>) => {
  return a.size === b.size && [...a].every(x => b.has(x))
}
//  0:      1:      2:      3:      4:
//  aaaa    ....    aaaa    aaaa    ....
// b    c  .    c  .    c  .    c  b    c
// b    c  .    c  .    c  .    c  b    c
//  ....    ....    dddd    dddd    dddd
// e    f  .    f  e    .  .    f  .    f
// e    f  .    f  e    .  .    f  .    f
//  gggg    ....    gggg    gggg    ....

//   5:      6:      7:      8:      9:
//  aaaa    aaaa    aaaa    aaaa    aaaa
// b    .  b    .  .    c  b    c  b    c
// b    .  b    .  .    c  b    c  b    c
//  dddd    dddd    ....    dddd    dddd
// .    f  e    f  .    f  e    f  .    f
// .    f  e    f  .    f  e    f  .    f
//  gggg    gggg    ....    gggg    gggg

// length == 5: 2, 3, 5
// length == 6: 0, 6, 9

const parseInput = (input: string[]): Entry[] => {
  let result: Entry[] = []
  for (let line of input) {
    let [patterns, outputs] = line.split(' | ')
    let entry: Entry = {
      patterns: patterns.split(' ').map(pattern => new Set(pattern)),
      outputs: outputs.split(' ').map(output => new Set(output))
    }
    result.push(entry)
  }

  return result
}

const part1 = (entries: Entry[]) => {
  let result = 0
  for (let entry of entries) {
    for (let output of entry.outputs) {
      if ([2, 3, 4, 7].includes(output.size)) {
        result++
      }
    }
  }
  return result
}

const parseEntry = (entry: Entry): number => {
  let knownPatterns: Record<number, Set<string>> = {}

  // Parse definitive patterns first
  for (let pattern of entry.patterns) {
    if (pattern.size === 2) knownPatterns[1] = pattern
    if (pattern.size === 3) knownPatterns[7] = pattern
    if (pattern.size === 4) knownPatterns[4] = pattern
    if (pattern.size === 7) knownPatterns[8] = pattern
  }

  // Use knownPatterns to deduce ambiguous ones
  for (let pattern of entry.patterns) {
    if (pattern.size === 5) {
      if (subset(pattern, knownPatterns[7])) {
        knownPatterns[3] = pattern
      } else if (intersection(pattern, knownPatterns[4]).size == 3) {
        knownPatterns[5] = pattern
      } else {
        knownPatterns[2] = pattern
      }
    }
    if (pattern.size === 6) {
      if (!subset(pattern, knownPatterns[7])) {
        knownPatterns[6] = pattern
      } else if (intersection(pattern, knownPatterns[4]).size == 4) {
        knownPatterns[9] = pattern
      } else {
        knownPatterns[0] = pattern
      }
    }
  }

  let result = 0
  for (let output of entry.outputs) {
    for (let [index, knownPat] of Object.entries(knownPatterns)) {
      if (equal(output, knownPat)) {
        result = result * 10 + parseInt(index)
      }
    }
  }
  return result
}

const part2 = (entries: Entry[]) => {
  let result = 0
  for (let entry of entries) {
    result += parseEntry(entry)
  }
  return result
}

const command: GluegunCommand = {
  name: `day${DAY}`,
  run: async toolbox => {
    const { print, readInput } = toolbox
    let input = readInput(DAY)
    let entries = parseInput(input)

    print.info(`Part 1: ${part1(entries)}`)
    print.info(`Part 2: ${part2(entries)}`)
  }
}

module.exports = command
