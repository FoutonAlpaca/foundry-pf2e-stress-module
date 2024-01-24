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

Hooks.on('renderPartySheetPF2e', (_, html) => {
  addStressValueToPartySheet(html);
});


function addStressValueToCharacterSheet(html) {
  const heroPointContainer = html.find('section > form > header > section.char-details');
  heroPointContainer.find('div.dots').remove();

  const stress = `
<div>
  <span class="label">${(game.i18n.localize(`${MODULE_ID}.terms.stress`))}</span>
  <span>5</span>
</div>`

  heroPointContainer.append(stress);
};

function addStressValueToPartySheet(html) {
  const memberHeaderContainer = html.find('section > form > section > div[data-tab="overview"] > div > section.member > div.data > header');
  memberHeaderContainer.find('a.hero-points').remove();

  const stress = `
<div>
  <span class="label">${(game.i18n.localize(`${MODULE_ID}.terms.stress`))}</span>
  <span>5</span>
</div>`

  memberHeaderContainer.append(stress);
};
