import * as fs from 'fs'

import { GluegunToolbox } from 'gluegun'

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.readInput = (day: string): string[] => {
    const { parameters } = toolbox
    let param = parameters.first
    let inputFile = `inputs/${day}`
    if (param === 'test') inputFile += 'test'

    return fs
      .readFileSync(inputFile, 'utf8')
      .split('\n')
      .filter(line => line.length > 0)
  }
}
