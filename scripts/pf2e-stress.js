import { StressDataFlagApi } from './stress-data-flag-api.js'
import { StressResourceData } from './actor-stress-resource-data.js'
import { module } from './module.js'

Hooks.once('init', () => {
  if (game.modules.get('lib-wrapper')?.active) {
    // https://github.com/foundryvtt/pf2e/blob/6bd823721d70d18552bd0bd7f36f07a804b54da7/src/module/apps/sidebar/chat-log.ts#L329
    libWrapper.register(
      module.MODULE_ID,
      'ChatLog.prototype._getEntryContextOptions',
      addRerollWithStressContextOption,
      libWrapper.WRAPPER
    )

    console.log(`${module.MODULE_ID} initalised`)
  }
})

Hooks.once('ready', () => {
  if (!game.modules.get('lib-wrapper')?.active && game.user.isGM) {
    ui.notifications.error(module.localize('errors.libWrapperRequired'), { permanent: true })
  }
})

Hooks.on('renderCharacterSheetPF2e', (sheet, html) => {
  if (sheet.object.type !== 'character') {
    return
  }

  addStressValueToCharacterSheet(sheet.object, html)
})

Hooks.on('renderPartySheetPF2e', (_, html) => {
  addStressValueToPartySheet(html)
})

Hooks.on('renderChatMessage', (message, html) => {
  addStressContextToMessage(message, html)
})

const addRerollWithStressContextOption = (wrapped) => {
  const buttons = wrapped.bind(this)()

  const canStressReroll = (li) => {
    const message = game.messages.get(li[0].dataset.messageId, { strict: true })
    const actor = message.actor?.isOfType('familiar') ? message.actor.master : message.actor
    return message.isRerollable && !!actor?.isOfType('character') && StressResourceData.canActorTakeOnMoreStress(actor.id)
  }

  buttons.push(
    {
      name: `${module.localize('terms.reroll-using-stress')}`,
      icon: `<i class="${module.STRESS_ICON}"></i>`,
      condition: canStressReroll,
      callback: async li => {
        let message = game.messages.get(li[0].dataset.messageId, { strict: true })
        const actor = message.actor?.isOfType('familiar') ? message.actor.master : message.actor
        message = await StressDataFlagApi.setWorkaroundPf2eFlag(message)

        game.pf2e.Check.rerollFromMessage(message)
        await StressResourceData.addStressToActor(actor.id)
      }
    }
  )
  return buttons
}

function addStressValueToCharacterSheet (actor, html) {
  const actorId = actor.id

  const heroPointContainer = html.find('section.char-details')
  heroPointContainer.find('div.dots').remove()

  const stressValue = StressResourceData.getStressValueForActorOrDefault(actorId)
  const inputId = `pf2e-stress-input-${actor.id}`
  const stress = `
  <div>
    <label class="pf2e-stress-label"><i class="${module.STRESS_ICON}"></i>
      ${module.localize('terms.stress')}
      <input id="${inputId}" type="number" class="pf2e-stress" value="${stressValue}" step="1" min="0" max="10">
    </label>
  </div>`

  heroPointContainer.append(stress)
  heroPointContainer.find(`#${inputId}`).on('blur', async function () {
    const value = $(this).val()
    if (value !== '') {
      await StressResourceData.setStressValueForActor(actorId, value)
    }
  })
}

function addStressValueToPartySheet (html) {
  const memberHeaderContainer = html.find('section.member')

  for (const member of memberHeaderContainer) {
    const actorWithId = member.attributes['data-actor-uuid']
    const actorId = actorWithId.value.split('.')[1]
    const stressValue = StressResourceData.getStressValueForActorOrDefault(actorId)

    const stressHtml = `
    <div>
      <label><i class="${module.STRESS_ICON}"></i>
        ${module.localize('terms.stress')}
        <span>${stressValue}</span>
      </label>
    </div>`
    const header = $(member).find('div.data > header')
    header.find('a.hero-points').remove()
    header.append(stressHtml)
  }
}

function addStressContextToMessage (message, html) {
  if (!StressDataFlagApi.getWorkaroundPf2eFlag(message)) {
    return
  }

  const flavorTextHeader = html.find('header > span.flavor-text')

  for (const flavorText of flavorTextHeader) {
    const stressIconHtml = `<i class="${module.STRESS_ICON} reroll-indicator" data-tooltip="${module.localize('terms.rerolled-using-stress')}"></i>`
    $(flavorText).find('i.reroll-indicator').replaceWith(stressIconHtml)
  }
}
