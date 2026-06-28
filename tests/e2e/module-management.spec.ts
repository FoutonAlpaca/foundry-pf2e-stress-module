import { test } from './fixtures';
import { expect } from '@playwright/test';
import { FoundryPage } from './page-objects/foundry-page';

test.describe('Module Management Validation', () => {
  test.beforeEach(async ({ page }) => {
    const foundry = new FoundryPage(page);
    await foundry.navigateToGameSettings();
    await foundry.manageModules();
  });

  test('module dependency libWrapper is enabled', async ({ page }) => {
    const foundry = new FoundryPage(page);
    const libWrapperRow = await foundry.findModuleByName('libWrapper');
    await expect(libWrapperRow).toBeVisible();

    await expect(await foundry.getModuleCheckbox('libWrapper')).toBeChecked();
  });

  test('Pathfinder 2e stress variant rule module is enabled with expected version', async ({ page }) => {
    const foundry = new FoundryPage(page);
    const stressModuleRow = await foundry.findModuleByName('Pathfinder 2e stress variant rule');
    await expect(stressModuleRow).toBeVisible();

    await expect(await foundry.getModuleCheckbox('Pathfinder 2e stress variant rule')).toBeChecked();

    const expectedVersion = foundry.getExpectedVersion();
    await expect(stressModuleRow.getByText(expectedVersion)).toBeVisible();

    const tooltip = page.locator("span[data-tooltip-html*='https://github.com/FoutonAlpaca/foundry-pf2e-stress-module']");
    await expect(tooltip).toBeVisible();
  });
});
