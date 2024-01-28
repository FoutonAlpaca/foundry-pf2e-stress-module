import { module } from './module.js'
import { StressDataFlagApi } from './stress-data-flag-api.js'

export class StressResourceData {
  static getStressDataForActor (actorId) {
    return StressDataFlagApi.getFlag(module.getActorById(actorId))
  }

  static getStressValueForActorOrDefault (actorId) {
    return this.getStressDataForActor(actorId)?.stress ?? 0
  }

  static setStressValueForActor (actorId, stressValue) {
    const stressData = {
      actorId,
      stress: stressValue
    }

    return StressDataFlagApi.setFlag(module.getActorById(actorId), stressData)
  }
}
