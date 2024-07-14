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
    Dying: 'dying'
  }

  static localize (term) {
    return game.i18n.localize(`${module.MODULE_ID}.${term}`)
  }

  static getActorById (actorId) {
    return game.actors.get(actorId)
  }
}
