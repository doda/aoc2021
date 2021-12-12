import * as fs from 'fs'

import { GluegunToolbox } from 'gluegun'

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.readInput = (day: string): string[] => {
    const { parameters } = toolbox
    let inputFile = `inputs/${day}`
    if (parameters.first === 'test') inputFile += 'test'

    return fs.readFileSync(inputFile, 'utf8').split('\n')
  }
}
