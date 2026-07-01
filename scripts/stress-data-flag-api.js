import StressModule from './module.js'

export class StressDataFlagApi {
  static getFlag (document) {
    return document?.getFlag(StressModule.MODULE_ID, StressModule.FLAGS.StressData)
  }

  static setFlag (document, flagData) {
    return document?.setFlag(StressModule.MODULE_ID, StressModule.FLAGS.StressData, flagData)
  }

  static getWorkaroundPf2eFlag (document) {
    return document?.getFlag(StressModule.FLAGS.Pf2e, StressModule.MODULE_ID)?.isRerollFromStress ?? false
  }

  static setWorkaroundPf2eFlag (document) {
    // Ideally this would be stored to the module flag and not extending the main pf2e flags
    // This is needed as the reroll only clones flags.pf2e, all other flags are not copied
    // https://github.com/foundryvtt/pf2e/blob/c77984e99cb2de5f3747f4ef1ae896a79410c9dd/src/module/system/check/check.ts#L462

    const flagData = {
      isRerollFromStress: true
    }

    return document?.setFlag(StressModule.FLAGS.Pf2e, StressModule.MODULE_ID, flagData)
  }
}
