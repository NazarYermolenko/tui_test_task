import { expect } from "@playwright/test";
import { BasePage } from "../../../base/pages/BasePage";
import type { IClosable } from "../../../base/pages/IClosable";
import type { ILoadable } from "../../../base/pages/ILoadable";
import { Step } from "../../../logger/Step";

export class CookiesModal extends BasePage implements ILoadable, IClosable {
    locators = {
        cookieConsentModal: () => this.page.getByRole('dialog', { name: 'Cookie Consent Modal' }),
        acceptCookiesButton: () => this.locators.cookieConsentModal().getByRole('button', { name: 'Accepteer cookies' }),
    }

    @Step('Accepting cookies on CookiesModal')
    async acceptCookies() {
        await this.locators.acceptCookiesButton().click()
        await this.waitForClose()
    }

    @Step('Waiting for CookiesModal to load')
    async waitForLoad(): Promise<this> {
        await expect(this.locators.cookieConsentModal()).toBeVisible()
        return this
    }

    @Step('Waiting for CookiesModal to close')
    async waitForClose(): Promise<void> {
        await expect(this.locators.cookieConsentModal()).toBeHidden()
    }

} 