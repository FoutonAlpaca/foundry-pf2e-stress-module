import { StressDataFlagApi } from '../scripts/stress-data-flag-api.js'
import { setupFoundryMocks } from './foundry-mocks.js'

setupFoundryMocks()

const mockDocument = {
  getFlag: jest.fn(),
  setFlag: jest.fn()
}

describe('StressDataFlagApi.getFlag', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockDocument.getFlag.mockReturnValue({ stress: 5 })
  })

  it('returns the flag value when document exists and has the flag', () => {
    const result = StressDataFlagApi.getFlag(mockDocument)
    expect(result).toEqual({ stress: 5 })
  })

  it('returns undefined when document does not exist', () => {
    mockDocument.getFlag.mockReturnValue(undefined)

    const result = StressDataFlagApi.getFlag(null)
    expect(result).toBeUndefined()
  })
})

describe('StressDataFlagApi.setFlag', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockDocument.setFlag.mockResolvedValue({ success: true, actorId: 'test-id' })
  })

  it('sets the flag with correct data on document call', async () => {
    const stressData = { stress: 10 }

    await StressDataFlagApi.setFlag(mockDocument, stressData)

    expect(mockDocument.setFlag).toHaveBeenCalledWith('pf2e-stress', 'stressData', stressData)
  })
})

describe('StressDataFlagApi.getWorkaroundPf2eFlag', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockDocument.getFlag.mockReturnValue({ isRerollFromStress: true })
  })

  it('returns true when workaround flag exists on pf2e flags', () => {
    const result = StressDataFlagApi.getWorkaroundPf2eFlag(mockDocument)
    expect(result).toBe(true)
  })

  it('returns false when workaround flag does not exist', () => {
    mockDocument.getFlag.mockReturnValue({})

    const result = StressDataFlagApi.getWorkaroundPf2eFlag(mockDocument)
    expect(result).toBe(false)
  })
})

describe('StressDataFlagApi.setWorkaroundPf2eFlag', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockDocument.setFlag.mockResolvedValue({ success: true, actorId: 'test-id' })
  })

  it('sets the workaround flag on pf2e flags with correct data', async () => {
    await StressDataFlagApi.setWorkaroundPf2eFlag(mockDocument)

    expect(mockDocument.setFlag).toHaveBeenCalledWith(
      'pf2e',
      'pf2e-stress',
      expect.objectContaining({ isRerollFromStress: true })
    )
  })
})
