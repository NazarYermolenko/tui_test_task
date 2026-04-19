import { tuiFixture, expect } from '@tests/fixtures/TuiFixture';
import { WaitUtils } from '@utils/WaitUtils';
import { PassengerValidationMessages } from '@pages/search/search_result_details/passenger_details/components/passenger_forms/PassengerValidationMessages';
import { MainPage } from '@pages/main/MainPage';
import { TuiUrlProvider } from '@utils/TuiUrlProvider';

const searchCriteria = {
  departureAirport: 'first',
  destination: 'first',
  departureDate: 'first',
  rooms: { childrenCount: 1, adultsCount: 2, childrenAges: ['7'] }
}

tuiFixture('Perform all passenger validations', async ({ page }) => {
  tuiFixture.setTimeout(120000);

  // 1. Setup - Navigate to Passenger Details page
  const mainPage = await MainPage.open(page, TuiUrlProvider.getBaseUrl());
  const cookiesModal = await mainPage.waitForCookiesModal();
  await cookiesModal.acceptCookies();

  const searchResultsPage = await mainPage.searchPanel.performSearch(searchCriteria)
  const searchResults = await WaitUtils.waitAndGetResults(() => searchResultsPage.getSearchResults())
  const resultDetails = await searchResults.at(0)!.clickContinue()
  const summaryPage = await resultDetails.pricePanel.clickSummary()
  const bookPage = await summaryPage.pricePanel.clickBookNow()

  const leadForm = await bookPage.getLeadPassengerForm()
  const supportForms = await bookPage.getSupportPassengerForms()

  // --- Required fields validation ---
  await bookPage.clickContinue({ expectSuccess: false })
  await leadForm.expectValidationErrors()
  for (const form of supportForms) {
    await form.expectValidationErrors()
  }

  // --- Name fields boundary values (BVA) ---
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

  // --- Special characters validation ---
  const invalidNames = ['John123', 'Jane!', 'Doe@', 'Smith#']
  for (const name of invalidNames) {
    await leadForm.fillFirstName(name)
    await bookPage.clickContinue({ expectSuccess: false })
    await expect.soft(leadForm.locators.firstNameError()).toContainText(PassengerValidationMessages.NAME_LENGTH_AND_CHARS)
  }

  // --- Date of Birth validations ---
  // Invalid date: Feb 31st
  await leadForm.fillDateOfBirth('31', '02', '1990')
  await bookPage.clickContinue({ expectSuccess: false })
  await expect.soft(leadForm.locators.dobError()).toBeVisible()

  // Future date
  const nextYear = (new Date().getFullYear() + 1).toString()
  await leadForm.fillDateOfBirth('01', '01', nextYear)
  await bookPage.clickContinue({ expectSuccess: false })
  await expect.soft(leadForm.locators.dobError()).toBeVisible()

  // --- Contact details format validation ---
  await leadForm.fillEmail('invalid-email')
  await leadForm.fillPhoneNumber('123')
  await leadForm.fillPostcode('12')
  await bookPage.clickContinue({ expectSuccess: false })
  await expect.soft(leadForm.locators.emailError()).toBeVisible()
  await expect.soft(leadForm.locators.phoneNumberError()).toBeVisible()
  await expect.soft(leadForm.locators.postcodeError()).toBeVisible()
})
