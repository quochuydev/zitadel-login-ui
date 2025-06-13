/* eslint-disable notice/notice */

import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

test.describe.configure({ mode: 'parallel' });

const appUrl = 'http://localhost:3333';

test.beforeEach(async ({ page }: { page: Page }) => {
  await page.goto(`${appUrl}/en/login`);
});

test.describe('Login', () => {
  test('should authenticate me successfully and go to home page', async ({
    page,
  }) => {
    const username = page.getByPlaceholder('Username');
    await username.fill('e2e');

    const password = page.getByPlaceholder('Password');
    await password.fill('E2e@123456');

    const loginButton = page.getByText('Log in');
    await loginButton.click();

    await page.waitForURL(`${appUrl}/en`);

    expect(true).toBeTruthy();
  });
});
