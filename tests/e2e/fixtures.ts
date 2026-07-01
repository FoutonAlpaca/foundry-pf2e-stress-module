import { test as base } from '@playwright/test';
import { loginAs } from '@thefehr/foundry-playwright';

export const test = base.extend({
  page: async ({ page }, use) => {
    await loginAs(page, 'Gamemaster');
    use(page);
  },
});
