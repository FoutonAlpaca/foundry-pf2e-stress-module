export class module {
  static MODULE_ID = 'pf2e-stress'
  static MIN_STRESS = 0
  static MAX_STRESS = 10
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
}
