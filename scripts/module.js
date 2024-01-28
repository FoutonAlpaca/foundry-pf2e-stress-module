export class module {
  static MODULE_ID = 'pf2e-stress'

  static FLAGS = {
    StressData: 'stressData'
  }

  static localize (term) {
    return game.i18n.localize(`${module.MODULE_ID}.${term}`)
  }

  static getActorById (actorId) {
    return game.actors.get(actorId)
  }
}
