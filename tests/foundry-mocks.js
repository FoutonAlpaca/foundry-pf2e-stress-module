// Shared Foundry VTT mock helpers for tests
// Import this in any test file that needs foundry mocks

export function setupFoundryMocks () {
  // Set up globals before tests run (matches jest.config.js expectations)
  global.window = global.window || {}
  global.window.foundryVTT = global.window.foundryVTT || {}

  const mockGame = {
    actors: {
      get: jest.fn()
    },
    i18n: {
      format: jest.fn(),
      localize: jest.fn()
    },
    settings: {
      register: jest.fn(),
      get: jest.fn()
    }
  }

  global.game = mockGame
  global.ChatMessage = {
    create: jest.fn((chatData) => ({
      content: chatData?.content || '',
      sendToUser: true,
      _id: 'chat-message-id'
    }))
  }
}

export function setupFoundryMocksWithDefaults () {
  // Set up globals with default implementations
  global.window = global.window || {}
  global.window.foundryVTT = global.window.foundryVTT || {}

  const mockGame = {
    actors: {
      get: jest.fn().mockReturnValue({
        id: 'test-actor-id',
        name: 'Test Actor'
      })
    },
    i18n: {
      format: jest.fn(),
      localize: jest.fn()
    },
    settings: {
      register: jest.fn(),
      get: jest.fn()
    }
  }

  global.game = mockGame
  global.ChatMessage = {
    create: jest.fn((chatData) => ({
      content: chatData?.content || '',
      sendToUser: true,
      _id: 'chat-message-id'
    }))
  }
}

export function setupFoundryMocksForActorWithFlags (actorId, actorName) {
  // Set up globals with actor that has getFlag/setFlag methods
  global.window = global.window || {}
  global.window.foundryVTT = global.window.foundryVTT || {}

  const mockGame = {
    actors: {
      get: jest.fn().mockReturnValue({
        id: actorId,
        name: actorName,
        getFlag: jest.fn(),
        setFlag: jest.fn()
      })
    },
    i18n: {
      format: jest.fn((key, data) => {
        if (data) {
          const parts = key.split('.')
          const suffix = parts.slice(1).join('.')
          return `${data.actor} stress changed from ${data.oldValue} to ${data.stressValue} (${suffix})`
        }
        return ''
      }),
      localize: jest.fn()
    },
    settings: {
      register: jest.fn(),
      get: jest.fn()
    }
  }

  global.game = mockGame
  global.ChatMessage = {
    create: jest.fn((chatData) => ({
      content: chatData?.content || '',
      sendToUser: true,
      _id: 'chat-message-id'
    }))
  }
}
