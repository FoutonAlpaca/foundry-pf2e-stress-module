import type { Locator, Page } from '@playwright/test';

export class BasePage {
  readonly actorsTab: Locator;
  readonly actionsTab: Locator;
  readonly chatMessagesTab: Locator;
  readonly gameSettingsTab: Locator;

  readonly stressInput: Locator;
  readonly actorStress: Locator;

  readonly rerollerLevel: Locator;
  readonly damageActorLevel: Locator;

  readonly partySheetButton: Locator;

  readonly packageList: Locator;
  readonly listItem: Locator;

  constructor(readonly page: Page) {
    // Navigation tabs
    this.actorsTab = page.getByRole('tab', { name: 'Actors' });
    this.actionsTab = page.getByRole('tab', { name: 'Actions' });
    this.chatMessagesTab = page.getByRole('tab', { name: 'Chat Messages' });
    this.gameSettingsTab = page.getByRole('tab', { name: 'Game Settings' });

    // Stress input elements
    this.stressInput = page.getByTestId('stress-input');
    this.actorStress = page.locator('header').filter({ hasText: /Stress/ }).getByTestId('actor-stress');

    // Actor selectors
    this.rerollerLevel = page.getByText('Reroller Level');
    this.damageActorLevel = page.getByText('DamageActor Level');

    // Party sheet
    this.partySheetButton = page.locator("button[data-action='openPartySheet']");

    // Module management
    this.packageList = page.locator('.package-list');
    this.listItem = page.getByRole('listitem');
  }
}
