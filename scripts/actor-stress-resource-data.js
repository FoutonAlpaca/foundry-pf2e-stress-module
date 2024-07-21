import { module } from './module.js'
import { StressDataFlagApi } from './stress-data-flag-api.js'

export class StressResourceData {
  static sendStressChangeChatMessage (changeType, actorName, stressValue) {
    const localizationKey = module.getStressMessageLocalizationKey(changeType)
    const localizationData = {
      actor: actorName,
      stressValue
    }

    const chatData = {
      content: module.localize(localizationKey, localizationData)
    }
    return ChatMessage.create(chatData)
  }

  static getStressDataForActor (actorId) {
    return StressDataFlagApi.getFlag(module.getActorById(actorId))
  }

  static getStressValueForActorOrDefault (actorId) {
    return this.getStressDataForActor(actorId)?.stress ?? module.MIN_STRESS
  }

  static canActorTakeOnMoreStress (actorId) {
    return this.getStressValueForActorOrDefault(actorId) < module.MAX_STRESS
  }

  static addStressToActor (changeType, actorId, amount = 1) {
    const currentStress = this.getStressValueForActorOrDefault(actorId)
    const newStress = currentStress + amount
    return this.setStressValueForActor(changeType, actorId, newStress)
  }

  static setStressValueForActor (changeType = module.STRESS_VALUE_CHANGE_SOURCE.Unspecified, actorId, stressValue) {
    const value = parseInt(stressValue)
    if (isNaN(value)) {
      return
    }
    if (value < module.MIN_STRESS || value > module.MAX_STRESS) {
      return
    }
    const actor = module.getActorById(actorId)
    const currentStress = this.getStressValueForActorOrDefault(actorId)

    if (currentStress === value) {
      return
    }

    this.sendStressChangeChatMessage(changeType, actor.name, value)

    const stressData = {
      actorId,
      stress: value
    }

    return StressDataFlagApi.setFlag(module.getActorById(actorId), stressData)
  }
}
