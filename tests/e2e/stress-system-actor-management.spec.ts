import { test } from './fixtures';
import { expect } from '@playwright/test';
import { FoundryPage } from './page-objects/foundry-page';

test.describe('Stress System Actor Management', () => {
  test.beforeEach(async ({ page }) => {
    const foundry = new FoundryPage(page);
    await foundry.navigateToActors();
    await page.getByRole('listitem').filter({ hasText: 'Bob Level' }).nth(1).click();
  });

  test.describe('Character Sheet Stress Input', () => {
    test('Stress shown on character sheet, updates reflected in chat and party screen', async ({ page }) => {
      const foundry = new FoundryPage(page);
      const stressInput = foundry.stressInput;

      await expect(stressInput).toBeVisible();
      await expect(stressInput).toHaveAttribute('type', 'number');

      const currentValueString = await stressInput.inputValue();
      const currentStress = parseInt(currentValueString, 10) || -1;
      expect(currentStress).not.toBe(-1);

      const updatedStressValue = currentStress < 5 ? currentStress + 1 : currentStress - 1;
      const updatedStressValueString = updatedStressValue.toString();
      await stressInput.fill(updatedStressValueString);
      await page.click('body');

      const newStressValue = await stressInput.inputValue();
      expect(newStressValue).toBe(updatedStressValueString);

      const stressChatMessage = foundry.findChatMessage("Bob's stress");
      await expect(stressChatMessage).toContainText(currentValueString);
      await expect(stressChatMessage).toContainText(updatedStressValueString);

      await foundry.partySheetButton.click();

      const partyStressValue = page.locator('header').filter({ hasText: 'Bob Stress' }).getByTestId('actor-stress');
      expect(await partyStressValue.textContent()).toBe(updatedStressValueString);
    });
  });
});
