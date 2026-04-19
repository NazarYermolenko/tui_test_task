import { DynamicComponent } from "@base/dynamic_components/DynamicComponent";
import { expect } from "@playwright/test";
import { Step } from "@logger/Step";
import { PassengerValidationMessages } from "@pages/search/search_result_details/passenger_details/components/passenger_forms/PassengerValidationMessages";

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
            expect.soft(this.locators.firstNameError()).toHaveText(PassengerValidationMessages.FIRST_NAME),
            expect.soft(this.locators.lastNameError()).toHaveText(PassengerValidationMessages.LAST_NAME),
            expect.soft(this.locators.genderError()).toHaveText(PassengerValidationMessages.GENDER),
            expect.soft(this.locators.dobError()).toHaveText(PassengerValidationMessages.DOB),
            expect.soft(this.locators.addressError()).toHaveText(PassengerValidationMessages.ADDRESS),
            expect.soft(this.locators.houseNumberError()).toHaveText(PassengerValidationMessages.HOUSE_NUMBER),
            expect.soft(this.locators.postcodeError()).toHaveText(PassengerValidationMessages.POSTCODE),
            expect.soft(this.locators.cityError()).toHaveText(PassengerValidationMessages.CITY),
            expect.soft(this.locators.phoneNumberError()).toHaveText(PassengerValidationMessages.PHONE),
            expect.soft(this.locators.emailError()).toHaveText(PassengerValidationMessages.EMAIL),
        ])
    }


    @Step("Fill lead passenger first name: {0}")
    async fillFirstName(name: string) {
        await this.locators.firstName().fill(name);
    }

    @Step("Fill lead passenger last name: {0}")
    async fillLastName(name: string) {
        await this.locators.lastName().fill(name);
    }

    @Step("Fill lead passenger gender: {0}")
    async selectGender(gender: string) {
        await this.locators.gender().selectOption(gender);
    }

    @Step("Fill lead passenger date of birth: {0}-{1}-{2}")
    async fillDateOfBirth(day: string, month: string, year: string) {
        await this.locators.dobDay().fill(day);
        await this.locators.dobMonth().fill(month);
        await this.locators.dobYear().fill(year);
    }

    @Step("Fill lead passenger address: {0} {1}")
    async fillAddress(street: string, houseNumber: string) {
        await this.locators.address().fill(street);
        await this.locators.houseNumber().fill(houseNumber);
    }

    @Step("Fill lead passenger postcode: {0}")
    async fillPostcode(postcode: string) {
        await this.locators.postcode().fill(postcode);
    }

    @Step("Fill lead passenger city: {0}")
    async fillCity(city: string) {
        await this.locators.city().fill(city);
    }

    @Step("Fill lead passenger phone number: {0}")
    async fillPhoneNumber(phoneNumber: string) {
        await this.locators.phoneNumber().fill(phoneNumber);
    }

    @Step("Fill lead passenger email: {0}")
    async fillEmail(email: string) {
        await this.locators.email().fill(email);
    }
}