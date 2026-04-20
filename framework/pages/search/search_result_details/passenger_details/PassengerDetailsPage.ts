import { BasePage } from '@base/pages/BasePage';
import { PassengerForm } from '@pages/search/search_result_details/passenger_details/components/PassengerForm';
import { PassengerTypes } from '@pages/search/search_result_details/passenger_details/components/passenger_forms/PassengerTypes';
import { Step } from '@logger/Step';
import type { ILoadable } from '@base/pages/ILoadable';
import { expect } from '@playwright/test';

export class PassengerDetailsPage extends BasePage implements ILoadable {
  locators = {
    continueButton: () => this.page.locator('.ContinueButtonV2__continueBottom button').filter({ visible: true }),
    passengerForms: () => this.page.locator('.PassengerFormV2__passengerContainer'),
  };

  @Step('Load')
  async waitForLoad() {
    await expect(this.locators.continueButton()).toBeVisible();
    return this;
  }

  @Step('Continue')
  async clickContinue({ expectSuccess = true }: { expectSuccess?: boolean }) {
    const button = this.locators.continueButton();
    await button.click();
    if (expectSuccess) {
      await button.waitFor({ state: 'hidden' });
    }
  }

  @Step('Get forms')
  async getPassengerForms() {
    return Promise.all(
      (await this.locators.passengerForms().all()).map(async (locator) => new PassengerForm(() => locator)),
    );
  }

  @Step('Get lead')
  async getLeadPassengerForm() {
    const forms = await this.getPassengerForms();
    return forms.at(0)!.getAs(PassengerTypes.LEAD);
  }

  @Step('Get support')
  async getSupportPassengerForms() {
    const forms = await this.getPassengerForms();
    return forms.slice(1).map((f) => f.getAs(PassengerTypes.SUPPORT));
  }
}
