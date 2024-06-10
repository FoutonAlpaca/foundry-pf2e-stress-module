import { module } from './module.js'
import { StressDataFlagApi } from './stress-data-flag-api.js'

export class StressResourceData {
  static getStressDataForActor (actorId) {
    return StressDataFlagApi.getFlag(module.getActorById(actorId))
  }

  static getStressValueForActorOrDefault (actorId) {
    return this.getStressDataForActor(actorId)?.stress ?? module.MIN_STRESS
  }

  static canActorTakeOnMoreStress (actorId) {
    return this.getStressValueForActorOrDefault(actorId) < module.MAX_STRESS
  }

  static addStressToActor (actorId) {
    const currentStress = this.getStressValueForActorOrDefault(actorId)
    const newStress = currentStress + 1
    return this.setStressValueForActor(actorId, newStress)
  }

  static setStressValueForActor (actorId, stressValue) {
    const value = parseInt(stressValue)
    if (isNaN(value)) {
      return
    }
    if (value < module.MIN_STRESS || value > module.MAX_STRESS) {
      return
    }

    const stressData = {
      actorId,
      stress: value
    }

    return StressDataFlagApi.setFlag(module.getActorById(actorId), stressData)
  }
}
