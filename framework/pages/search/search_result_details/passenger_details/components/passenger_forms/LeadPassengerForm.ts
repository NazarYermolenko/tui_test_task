import { DynamicComponent } from "../../../../../../base/dynamic_components/DynamicComponent";
import { expect } from "@playwright/test";
import { Step } from "../../../../../../logger/StepDecorator";
import { PassengerValidationMessages } from "./PassengerValidationMessages";

export class LeadPassengerForm extends DynamicComponent {
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
        nationality: () => this.wrapper().locator('select[name="nationality"]'),
        country: () => this.wrapper().locator('select[name="country"]'),
        address: () => this.wrapper().locator('input[name="address1"]'),
        addressError: () => this.wrapper().locator('[aria-label="Straatnaam"] .inputs__errorMessage'),
        houseNumber: () => this.wrapper().locator('input[name="houseNum"]'),
        houseNumberError: () => this.wrapper().locator('[aria-label="Huisnummer"] .inputs__errorMessage'),
        postcode: () => this.wrapper().locator('input[name="postCode"]'),
        postcodeError: () => this.wrapper().locator('[aria-label="Postcode"] .inputs__errorMessage'),
        city: () => this.wrapper().locator('input[name="town"]'),
        cityError: () => this.wrapper().locator('[aria-label="Woonplaats"] .inputs__errorMessage'),
        phoneCode: () => this.wrapper().locator('select[name="phonecode"]'),
        phoneNumber: () => this.wrapper().locator('input[name="mobileNum"]'),
        phoneNumberError: () => this.wrapper().locator('[aria-label="Mobiel telefoonnummer"] .inputs__errorMessage').last(),
        email: () => this.wrapper().locator('input[name="email"]'),
        emailError: () => this.wrapper().locator('[aria-label="E-mailadres"] .inputs__errorMessage'),
    }

    @Step("Validate lead passenger form required field errors")
    async expectValidationErrors() {
        await Promise.all([
            expect(this.locators.firstNameError()).toHaveText(PassengerValidationMessages.FIRST_NAME),
            expect(this.locators.lastNameError()).toHaveText(PassengerValidationMessages.LAST_NAME),
            expect(this.locators.genderError()).toHaveText(PassengerValidationMessages.GENDER),
            expect(this.locators.dobError()).toHaveText(PassengerValidationMessages.DOB),
            expect(this.locators.addressError()).toHaveText(PassengerValidationMessages.ADDRESS),
            expect(this.locators.houseNumberError()).toHaveText(PassengerValidationMessages.HOUSE_NUMBER),
            expect(this.locators.postcodeError()).toHaveText(PassengerValidationMessages.POSTCODE),
            expect(this.locators.cityError()).toHaveText(PassengerValidationMessages.CITY),
            expect(this.locators.phoneNumberError()).toHaveText(PassengerValidationMessages.PHONE),
            expect(this.locators.emailError()).toHaveText(PassengerValidationMessages.EMAIL),
        ])
    }
}