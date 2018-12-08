const merge = require('lodash').merge

type RuleSpec = null | number | boolean | any[]

interface IStylelintRules {
  [x: string]: RuleSpec
}

interface IStylelintrc {
  [x: string]: any
  extends: string[]
  rules: IStylelintRules
}

class StylelintConfig {
  private extendsTmp: any[] = []
  private rulesTmp: { [x: string]: any } = {}

  public constructor(stylelintrc: IStylelintrc | string) {
    if (typeof stylelintrc === 'string') {
      // tslint:disable-next-line
      stylelintrc = JSON.parse(stylelintrc) as IStylelintrc
    }

    this.extendsTmp = []

    this.rulesTmp = {}

    if ('extends' in stylelintrc) {
      stylelintrc.extends.forEach(moduleName => {
        const rc = require(moduleName)
        this.extendsTmp.push(new StylelintConfig(rc))
      })
    }

    if ('rules' in stylelintrc) {
      this.rulesTmp = { ...stylelintrc.rules }
    }
  }

  public getExtendsRules() {
    const res = this.extendsTmp
      .map(rc => rc.getMergedRulse())
      .reduce((acm, rules) => {
        const r = merge({}, acm, rules)
        return r
      }, {})
    return res
  }

  public getMergedRulse(): IStylelintRules {
    return merge({}, this.getExtendsRules(), { ...this.rulesTmp })
  }
}

module.exports = StylelintConfig
