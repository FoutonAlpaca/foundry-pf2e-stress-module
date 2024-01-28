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
  const stress = `
<div>
  <span class="pf2e-stress-label">${module.localize('terms.stress')}</span>
  <input class="pf2e-stress" value="${stressValue}">
</div>`

  heroPointContainer.append(stress)
  heroPointContainer.find('div > input').on('blur', function () {
    const value = $(this).val()
    if (value !== '') {
      const parsed = parseInt(value)
      if (!isNaN(parsed)) {
        StressResourceData.setStressValueForActor(actorId, parsed)
      }
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
      <span class="label">${module.localize('terms.stress')}</span>
      <span>${stressValue}</span>
    </div>`
    const header = $(member).find('div.data > header')
    header.find('a.hero-points').remove()
    header.append(stressHtml)
  }
}
