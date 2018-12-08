const path = require('path')
const fs = require('fs')
const program = require('commander')
const yaml = require('js-yaml')

const packageJson = require('../package.json')

// tslint:disable-next-line
const StylelintConfigClass = require('./libs/stylelint-config')

const PACKAGE_JSON = 'package.json'
const CONFIG_JS = 'stylelint.config.js'
const CONFIG_RC = '.stylelintrc'
const STYLELINT_CONFIG_PATTERN = [CONFIG_RC, CONFIG_JS, PACKAGE_JSON]

const ERR_MSG = {
  CONFIG_NOT_FOUND: `configfile not found`
}

const workingDir = process.cwd()

program
  .version(packageJson.version, '-v, --version')
  .option(
    '-i --input <path>',
    'Specify the path of stylelint-config to be used as root. (Default: Search config file from working directory.)'
  )
  .option('-o, --output <path>', 'Output the execution result to the JSON file.')
  .parse(process.argv)

const outputPath = program.output

function isExist(filePath: string) {
  try {
    // tslint:disable-next-line:no-unused-expression
    new fs.statSync(filePath)
    return true
  } catch (e) {
    console.warn(`\n> ${e.message}\n`)
    return false
  }
}

function isYaml(filePath: string) {
  try {
    parseYaml(filePath)
    return true
  } catch (e) {
    return false
  }
}

function parseYaml(filePath: string) {
  return yaml.safeLoad(fs.readFileSync(filePath, 'utf8'))
}

const configList: string[] = typeof program.input !== 'undefined' ? [program.input as string] : STYLELINT_CONFIG_PATTERN

const inputConfig: { [x: string]: any } | null = (() => {
  let stylelintConfig = null

  configList
    .map(p => path.resolve(workingDir, p))
    .filter(isExist)
    .some(configPath => {
      console.log(`> ${configPath}`)
      const isJsonOrYaml = /\.stylelintrc$/.test(configPath)
      const isPackageJson = /package\.json$/.test(configPath)
      const isJsFile = /stylelint\.config\.js$/.test(configPath)

      if (isJsonOrYaml) {
        if (isYaml) {
          stylelintConfig = parseYaml(configPath)
          return true
        }
        stylelintConfig = require(configPath)
        return true
      }

      if (isPackageJson) {
        const configPackageJson = JSON.parse(fs.readFileSync(configPath, 'utf8'))
        if ('stylelint' in configPackageJson) {
          stylelintConfig = configPackageJson.stylelint
          return true
        }
      }

      if (isJsFile) {
        stylelintConfig = require(configPath)
        return true
      }

      return false
    })
  return stylelintConfig
})()

if (!inputConfig) {
  throw new Error(ERR_MSG.CONFIG_NOT_FOUND)
}

const config = new StylelintConfigClass(inputConfig)
const rules = config.getMergedRulse()
const rulesJson = JSON.stringify(rules, null, '  ')

if (typeof outputPath !== 'undefined') {
  fs.writeFileSync(path.resolve(workingDir, outputPath), rulesJson, { encode: 'utf8' })
} else {
  console.log(rulesJson)
}

console.log(`✨ Done`)
