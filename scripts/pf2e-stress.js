const MODULE_ID = 'pf2e-stress';

Hooks.once('init', () => {
  CONFIG.debug.hooks = true;

  console.log(`${MODULE_ID} initalised`);
});

Hooks.on('renderCharacterSheetPF2e', (sheet, html) => {
  if (sheet.object.type !== 'character') {
    return;
  }

  addStressValueToCharacterSheet(html);
});


function addStressValueToCharacterSheet(html) {
  const heroPointContainer = html.find('section > form > header > section.char-details');

  console.log('found' + heroPointContainer);

  // todo localize
  const stress = `
<div class="dots">
  <span class="label">Stress</span>
  <span>5</span>
</div>
  `

  heroPointContainer.append(stress);
};
