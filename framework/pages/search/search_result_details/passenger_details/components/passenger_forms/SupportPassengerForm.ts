import { DynamicComponent } from "@base/dynamic_components/DynamicComponent";
import { expect } from "@playwright/test";
import { Step } from "@logger/Step";
import { PassengerValidationMessages } from "@pages/search/search_result_details/passenger_details/components/passenger_forms/PassengerValidationMessages";

export class SupportPassengerForm extends DynamicComponent {
    locators = {
        firstName: () => this.wrapper().locator('input[name$="firstName"]'),
        firstNameError: () => this.wrapper().locator('[aria-label="Eerste voornaam"] .inputs__errorMessage'),
        lastName: () => this.wrapper().locator('input[name$="lastName"]'),
        lastNameError: () => this.wrapper().locator('[aria-label="Achternaam"] .inputs__errorMessage'),
        gender: () => this.wrapper().locator('select[name$="gender"]'),
        genderError: () => this.wrapper().locator('[aria-label="Geslacht"] .inputs__errorMessage'),
        dobDay: () => this.wrapper().locator('input[aria-label="day"]'),
        dobMonth: () => this.wrapper().locator('input[aria-label="month"]'),
        dobYear: () => this.wrapper().locator('input[aria-label="year"]'),
        dobError: () => this.wrapper().locator('[aria-label="Geboortedatum"] .inputs__errorMessageWithIcon'),
    }

    @Step("Validate errors")
    async expectValidationErrors() {
        await Promise.all([
            expect.soft(this.locators.firstNameError()).toHaveText(PassengerValidationMessages.FIRST_NAME),
            expect.soft(this.locators.lastNameError()).toHaveText(PassengerValidationMessages.LAST_NAME),
            expect.soft(this.locators.genderError()).toHaveText(PassengerValidationMessages.GENDER),
            expect.soft(this.locators.dobError()).toHaveText(PassengerValidationMessages.DOB),
        ])
    }


    @Step("{0}")
    async fillFirstName(name: string) {
        await this.locators.firstName().fill(name);
    }

    @Step("{0}")
    async fillLastName(name: string) {
        await this.locators.lastName().fill(name);
    }

    @Step("{0}")
    async selectGender(gender: string) {
        await this.locators.gender().selectOption(gender);
    }

    @Step("{0}-{1}-{2}")
    async fillDateOfBirth(day: string, month: string, year: string) {
        await this.locators.dobDay().fill(day);
        await this.locators.dobMonth().fill(month);
        await this.locators.dobYear().fill(year);
    }
}

