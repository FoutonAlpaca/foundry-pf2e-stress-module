import { module } from './module.js'

export class StressDataFlagApi {
  static getFlag (document) {
    return document?.getFlag(module.MODULE_ID, module.FLAGS.StressData)
  }

  static setFlag (document, flagData) {
    document?.setFlag(module.MODULE_ID, module.FLAGS.StressData, flagData)
  }
}
