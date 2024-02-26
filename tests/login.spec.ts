import { test, expect } from '@playwright/test';
import { loginData } from '../test-data/login.data';

test.describe('User login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('login with correct credentials', async ({ page }) => {
    // Arrange
    const userID = loginData.userID;
    const userPassword = loginData.userPassword;
    const expectedUserName = 'Jan Demobankowy';
    // Act
    await page.getByTestId('login-input').fill(userID);
    await page.getByTestId('password-input').fill(userPassword);
    await page.getByTestId('login-button').click();
    // Assert
    await expect(page.getByTestId('user-name')).toHaveText(expectedUserName);
  });

  test('login with incorrect credentials - username', async ({ page }) => {
    // Arrange
    const incorrectUserID = 'ghost';
    const expectedErrorMessageUserID = 'identyfikator ma min. 8 znaków';
    // Act
    await page.getByTestId('login-input').fill(incorrectUserID);
    await page.getByTestId('password-input').click();
    // Assert
    await expect(page.getByTestId('error-login-id')).toHaveText(expectedErrorMessageUserID);
  });

  test('login with incorrect credentials - password', async ({ page }) => {
    // Arrange
    const userID = loginData.userID;
    const incorrectUserPassword = '1234';
    const expectErrorMessageUserPassword = 'hasło ma min. 8 znaków';
    // Act
    await page.getByTestId('login-input').fill(userID);
    await page.getByTestId('password-input').fill(incorrectUserPassword);
    await page.getByTestId('password-input').blur();
    // Assert
    await expect(page.getByTestId('error-login-password')).toHaveText(
      expectErrorMessageUserPassword,
    );
  });
});
