import { test, expect } from '@playwright/test';
import { loginData } from '../test-data/login.data';
import { LoginPage } from '../pages/login.page';

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
    await page.locator('#widget_1_transfer_receiver').selectOption(transferReceiverId);
    await page.locator('#widget_1_transfer_amount').fill(transferAmount);
    await page.locator('#widget_1_transfer_title').fill(transferTitle);
    await page.locator('#execute_btn').click();
    await page.getByTestId('close-button').click();
    // Assert
    await expect(page.locator('#show_messages')).toHaveText(expectedMessageQuickPayment);
  });

  test('quick mobile payment with correct data', async ({ page }) => {
    // Arrange
    const transferMobileNumber = '503 xxx xxx';
    const transferAmount = '150';
    const expectedMessageMobilePayment = `Doładowanie wykonane! ${transferAmount},00PLN na numer ${transferMobileNumber}`;
    // Act
    await page.locator('#widget_1_topup_receiver').selectOption(transferMobileNumber);
    await page.locator('#widget_1_topup_amount').fill(transferAmount);
    await page.locator('#uniform-widget_1_topup_agreement span').click();
    await page.getByRole('button', { name: 'doładuj telefon' }).click();
    await page.getByTestId('close-button').click();
    // Assert
    await expect(page.locator('#show_messages')).toHaveText(expectedMessageMobilePayment);
  });

  test('correct balance after quick mobile payment with correct data', async ({ page }) => {
    // Arrange
    const transferMobileNumber = '503 xxx xxx';
    const transferAmount = '150';
    const expectedMessageMobilePayment = `Doładowanie wykonane! ${transferAmount},00PLN na numer ${transferMobileNumber}`;
    const initialBalance = await page.locator('#money_value').innerText();
    const expectedBalance = Number(initialBalance) - Number(transferAmount);
    // Act
    await page.locator('#widget_1_topup_receiver').selectOption(transferMobileNumber);
    await page.locator('#widget_1_topup_amount').fill(transferAmount);
    await page.locator('#uniform-widget_1_topup_agreement span').click();
    await page.getByRole('button', { name: 'doładuj telefon' }).click();
    await page.getByTestId('close-button').click();
    // Assert
    await expect(page.locator('#show_messages')).toHaveText(expectedMessageMobilePayment);
    await expect(page.locator('#money_value')).toHaveText(`${expectedBalance}`);
  });
});
