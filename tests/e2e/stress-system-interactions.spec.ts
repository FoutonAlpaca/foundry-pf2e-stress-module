import { test } from './fixtures';
import { expect } from '@playwright/test';
import { FoundryPage } from './page-objects/foundry-page';

test.describe('Stress system interactions', () => {
  test.beforeEach(async ({ page }) => {
    const foundry = new FoundryPage(page);
    await foundry.navigateToActors();
  });

  test.describe('Reroll mechanic', () => {
    test('Stress updated on reroll', async ({ page }) => {
      const foundry = new FoundryPage(page);
      await foundry.selectRerollerLevel();
      const stressInput = foundry.stressInput;

      await stressInput.fill('0');
      await stressInput.blur();
      await foundry.navigateToActions();
      await page.getByRole('button', { name: 'Strike A +' }).click({ modifiers: ['Shift'] });

      await foundry.navigateToChatMessages();
      const rerollerMessage = foundry.findChatMessage('Reroller', "Melee strike: Unarmed Attack");
      await rerollerMessage.click({ button: 'right' });
      await page.getByRole('listitem').filter({ hasText: /^Reroll using stress$/ }).click();
      await foundry.stressInput.click();

      const currentValueString = await foundry.stressInput.inputValue();
      const currentStress = parseInt(currentValueString, 10) || -1;
      expect(currentStress).toBe(1);
    });
  });

  test.describe('Stress on zero hp', () => {
    test('Stress added when reduced to zero HP based on wounded condition', async ({ page }) => {
      const foundry = new FoundryPage(page);
      await foundry.selectDamageActorLevel();

      await foundry.stressInput.fill('0');
      await foundry.stressInput.blur();
      await page.getByRole('textbox', { name: 'Current HP' }).fill('1');

      const diceRollArea = page.getByRole('textbox', { name: 'Chat' });
      await diceRollArea.fill('/roll 2d4');
      await diceRollArea.press('Enter');
      await foundry.navigateToChatMessages();
      const damageRollMessage = foundry.findChatMessage('DamageActor', '2d4');
      await expect(damageRollMessage).toBeVisible();
      await damageRollMessage.locator('.damage-application button[data-action="applyDamage"]').first().click();

      const reducedToZeroMessage = foundry.findChatMessage('DamageActor', 'reduced to zero HP');
      await expect(reducedToZeroMessage).toBeVisible();

      const currentValueString = await foundry.stressInput.inputValue();
      const currentStress = parseInt(currentValueString, 10) || -1;
      expect(currentStress).toBe(2);
    });
  });
});
