import { GluegunCommand } from 'gluegun'

const DAY = '16'

const HEXTOBIN = {
  '0': '0000',
  '1': '0001',
  '2': '0010',
  '3': '0011',
  '4': '0100',
  '5': '0101',
  '6': '0110',
  '7': '0111',
  '8': '1000',
  '9': '1001',
  A: '1010',
  B: '1011',
  C: '1100',
  D: '1101',
  E: '1110',
  F: '1111'
}

const parse = (input: string[], part: number): number => {
  const translate = (x: string[]) => parseInt(x.join(''), 2)
  let version = translate(input.splice(0, 3))
  let typeID = translate(input.splice(0, 3))

  // literal value
  if (typeID === 4) {
    let values = []
    let lastGroup = false
    do {
      let group = input.splice(0, 5)
      lastGroup = group[0] === '0'
      values.push(group.slice(1).join(''))
    } while (!lastGroup)

    return part === 1 ? version : translate(values)
  }
  let lengthTypeID = translate(input.splice(0, 1))

  // operator value
  let bitsParsed = 0
  let numSubBits = Infinity
  let packetsParsed = 0
  let numSubPackets = Infinity
  if (lengthTypeID === 0) {
    numSubBits = translate(input.splice(0, 15))
  } else if (lengthTypeID === 1) {
    numSubPackets = translate(input.splice(0, 11))
  }

  let returnVals = []
  let origLength = input.length
  while (bitsParsed < numSubBits && packetsParsed < numSubPackets) {
    returnVals.push(parse(input, part))
    packetsParsed++
    bitsParsed = origLength - input.length
  }

  if (part === 1) return version + returnVals.reduce((a, x) => a + x, 0)

  if (typeID === 0) {
    // Packets with type ID 0 are sum packets
    return returnVals.reduce((a, x) => a + x, 0)
  }
  if (typeID === 1) {
    // Packets with type ID 1 are product packets
    return returnVals.reduce((a, x) => a * x, 1)
  }
  if (typeID === 2) {
    // Packets with type ID 2 are minimum packets
    return Math.min(...returnVals)
  }
  if (typeID === 3) {
    // Packets with type ID 3 are maximum packets
    return Math.max(...returnVals)
  }
  if (typeID === 5) {
    // Packets with type ID 5 are greater than packets
    return returnVals[0] > returnVals[1] ? 1 : 0
  }
  if (typeID === 6) {
    // Packets with type ID 6 are less than packets
    return returnVals[0] < returnVals[1] ? 1 : 0
  }
  if (typeID === 7) {
    // Packets with type ID 7 are equal to packets
    return returnVals[0] === returnVals[1] ? 1 : 0
  }
}

const command: GluegunCommand = {
  name: `day${DAY}`,
  run: async toolbox => {
    const { print, readInput } = toolbox
    const lines = readInput(DAY)

    for (let line of lines) {
      let input = line
        .split('')
        .map(val => HEXTOBIN[val])
        .join('')
        .split('')
      print.info(`Part 1: ${parse([...input], 1)}`)
      print.info(`Part 2: ${parse([...input], 2)}`)
    }
  }
}

module.exports = command
