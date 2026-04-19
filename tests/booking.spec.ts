import { tuiFixture } from '@tests/fixtures/TuiFixture';
import { expect } from '@playwright/test';
import { WaitUtils } from '@utils/WaitUtils';
import { PassengerValidationMessages } from '@pages/search/search_result_details/passenger_details/components/passenger_forms/PassengerValidationMessages';

// Note: 'random' selection for the fields below is supported by the framework but disabled here 
// due to inconsistent availability of search results for random combinations.
const searchCriteria = {
  departureAirport: 'first',
  destination: 'first',
  departureDate: 'first',
  rooms: { childrenCount: 1, adultsCount: 2, childrenAges: ['7'] }
}

tuiFixture('Tui NL > Passenger Information comprehensive validation', async ({ mainPage }) => {
  const searchResultsPage = await mainPage.searchPanel.performSearch(searchCriteria)
  const searchResults = await WaitUtils.waitAndGetResults(() => searchResultsPage.getSearchResults())
  const resultDetails = await searchResults.at(0)!.clickContinue()
  const summaryPage = await resultDetails.pricePanel.clickSummary()
  const bookPage = await summaryPage.pricePanel.clickBookNow()

  const leadForm = await bookPage.getLeadPassengerForm()
  const supportForms = await bookPage.getSupportPassengerForms()

  // 1. Validate 'Required' errors for all passengers (Lead + Support)
  await bookPage.clickContinue({ expectSuccess: false })
  await leadForm.expectValidationErrors()
  for (const form of supportForms) {
    await form.expectValidationErrors()
  }

  // 2. Validate 'Special Characters/Format' errors for all passengers
  await leadForm.fillFirstName('John!@#')
  await leadForm.fillLastName('Doe$%^')
  await leadForm.fillPostcode('1234')
  await leadForm.fillEmail('not-an-email')
  await leadForm.fillPhoneNumber('123')

  let passengerIndex = 1;
  for (const form of supportForms) {
    await form.fillFirstName(`Kid${passengerIndex}!@#`)
    await form.fillLastName(`Doe${passengerIndex}$%^`)
    passengerIndex++;
  }

  await bookPage.clickContinue({ expectSuccess: false })

  // Validate specific error messages
  await expect.soft(leadForm.locators.firstNameError()).toContainText(PassengerValidationMessages.NAME_LENGTH_AND_CHARS)
  await expect.soft(leadForm.locators.lastNameError()).toContainText(PassengerValidationMessages.NAME_LENGTH_AND_CHARS)
  
  for (const form of supportForms) {
    await expect.soft(form.locators.firstNameError()).toContainText(PassengerValidationMessages.NAME_LENGTH_AND_CHARS)
    await expect.soft(form.locators.lastNameError()).toContainText(PassengerValidationMessages.NAME_LENGTH_AND_CHARS)
  }
})


