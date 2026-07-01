import StressModule from '../scripts/module.js'
import { setupFoundryMocks } from './foundry-mocks.js'

setupFoundryMocks()

// Create wrapper objects with slugify method for STRESS_VALUE_CHANGE_SOURCE
const mockStressValueChangeSource = {}
Object.entries(StressModule.STRESS_VALUE_CHANGE_SOURCE).forEach(([key, value]) => {
  mockStressValueChangeSource[key] = Object.assign({ slugify: () => key.toLowerCase() }, { value })
})

describe('StressModule.MODULE_ID', () => {
  it('has correct module ID', () => {
    expect(StressModule.MODULE_ID).toBe('pf2e-stress')
  })
})

describe('StressModule.MIN_STRESS', () => {
  it('has correct minimum stress value', () => {
    expect(StressModule.MIN_STRESS).toBe(0)
  })
})

describe('StressModule.STRESS_ICON', () => {
  it('has correct stress icon class', () => {
    expect(StressModule.STRESS_ICON).toBe('fa-solid fa-brain')
  })
})

describe('StressModule.FLAGS', () => {
  it('has correct flag definitions', () => {
    expect(StressModule.FLAGS.Pf2e).toBe('pf2e')
    expect(StressModule.FLAGS.StressData).toBe('stressData')
  })
})

describe('StressModule.ACTOR_TYPES', () => {
  it('has correct actor type definitions', () => {
    expect(StressModule.ACTOR_TYPES.Character).toBe('character')
    expect(StressModule.ACTOR_TYPES.Familiar).toBe('familiar')
  })
})

describe('StressModule.CONDITIONS', () => {
  it('has correct condition definitions', () => {
    expect(StressModule.CONDITIONS.Condition).toBe('condition')
    expect(StressModule.CONDITIONS.Dying).toBe('dying')
    expect(StressModule.CONDITIONS.Wounded).toBe('wounded')
  })
})

describe('StressModule.STRESS_VALUE_CHANGE_SOURCE', () => {
  it('has correct change source definitions', () => {
    expect(StressModule.STRESS_VALUE_CHANGE_SOURCE.CharacterSheet).toBe('characterSheet')
    expect(StressModule.STRESS_VALUE_CHANGE_SOURCE.Reroll).toBe('reroll')
    expect(StressModule.STRESS_VALUE_CHANGE_SOURCE.Dying).toBe('dying')
    expect(StressModule.STRESS_VALUE_CHANGE_SOURCE.Undo).toBe('undo')
    expect(StressModule.STRESS_VALUE_CHANGE_SOURCE.Unspecified).toBe('unspecified')
  })
})

describe('StressModule.DICE_ROLL_CHECK_TYPE', () => {
  it('has correct dice roll check type definitions', () => {
    expect(StressModule.DICE_ROLL_CHECK_TYPE.AttackRoll).toBe('attack-roll')
    expect(StressModule.DICE_ROLL_CHECK_TYPE.Check).toBe('check')
    expect(StressModule.DICE_ROLL_CHECK_TYPE.CounteractCheck).toBe('counteract-check')
    expect(StressModule.DICE_ROLL_CHECK_TYPE.FlatCheck).toBe('flat-check')
    expect(StressModule.DICE_ROLL_CHECK_TYPE.Initiative).toBe('initiative')
    expect(StressModule.DICE_ROLL_CHECK_TYPE.PerceptionCheck).toBe('perception-check')
    expect(StressModule.DICE_ROLL_CHECK_TYPE.SavingThrow).toBe('saving-throw')
    expect(StressModule.DICE_ROLL_CHECK_TYPE.SkillCheck).toBe('skill-check')
  })
})

describe('StressModule.getActorById', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.game.actors.get.mockReturnValue({
      id: 'test-actor-id',
      name: 'Test Actor'
    })
  })

  it('returns actor from game.actors when id exists', () => {
    const result = StressModule.getActorById('test-actor-id')
    expect(result).toEqual(global.game.actors.get('test-actor-id'))
  })

  it('returns undefined for non-existent actor', () => {
    global.game.actors.get.mockReturnValue(undefined)

    const result = StressModule.getActorById('nonexistent')
    expect(result).toBeUndefined()
  })
})

describe('StressModule.toRerollSettingKey', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('converts roll check type to setting key format', () => {
    expect(StressModule.toRerollSettingKey('attack-roll')).toBe('reroll-cost-attack-roll')
    expect(StressModule.toRerollSettingKey('saving-throw')).toBe('reroll-cost-saving-throw')
  })

  it('handles invalid roll check types gracefully', () => {
    const result = StressModule.toRerollSettingKey('invalid-type')
    expect(result).toBeDefined()
    expect(result).toBe('reroll-cost-invalid-type')
  })
})

