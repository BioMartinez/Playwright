import { Page } from '@playwright/test';

export class PaymentPage {
  constructor(private page: Page) {}

  transferReceiver = this.page.getByTestId('transfer_receiver');
  transferReceiverAccountNumber = this.page.getByTestId('form_account_to');
  transferAmount = this.page.getByTestId('form_amount');
  transferExecute = this.page.getByRole('button', { name: 'wykonaj przelew' });
  popUpCloseButton = this.page.getByTestId('close-button');
  messageText = this.page.locator('#show_messages');
}
