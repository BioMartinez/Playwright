import { Page } from '@playwright/test';

export class PulpitPage {
  constructor(private page: Page) {}

  userName = this.page.getByTestId('user-name');
  popUpCloseButton = this.page.getByTestId('close-button');
  messageText = this.page.locator('#show_messages');
  moneyValue = this.page.locator('#money_value');
  //Transfer
  transferReceiver = this.page.locator('#widget_1_transfer_receiver');
  transferAmount = this.page.locator('#widget_1_transfer_amount');
  transferTitle = this.page.locator('#widget_1_transfer_title');
  transferExecute = this.page.locator('#execute_btn');
  //Top Up
  topUpReceiver = this.page.locator('#widget_1_topup_receiver');
  topUpAmount = this.page.locator('#widget_1_topup_amount');
  topUpAgreementSpam = this.page.locator('#uniform-widget_1_topup_agreement span');
  topUpExecute = this.page.getByRole('button', { name: 'doładuj telefon' });
}