describe('StressModule.getStressMessageLocalizationKey', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns charactersheet for unspecified change type', () => {
    expect(StressModule.getStressMessageLocalizationKey(undefined)).toBe('messages.charactersheet')
    expect(StressModule.getStressMessageLocalizationKey(null)).toBe('messages.charactersheet')
  })

  it('returns messages with slugified key for valid change types', () => {
    const result = StressModule.getStressMessageLocalizationKey(mockStressValueChangeSource.CharacterSheet)
    expect(result).toBe('messages.charactersheet')
  })

  it('returns messages with slugified key for reroll type', () => {
    const result = StressModule.getStressMessageLocalizationKey(mockStressValueChangeSource.Reroll)
    expect(result).toBe('messages.reroll')
  })

  it('returns messages with slugified key for dying type', () => {
    const result = StressModule.getStressMessageLocalizationKey(mockStressValueChangeSource.Dying)
    expect(result).toBe('messages.dying')
  })

  it('returns messages with slugified key for undo type', () => {
    const result = StressModule.getStressMessageLocalizationKey(mockStressValueChangeSource.Undo)
    expect(result).toBe('messages.undo')
  })
})

describe('StressModule.localize', () => {
  it('formats localization key with provided data object', () => {
    global.game.i18n.format.mockClear()
    global.game.i18n.format.mockImplementation((key, data) => `Localized ${data ? JSON.stringify(data) : ''}`)
    const result = StressModule.localize('testKey', { actor: 'Test Actor' })

    expect(global.game.i18n.format).toHaveBeenCalledWith(
      `${StressModule.MODULE_ID}.testKey`,
      { actor: 'Test Actor' }
    )
    expect(result).toBe('Localized {"actor":"Test Actor"}')
  })

  it('calls i18n.localize when no data provided', () => {
    global.game.i18n.format.mockClear()
    global.game.i18n.localize.mockClear()
    global.game.i18n.localize.mockImplementation(key => `Localized ${key}`)
    StressModule.localize('testKey')

    expect(global.game.i18n.localize).toHaveBeenCalledWith(`${StressModule.MODULE_ID}.testKey`)
  })
})

describe('StressModule.registerRerollCostConfigurationSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('registers reroll cost settings for each dice roll check type', () => {
    global.game.settings.get.mockReturnValue(1) // default value for all settings
    global.game.i18n.format.mockClear()
    global.game.i18n.format.mockImplementation((key, data) => `Localized ${data ? JSON.stringify(data) : ''}`)

    const registerCalls = []
    global.game.settings.register.mockImplementation((moduleId, settingName, options) => {
      registerCalls.push({ name: options.name, hint: options.hint })
    })

    StressModule.registerRerollCostConfigurationSettings()

    expect(global.game.settings.register).toHaveBeenCalledTimes(Object.keys(StressModule.DICE_ROLL_CHECK_TYPE).length)

    registerCalls.forEach(call => {
      expect(call.name).toBeDefined()
      expect(call.name).toContain('stress-reroll')
    })
  })

  it('registers settings with correct scope and type', () => {
    global.game.settings.get.mockReturnValue(1)
    global.game.i18n.format.mockClear()
    global.game.i18n.format.mockImplementation((key, data) => `Localized ${data ? JSON.stringify(data) : ''}`)

    const registerCalls = []
    global.game.settings.register.mockImplementation((moduleId, settingName, options) => {
      registerCalls.push({ name: options.name, hint: options.hint })
    })

    StressModule.registerRerollCostConfigurationSettings()

    expect(global.game.settings.register).toHaveBeenCalledTimes(Object.keys(StressModule.DICE_ROLL_CHECK_TYPE).length)
  })

  it('localizes setting names and hints correctly', () => {
    global.game.settings.get.mockReturnValue(1) // default value for all settings
    global.game.i18n.format.mockClear()
    global.game.i18n.format.mockImplementation((key, data) => `Localized ${data ? JSON.stringify(data) : ''}`)

    const registerCalls = []
    global.game.settings.register.mockImplementation((moduleId, settingName, options) => {
      registerCalls.push({ name: options.name, hint: options.hint })
    })

    StressModule.registerRerollCostConfigurationSettings()

    const calls = global.game.settings.register.mock.calls
    calls.forEach(([_, __, options]) => {
      expect(options.name).toBeDefined()
      expect(options.hint).toBeDefined()
    })
  })
})

describe('StressModule.getRerollCostForRollCheckType', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.game.settings.get.mockReturnValue(1)
  })

  it('returns configured cost for valid roll check types', () => {
    expect(StressModule.getRerollCostForRollCheckType('attack-roll')).toBe(1)
    expect(StressModule.getRerollCostForRollCheckType('saving-throw')).toBe(1)
  })

  it('returns default cost of 1 for invalid roll check types', () => {
    const result = StressModule.getRerollCostForRollCheckType('invalid-type')
    expect(result).toBe(1)
  })

  it('uses settings fallback when available', () => {
    global.game.settings.get.mockImplementation((moduleId, settingName) => {
      const key = `${moduleId}.${settingName}`
      if (key === 'pf2e-stress.reroll-cost-attack-roll') return 3
      return 1
    })

    expect(StressModule.getRerollCostForRollCheckType('attack-roll')).toBe(3)
  })
})
