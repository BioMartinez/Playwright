import { test, expect } from '@playwright/test';
import { loginData } from '../test-data/login.data';
import { LoginPage } from '../pages/login.page';
import { PulpitPage } from '../pages/pulpit.page';

test.describe('Pulpit tests', () => {
  test.beforeEach(async ({ page }) => {
    const userID = loginData.userID;
    const userPassword = loginData.userPassword;

    await page.goto('/');
    const loginPage = new LoginPage(page);
    await loginPage.loginInput.fill(userID);
    await loginPage.passwordInput.fill(userPassword);
    await loginPage.loginButton.click();
  });

  test('quick payment with correct data', async ({ page }) => {
    // Arrange
    const transferReceiverId = '2';
    const transferAmount = '150';
    const transferTitle = 'zwrot środków';
    const expectedMessageQuickPayment = `Przelew wykonany! Chuck Demobankowy - ${transferAmount},00PLN - ${transferTitle}`;
    // Act
    const pulpitPage = new PulpitPage(page);
    await pulpitPage.transferReceiver.selectOption(transferReceiverId);
    await pulpitPage.transferAmount.fill(transferAmount);
    await pulpitPage.transferTitle.fill(transferTitle);
    await pulpitPage.transferExecute.click();
    await pulpitPage.popUpCloseButton.click();
    // Assert
    await expect(pulpitPage.messageText).toHaveText(expectedMessageQuickPayment);
  });

  test('quick mobile payment with correct data', async ({ page }) => {
    // Arrange
    const transferMobileNumber = '503 xxx xxx';
    const transferAmount = '150';
    const expectedMessageMobilePayment = `Doładowanie wykonane! ${transferAmount},00PLN na numer ${transferMobileNumber}`;
    // Act
    const pulpitPage = new PulpitPage(page);
    await pulpitPage.topUpReceiver.selectOption(transferMobileNumber);
    await pulpitPage.topUpAmount.fill(transferAmount);
    await pulpitPage.topUpAgreementSpam.click();
    await pulpitPage.topUpExecute.click();
    await pulpitPage.popUpCloseButton.click();
    // Assert
    await expect(pulpitPage.messageText).toHaveText(expectedMessageMobilePayment);
  });

  test('correct balance after quick mobile payment with correct data', async ({ page }) => {
    // Arrange
    const transferMobileNumber = '503 xxx xxx';
    const transferAmount = '150';
    const expectedMessageMobilePayment = `Doładowanie wykonane! ${transferAmount},00PLN na numer ${transferMobileNumber}`;
    const initialBalance = await page.locator('#money_value').innerText();
    const expectedBalance = Number(initialBalance) - Number(transferAmount);
    // Act
    const pulpitPage = new PulpitPage(page);
    await pulpitPage.topUpReceiver.selectOption(transferMobileNumber);
    await pulpitPage.topUpAmount.fill(transferAmount);
    await pulpitPage.topUpAgreementSpam.click();
    await pulpitPage.topUpExecute.click();
    await pulpitPage.popUpCloseButton.click();
    // Assert
    await expect(pulpitPage.messageText).toHaveText(expectedMessageMobilePayment);
    await expect(pulpitPage.moneyValue).toHaveText(`${expectedBalance}`);
  });
});
