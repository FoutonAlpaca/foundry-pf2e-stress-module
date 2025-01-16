export class module {
  static MODULE_ID = 'pf2e-stress'
  static MIN_STRESS = 0
  static STRESS_ICON = 'fa-solid fa-brain'

  static FLAGS = {
    Pf2e: 'pf2e',
    StressData: 'stressData'
  }

  static ACTOR_TYPES = {
    Character: 'character',
    Familiar: 'familiar'
  }

  static CONDITIONS = {
    Condition: 'condition',
    Dying: 'dying',
    Wounded: 'wounded'
  }

  static STRESS_VALUE_CHANGE_SOURCE = {
    CharacterSheet: 'characterSheet',
    Reroll: 'reroll',
    Dying: 'dying',
    Undo: 'undo',
    Unspecified: 'unspecified'
  }

  static DICE_ROLL_CHECK_TYPE = {
    AttackRoll: 'attack-roll',
    Check: 'check',
    CounteractCheck: 'counteract-check',
    FlatCheck: 'flat-check',
    Initiative: 'initiative',
    PerceptionCheck: 'perception-check',
    SavingThrow: 'saving-throw',
    SkillCheck: 'skill-check'
  }

  static getStressMessageLocalizationKey (changeType) {
    const defaultMessageKey = 'charactersheet'

    if (changeType === undefined || changeType === this.STRESS_VALUE_CHANGE_SOURCE.Unspecified) {
      return `messages.${defaultMessageKey}`
    }

    return `messages.${changeType.slugify({ lowercase: true })}`
  }

  static localize (term, data = undefined) {
    const key = `${module.MODULE_ID}.${term}`

    if (data !== undefined) {
      return game.i18n.format(key, data)
    }

    return game.i18n.localize(key)
  }

  static getActorById (actorId) {
    return game.actors.get(actorId)
  }

  static registerRerollCostConfigurationSettings () {
    for (const rollCheckType of Object.values(module.DICE_ROLL_CHECK_TYPE)) {
      const name = module.toRerollSettingKey(rollCheckType)
      game.settings.register(module.MODULE_ID, name, {
        name: module.localize(`settings.stress-reroll-cost.${rollCheckType}.name`),
        hint: module.localize(`settings.stress-reroll-cost.${rollCheckType}.hint`),
        scope: 'world',
        config: true,
        type: Number,
        default: 1
      })
    }
  }

  static toRerollSettingKey (rollCheckType) {
    return `reroll-cost-${rollCheckType}`
  }

  static getRerollCostForRollCheckType (rollCheckType) {
    const rollCheckTypes = Object.values(module.DICE_ROLL_CHECK_TYPE)
    if (!rollCheckTypes.includes(rollCheckType)) {
      return 1
    }

    const name = module.toRerollSettingKey(rollCheckType)
    return game.settings.get(module.MODULE_ID, name)
  }
}
