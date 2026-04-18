import { tui_fixture } from './fixtures/TuiFixture';
import { WaitUtils } from '../framework/utils/WaitUtils';

// Note: 'random' selection for the fields below is supported by the framework but disabled here 
// due to inconsistent availability of search results for random combinations.
const searchCriteria = {
  departureAirport: 'first',
  destination: 'first',
  departureDate: 'first',
  rooms: { childrenCount: 1, adultsCount: 2, childrenAges: ['7'] }
}

tui_fixture('Tui NL > Passenger Information validation', async ({ mainPage }) => {
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
