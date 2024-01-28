import { module } from './module.js'

export class StressResourceData {
  static getStressDataForActor (actorId) {
    return game.actors.get(actorId)?.getFlag(module.MODULE_ID, module.FLAGS.StressData)
  }

  static setStressDataForActor (actorId, stressValue) {
    const stressData = {
      actorId,
      stress: stressValue
    }

    return game.actors.get(actorId)?.setFlag(module.MODULE_ID, module.FLAGS.StressData, stressData)
  }

  static get stressDataForAllActors () {
    const allStressData = game.actors.reduce((accumulator, actor) => {
      const actorStressData = this.getStressDataForActor(actor.object.id)

      return {
        ...accumulator,
        ...actorStressData
      }
    }, {})

    return allStressData
  }
}
