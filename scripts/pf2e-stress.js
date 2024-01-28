import { StressResourceData } from './actor-stress-resource-data.js'
import { module } from './module.js'

Hooks.once('init', () => {
  CONFIG.debug.hooks = true

  console.log(`${module.MODULE_ID} initalised`)
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

function addStressValueToCharacterSheet (actor, html) {
  const actorId = actor.id

  const heroPointContainer = html.find('section.char-details')
  heroPointContainer.find('div.dots').remove()

  const stressValue = StressResourceData.getStressValueForActorOrDefault(actorId)
  const inputId = `pf2e-stress-input-${actor.id}`
  const stress = `
<div>
  <label class="pf2e-stress-label">${module.localize('terms.stress')}
    <input id="${inputId}" type="number" class="pf2e-stress" value="${stressValue}" step="1" min="0" max="10">
  </label>
</div>`

  heroPointContainer.append(stress)
  heroPointContainer.find(`#${inputId}`).on('blur', function () {
    const value = $(this).val()
    if (value !== '') {
      StressResourceData.setStressValueForActor(actorId, value)
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
      <label>${module.localize('terms.stress')}
        <span>${stressValue}</span>
      </label>
    </div>`
    const header = $(member).find('div.data > header')
    header.find('a.hero-points').remove()
    header.append(stressHtml)
  }
}
