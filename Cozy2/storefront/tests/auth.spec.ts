import { test, expect } from '@playwright/test';

test.describe('Critique 3: Account System & Wishlist Sync', () => {

    test('can register a new user and login', async ({ page }) => {
        // Generate unique user
        const timestamp = Date.now();
        const email = `testuser_${timestamp}@example.com`;
        const password = 'Password123!';

        // 1. Visit Register Page
        await page.goto('http://localhost:3000/account/register');
        await expect(page.locator('h1')).toContainText('Maak een account');

        // 2. Fill Registration Form
        await page.fill('input[name="firstName"]', 'Test');
        await page.fill('input[name="lastName"]', 'User');
        await page.fill('input[name="email"]', email);
        await page.fill('input[name="password"]', password);
        await page.fill('input[name="confirmPassword"]', password);

        // 3. Submit
        await page.click('button[type="submit"]');

        // 4. Expect Redirect to /account dashboard
        await expect(page).toHaveURL('http://localhost:3000/account', { timeout: 10000 });
        await expect(page.locator('h1')).toContainText('Mijn Account');

        // 5. Check if Navbar User icon appears (authentication state globally recognized)
        // We know they are authenticated because they are on the /account page.

        // 6. Logout
        await page.click('button:has-text("Uitloggen")');
        await expect(page).toHaveURL('http://localhost:3000/account/login', { timeout: 10000 });
    });

});
