import { test, expect } from '@playwright/test';
import { loginData } from '../test-data/login.data';
import { LoginPage } from '../pages/login.page';
import { PaymentPage } from '../pages/payment.page';
import { PulpitPage } from '../pages/pulpit.page';

test.describe('Payment tests', () => {
  test.beforeEach(async ({ page }) => {
    const userID = loginData.userID;
    const userPassword = loginData.userPassword;

    await page.goto('/');
    const loginPage = new LoginPage(page);
    await loginPage.loginInput.fill(userID);
    await loginPage.passwordInput.fill(userPassword);
    await loginPage.loginButton.click();
    const pulpitPage = new PulpitPage(page);
    await pulpitPage.sideMenu.paymentButton.click();
  });

  test('simple payment', async ({ page }) => {
    // Arrange
    const transferReceiver = 'Jan Nowak';
    const transferAccountNumber = '12 3456 7890 1234 5678 9012 34567';
    const transferAmount = '20';
    const expectedMessage = `Przelew wykonany! ${transferAmount},00PLN dla ${transferReceiver}`;
    // Act
    const paymentPage = new PaymentPage(page);
    await paymentPage.transferReceiver.fill(transferReceiver);
    await paymentPage.transferReceiverAccountNumber.fill(transferAccountNumber);
    await paymentPage.transferAmount.fill(transferAmount);
    await paymentPage.transferExecute.click();
    await paymentPage.popUpCloseButton.click();
    // Assert
    await expect(paymentPage.messageText).toHaveText(expectedMessage);
  });
});
