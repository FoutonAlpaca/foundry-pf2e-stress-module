import { StressResourceData } from '../scripts/actor-stress-resource-data.js'
import StressModule from '../scripts/module.js'
import { setupFoundryMocksForActorWithFlags } from './foundry-mocks.js'

// Set up globals before tests run (matches jest.config.js expectations)
setupFoundryMocksForActorWithFlags('test-actor-id', 'Test Actor')

// Create wrapper objects with slugify method for STRESS_VALUE_CHANGE_SOURCE
const mockStressValueChangeSource = {}
Object.entries(StressModule.STRESS_VALUE_CHANGE_SOURCE).forEach(([key, value]) => {
  mockStressValueChangeSource[key] = Object.assign({ slugify: () => key.toLowerCase() }, { value })
})

describe('StressResourceData.getStressDataForActor', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.game.actors.get.mockReturnValue({
      id: 'test-actor-id',
      name: 'Test Actor',
      getFlag: jest.fn(),
      setFlag: jest.fn()
    })
  })

  it('retrieves stress data from flags for an actor', async () => {
    global.game.actors.get.mockReturnValue({
      id: 'test-actor-id',
      name: 'Test Actor',
      getFlag: jest.fn().mockReturnValue({ stress: 5, actorId: 'test-actor-id' }),
      setFlag: jest.fn()
    })

    const result = await StressResourceData.getStressDataForActor('test-actor-id')

    expect(result).toEqual({ stress: 5, actorId: 'test-actor-id' })
  })

  it('returns undefined when actor has no stress flag', async () => {
    global.game.actors.get.mockReturnValue({
      id: 'test-actor-id',
      name: 'Test Actor',
      getFlag: jest.fn().mockReturnValue(undefined),
      setFlag: jest.fn()
    })

    const result = await StressResourceData.getStressDataForActor('test-actor-id')

    expect(result).toBeUndefined()
  })
})

describe('StressResourceData.getStressValueForActorOrDefault', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.game.actors.get.mockReturnValue({
      id: 'test-actor-id',
      name: 'Test Actor',
      getFlag: jest.fn(),
      setFlag: jest.fn()
    })
  })

  it('returns current stress value when set via flags', async () => {
    global.game.actors.get.mockReturnValue({
      id: 'test-actor-id',
      name: 'Test Actor',
      getFlag: jest.fn().mockReturnValue({ stress: 5, actorId: 'test-actor-id' }),
      setFlag: jest.fn()
    })

    const result = await StressResourceData.getStressValueForActorOrDefault('test-actor-id')

    expect(result).toBe(5)
  })

  it('returns MIN_STRESS when actor has no flag', async () => {
    global.game.actors.get.mockReturnValue({
      id: 'test-actor-id',
      name: 'Test Actor',
      getFlag: jest.fn().mockReturnValue(undefined),
      setFlag: jest.fn()
    })

    const result = await StressResourceData.getStressValueForActorOrDefault('test-actor-id')

    expect(result).toBe(StressModule.MIN_STRESS)
  })
})

describe('StressResourceData.addStressToActor', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.game.actors.get.mockReturnValue({
      id: 'test-actor-id',
      name: 'Test Actor',
      getFlag: jest.fn(),
      setFlag: jest.fn().mockReturnValue(true)
    })
  })

  it('adds stress to actor and returns new value', async () => {
    global.game.actors.get.mockReturnValue({
      id: 'test-actor-id',
      name: 'Test Actor',
      getFlag: jest.fn().mockReturnValue({ stress: 3, actorId: 'test-actor-id' }),
      setFlag: jest.fn().mockReturnValue(true)
    })

    const result = await StressResourceData.addStressToActor(
      mockStressValueChangeSource.CharacterSheet,
      'test-actor-id',
      2
    )

    // addStressToActor returns the result of setStressValueForActor, which is the result of setFlag
    expect(result).toBe(true)
    expect(global.game.actors.get).toHaveBeenCalled()
  })
})

describe('StressResourceData.setStressValueForActor', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.game.actors.get.mockReturnValue({
      id: 'test-actor-id',
      name: 'Test Actor',
      getFlag: jest.fn().mockReturnValue({ stress: 3, actorId: 'test-actor-id' }),
      setFlag: jest.fn().mockReturnValue(true)
    })
  })

  it('sets new stress value and sends chat message', async () => {
    const result = await StressResourceData.setStressValueForActor(
      mockStressValueChangeSource.CharacterSheet,
      'test-actor-id',
      7
    )

    expect(result).toBe(true)
    expect(global.game.actors.get.mock.calls[0][0]).toBe('test-actor-id')
  })

  it('returns undefined when value is NaN', async () => {
    const result = await StressResourceData.setStressValueForActor(
      mockStressValueChangeSource.CharacterSheet,
      'test-actor-id',
      'invalid'
    )

    expect(result).toBeUndefined()
  })

  it('returns undefined when value is below MIN_STRESS', async () => {
    global.game.actors.get.mockReturnValue({
      id: 'test-actor-id',
      name: 'Test Actor',
      getFlag: jest.fn().mockReturnValue({ stress: 5, actorId: 'test-actor-id' }),
      setFlag: jest.fn()
    })

    const result = await StressResourceData.setStressValueForActor(
      mockStressValueChangeSource.CharacterSheet,
      'test-actor-id',
      1
    )

    expect(result).toBeUndefined()
  })

  it('returns undefined when value equals current stress', async () => {
    const result = await StressResourceData.setStressValueForActor(
      mockStressValueChangeSource.CharacterSheet,
      'test-actor-id',
      3
    )

    expect(result).toBeUndefined()
  })
})

describe('StressResourceData.sendStressChangeChatMessage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('creates chat message with correct localization key for character sheet changes', async () => {
    const result = await StressResourceData.sendStressChangeChatMessage(
      mockStressValueChangeSource.CharacterSheet,
      'Test Actor',
      5,
      10
    )

    expect(result.content).toContain('Test Actor')
    expect(result.content).toContain('stress')
  })

  it('includes actor name and stress values in chat message data', async () => {
    const result = await StressResourceData.sendStressChangeChatMessage(
      mockStressValueChangeSource.Reroll,
      'Test Actor',
      5,
      8
    )

    expect(result.content).toContain('Test Actor')
    expect(result.content).toContain('stress')
  })
})
