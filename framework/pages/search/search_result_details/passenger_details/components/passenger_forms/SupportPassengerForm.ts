import { DynamicComponent } from "../../../../../../base/dynamic_components/DynamicComponent";
import { expect } from "@playwright/test";
import { Step } from "../../../../../../logger/StepDecorator";
import { PassengerValidationMessages } from "./PassengerValidationMessages";

export class SupportPassengerForm extends DynamicComponent {
    locators = {
        firstName: () => this.wrapper().locator('input[name$="firstName"]'),
        firstNameError: () => this.wrapper().locator('[aria-label="Eerste voornaam"] .inputs__errorMessage'),
        lastName: () => this.wrapper().locator('input[name$="lastName"]'),
        lastNameError: () => this.wrapper().locator('[aria-label="Achternaam"] .inputs__errorMessage'),
        lastNameSameAsLeadCheckbox: () => this.wrapper().locator('input[name$="lastNameSameAsLeadSelected"]'),
        gender: () => this.wrapper().locator('select[name$="gender"]'),
        genderError: () => this.wrapper().locator('[aria-label="Geslacht"] .inputs__errorMessage'),
        dobDay: () => this.wrapper().locator('input[aria-label="day"]'),
        dobMonth: () => this.wrapper().locator('input[aria-label="month"]'),
        dobYear: () => this.wrapper().locator('input[aria-label="year"]'),
        dobError: () => this.wrapper().locator('[aria-label="Geboortedatum"] .inputs__errorMessageWithIcon'),
    }

    @Step("Validate support passenger form required field errors")
    async expectValidationErrors() {
        await Promise.all([
            expect(this.locators.firstNameError()).toHaveText(PassengerValidationMessages.FIRST_NAME),
            expect(this.locators.lastNameError()).toHaveText(PassengerValidationMessages.LAST_NAME),
            expect(this.locators.genderError()).toHaveText(PassengerValidationMessages.GENDER),
            expect(this.locators.dobError()).toHaveText(PassengerValidationMessages.DOB),
        ])
    }
}
