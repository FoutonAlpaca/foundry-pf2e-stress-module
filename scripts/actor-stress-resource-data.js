import { StressModule } from './module.js'
import { StressDataFlagApi } from './stress-data-flag-api.js'

export class StressResourceData {
  static sendStressChangeChatMessage (changeType, actorName, oldValue, stressValue) {
    const localizationKey = StressModule.getStressMessageLocalizationKey(changeType)
    const localizationData = {
      actor: actorName,
      oldValue,
      stressValue
    }

    const chatData = {
      content: StressModule.localize(localizationKey, localizationData)
    }
    return ChatMessage.create(chatData)
  }

  static getStressDataForActor (actorId) {
    return StressDataFlagApi.getFlag(StressModule.getActorById(actorId))
  }

  static getStressValueForActorOrDefault (actorId) {
    return this.getStressDataForActor(actorId)?.stress ?? StressModule.MIN_STRESS
  }

  static addStressToActor (changeType, actorId, amount = 1) {
    const currentStress = this.getStressValueForActorOrDefault(actorId)
    const newStress = currentStress + amount
    return this.setStressValueForActor(changeType, actorId, newStress)
  }

  static setStressValueForActor (changeType = StressModule.STRESS_VALUE_CHANGE_SOURCE.Unspecified, actorId, stressValue) {
    const value = parseInt(stressValue)
    if (isNaN(value)) {
      return
    }
    if (value < StressModule.MIN_STRESS) {
      return
    }
    const actor = StressModule.getActorById(actorId)
    const currentStress = this.getStressValueForActorOrDefault(actorId)

    if (currentStress === value) {
      return
    }

    this.sendStressChangeChatMessage(changeType, actor.name, currentStress, value)

    const stressData = {
      actorId,
      stress: value
    }

    return StressDataFlagApi.setFlag(StressModule.getActorById(actorId), stressData)
  }
}
