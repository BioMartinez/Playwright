import { test, expect } from '@playwright/test';
import { loginData } from '../test-data/login.data';
import { LoginPage } from '../pages/login.page';
import { PulpitPage } from '../pages/pulpit.page';

test.describe('User login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('successful login with correct credentials', async ({ page }) => {
    // Arrange
    const userID = loginData.userID;
    const userPassword = loginData.userPassword;
    const expectedUserName = 'Jan Demobankowy';
    // Act
    const loginPage = new LoginPage(page);
    await loginPage.loginInput.fill(userID);
    await loginPage.passwordInput.fill(userPassword);
    await loginPage.loginButton.click();
    // Assert
    const pulpitPage = new PulpitPage(page);
    await expect(pulpitPage.userName).toHaveText(expectedUserName);
  });

  test('unsuccessful login with incorrect credentials - username', async ({ page }) => {
    // Arrange
    const incorrectUserID = 'ghost';
    const expectedErrorMessageUserID = 'identyfikator ma min. 8 znaków';
    // Act
    const loginPage = new LoginPage(page);
    await loginPage.loginInput.fill(incorrectUserID);
    await loginPage.passwordInput.click();
    // Assert
    await expect(loginPage.loginError).toHaveText(expectedErrorMessageUserID);
  });

  test('unsuccessful login with incorrect credentials - password', async ({ page }) => {
    // Arrange
    const userID = loginData.userID;
    const incorrectUserPassword = '1234';
    const expectErrorMessageUserPassword = 'hasło ma min. 8 znaków';
    // Act
    const loginPage = new LoginPage(page);
    await loginPage.loginInput.fill(userID);
    await loginPage.passwordInput.fill(incorrectUserPassword);
    await loginPage.passwordInput.blur();
    // Assert
    await expect(loginPage.passwordError).toHaveText(expectErrorMessageUserPassword);
  });
});
