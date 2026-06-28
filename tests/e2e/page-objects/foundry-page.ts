import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';
import fs from 'fs';
import path from 'path';

export class FoundryPage extends BasePage {
  constructor(readonly page: Page) {
    super(page);
  }

  // Stress input methods
  async setStress(value: string): Promise<void> {
    await this.stressInput.fill(value);
    await this.stressInput.blur();
  }

  async getStressValue(): Promise<number> {
    const value = await this.stressInput.inputValue();
    return parseInt(value, 10) || -1;
  }

  // Actor selection helpers
  async selectRerollerLevel(): Promise<void> {
    await this.rerollerLevel.click();
  }

  async selectDamageActorLevel(): Promise<void> {
    await this.damageActorLevel.click();
    await this.page.locator('body').press('Tab');
  }

  // Tab navigation helpers
  async navigateToActors(): Promise<void> {
    await this.actorsTab.click();
  }

  async navigateToActions(): Promise<void> {
    await this.actionsTab.click();
  }

  async navigateToChatMessages(): Promise<void> {
    await this.chatMessagesTab.click();
  }

  async navigateToGameSettings(): Promise<void> {
    await this.gameSettingsTab.click();
  }

  // Module management helpers
  async manageModules(): Promise<void> {
    await this.page.getByRole('button', { name: 'Manage Modules' }).click();
  }

  async findModuleByName(moduleName: string): Promise<Locator> {
    return this.listItem.filter({ hasText: moduleName });
  }

  async getModuleCheckbox(moduleName: string): Promise<Locator> {
    return this.listItem.filter({ hasText: moduleName }).getByRole('checkbox');
  }

  findChatMessage(senderName: string, contentFilter = ''): Locator {
    return this.page.locator('li.chat-message:has-text("' + senderName + '"):has-text("' + String(contentFilter) + '")')
      .last();
  }

  findMessageById(messageId: string): Locator {
    return this.page.locator(`[data-message-id="${messageId}"]`);
  }

  async getModuleVersion(moduleName: string): Promise<string | null> {
    const moduleRow = await this.findModuleByName(moduleName);
    const versionLocator = moduleRow.getByText(/v?\d+\.\d+\.\d+/g);

    return versionLocator.textContent();
  }

  getExpectedVersion(): string {
    const path = new URL('../../../module.json', import.meta.url);
    const moduleJson = JSON.parse(fs.readFileSync(path, 'utf8'));

    if (moduleJson === undefined || moduleJson.version === undefined) {
      throw new Error(`Unable to read module.json or version field is missing in ${path}`);
    }

    return moduleJson.version;
  }
}
