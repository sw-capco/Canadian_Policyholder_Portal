const { test, expect } = require('@playwright/test');

test.describe('Issue #2: Secure Sign In Screen with Email/Password and Optional MFA', () => {
  test('[SIGN_IN_001] Successful sign-in with valid email and password without MFA', async ({ page }) => {
    await test.step('Navigate to /signin page', async () => {
      await page.goto('/signin');
      await expect(page).toHaveURL('/signin');
    });

    await test.step('Enter valid email in email field', async () => {
      const emailField = page.locator('#email');
      await expect(emailField).toBeVisible();
      await emailField.fill('policyholder@example.com');
    });

    await test.step('Enter valid password in password field', async () => {
      const passwordField = page.locator('#password');
      await expect(passwordField).toBeVisible();
      await passwordField.fill('password123');
    });

    await test.step('Submit the sign-in form', async () => {
      const submitButton = page.locator('button[type="submit"]');
      await submitButton.click();
    });

    await test.step('Wait for navigation to /dashboard', async () => {
      await page.waitForURL('/dashboard', { timeout: 10000 });
      await expect(page).toHaveURL('/dashboard');
    });

    await test.step('Verify dashboard page loads successfully', async () => {
      await expect(page.locator('h1')).toBeVisible();
    });
  });
});
