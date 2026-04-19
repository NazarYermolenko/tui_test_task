import { tuiFixture } from './fixtures/TuiFixture';
import { expect } from '@playwright/test';
import { WaitUtils } from '../framework/utils/WaitUtils';

// Note: 'random' selection for the fields below is supported by the framework but disabled here 
// due to inconsistent availability of search results for random combinations.
const searchCriteria = {
  departureAirport: 'first',
  destination: 'first',
  departureDate: 'first',
  rooms: { childrenCount: 1, adultsCount: 2, childrenAges: ['7'] }
}

tuiFixture('Tui NL > Passenger Information validation', async ({ mainPage }) => {
  const searchResultsPage = await mainPage.searchPanel.performSearch(searchCriteria)

  const searchResults = await WaitUtils.waitAndGetResults(() => searchResultsPage.getSearchResults())
  const resultDetails = await searchResults.at(0)!.clickContinue()

  const summaryPage = await resultDetails.pricePanel.clickSummary()

  const bookPage = await summaryPage.pricePanel.clickBookNow()
  await bookPage.clickContinue({ expectSuccess: false })

  // Validate Lead Passenger form errors
  const leadForm = await bookPage.getLeadPassengerForm()
  await leadForm.expectValidationErrors()

  // Validate all support passenger form errors
  const supportForms = await bookPage.getSupportPassengerForms()
  for (const form of supportForms) {
    await form.expectValidationErrors()
  }
})

tuiFixture('Tui NL > Passenger Information special characters validation', async ({ mainPage }) => {
  const searchResultsPage = await mainPage.searchPanel.performSearch(searchCriteria)
  const searchResults = await WaitUtils.waitAndGetResults(() => searchResultsPage.getSearchResults())
  const resultDetails = await searchResults.at(0)!.clickContinue()
  const summaryPage = await resultDetails.pricePanel.clickSummary()
  const bookPage = await summaryPage.pricePanel.clickBookNow()

  const leadForm = await bookPage.getLeadPassengerForm()
  
  // Test special characters in first name
  await leadForm.fillFirstName('John!@#')
  await leadForm.fillLastName('Doe')
  await bookPage.clickContinue({ expectSuccess: false })
  
  // We expect some validation error here. 
  // For now, we'll just check that some error message is visible near the first name
  await expect(leadForm.locators.firstNameError()).toBeVisible()
  
})

