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
    const value = parseInt(stressValue)
    if (isNaN(value)) {
      return
    }
    if (value < 0 || value > 10) {
      return
    }

    const stressData = {
      actorId,
      stress: value
    }

    return StressDataFlagApi.setFlag(module.getActorById(actorId), stressData)
  }
}
