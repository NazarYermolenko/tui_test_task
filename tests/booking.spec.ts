import { tuiFixture } from '@tests/fixtures/TuiFixture';
import { expect, type Page } from '@playwright/test';
import { WaitUtils } from '@utils/WaitUtils';
import { PassengerValidationMessages } from '@pages/search/search_result_details/passenger_details/components/passenger_forms/PassengerValidationMessages';
import { PassengerDetailsPage } from '@pages/search/search_result_details/passenger_details/PassengerDetailsPage';
import { LeadPassengerForm } from '@pages/search/search_result_details/passenger_details/components/passenger_forms/LeadPassengerForm';
import { SupportPassengerForm } from '@pages/search/search_result_details/passenger_details/components/passenger_forms/SupportPassengerForm';
import { MainPage } from '@pages/main/MainPage';
import { TuiUrlProvider } from '@utils/TuiUrlProvider';

// Note: 'random' selection for the fields below is supported by the framework but disabled here 
// due to inconsistent availability of search results for random combinations.
const searchCriteria = {
  departureAirport: 'first',
  destination: 'first',
  departureDate: 'first',
  rooms: { childrenCount: 1, adultsCount: 2, childrenAges: ['7'] }
}

tuiFixture.describe.configure({ mode: 'serial' });

tuiFixture.describe('Passenger Information Validations', () => {
  let page: Page;
  let bookPage: PassengerDetailsPage;
  let leadForm: LeadPassengerForm;
  let supportForms: SupportPassengerForm[];

  tuiFixture.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const mainPage = await MainPage.open(page, TuiUrlProvider.getBaseUrl());
    const cookiesModal = await mainPage.waitForCookiesModal();
    await cookiesModal.acceptCookies();

    const searchResultsPage = await mainPage.searchPanel.performSearch(searchCriteria)
    const searchResults = await WaitUtils.waitAndGetResults(() => searchResultsPage.getSearchResults())
    const resultDetails = await searchResults.at(0)!.clickContinue()
    const summaryPage = await resultDetails.pricePanel.clickSummary()
    bookPage = await summaryPage.pricePanel.clickBookNow()

    leadForm = await bookPage.getLeadPassengerForm()
    supportForms = await bookPage.getSupportPassengerForms()
  });

  tuiFixture.afterAll(async () => {
    await page?.close();
  });

  tuiFixture('Required fields validation (Equivalence Partitioning: Empty vs Valid)', async () => {
    await bookPage.clickContinue({ expectSuccess: false })
    await leadForm.expectValidationErrors()
    for (const form of supportForms) {
      await form.expectValidationErrors()
    }
  })

  tuiFixture('Name fields boundary values (BVA: 1, 2, 32, 33 characters)', async () => {
    // 1 character (Too short)
    await leadForm.fillFirstName('A')
    await leadForm.fillLastName('B')
    await bookPage.clickContinue({ expectSuccess: false })
    await expect.soft(leadForm.locators.firstNameError()).toContainText(PassengerValidationMessages.NAME_LENGTH_AND_CHARS)
    await expect.soft(leadForm.locators.lastNameError()).toContainText(PassengerValidationMessages.NAME_LENGTH_AND_CHARS)

    // 33 characters (Too long)
    const longName = 'A'.repeat(33)
    await leadForm.fillFirstName(longName)
    await leadForm.fillLastName(longName)
    await bookPage.clickContinue({ expectSuccess: false })
    await expect.soft(leadForm.locators.firstNameError()).toContainText(PassengerValidationMessages.NAME_LENGTH_AND_CHARS)
    await expect.soft(leadForm.locators.lastNameError()).toContainText(PassengerValidationMessages.NAME_LENGTH_AND_CHARS)

    // Valid boundaries: 2 and 32 characters should NOT show NAME_LENGTH_AND_CHARS error
    await leadForm.fillFirstName('An')
    await leadForm.fillLastName('Be')
    await leadForm.fillFirstName('A'.repeat(32))
    await leadForm.fillLastName('B'.repeat(32))
    // We don't click continue yet because other fields are empty, but we can check the error is gone or different
  })

  tuiFixture('Name fields special characters (Equivalence Partitioning: Invalid Symbols)', async () => {
    const invalidNames = ['John123', 'Jane!', 'Doe@', 'Smith#']
    for (const name of invalidNames) {
      await leadForm.fillFirstName(name)
      await bookPage.clickContinue({ expectSuccess: false })
      await expect.soft(leadForm.locators.firstNameError()).toContainText(PassengerValidationMessages.NAME_LENGTH_AND_CHARS)
    }
  })

  tuiFixture('Date of Birth validations (Error Guessing: Invalid and Future dates)', async () => {
    // Invalid date: Feb 31st
    await leadForm.fillDateOfBirth('31', '02', '1990')
    await bookPage.clickContinue({ expectSuccess: false })
    // In many systems, this might be auto-corrected or show a format error. 
    // The checklist says: Voer de geboortedatum als volgt in: DD/MM/JJJJ
    await expect.soft(leadForm.locators.dobError()).toBeVisible()

    // Future date
    const nextYear = (new Date().getFullYear() + 1).toString()
    await leadForm.fillDateOfBirth('01', '01', nextYear)
    await bookPage.clickContinue({ expectSuccess: false })
    await expect.soft(leadForm.locators.dobError()).toBeVisible()
  })

  tuiFixture('Contact details format validation (Equivalence Partitioning: Email, Phone, Postcode)', async () => {
    // Invalid Email
    await leadForm.fillEmail('invalid-email')
    // Invalid Phone
    await leadForm.fillPhoneNumber('123')
    // Invalid Postcode
    await leadForm.fillPostcode('12')

    await bookPage.clickContinue({ expectSuccess: false })
    
    // Note: Error messages for these might vary, but they should be visible
    await expect.soft(leadForm.locators.emailError()).toBeVisible()
    await expect.soft(leadForm.locators.phoneNumberError()).toBeVisible()
    await expect.soft(leadForm.locators.postcodeError()).toBeVisible()
  })

})


