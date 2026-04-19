import { expect } from "@playwright/test";
import { BasePage } from "@base/pages/BasePage";
import type { ILoadable } from "@base/pages/ILoadable";
import { DepartureSelectorComponent } from "@pages/main/components/search_panel/departure_selector/DepartureSelectorComponent";
import { logger } from "@logger/Logger";
import { DestinationListSelectorComponent } from "@pages/main/components/search_panel/destination_list_selector/DestinationListSelectorComponent";
import { DepartureDateSelectorComponent } from "@pages/main/components/search_panel/departure_date_selector/DepartureDateSelectorComponent";
import { RoomsAndGuestsSelectorComponent } from "@pages/main/components/search_panel/rooms_and_guests/RoomsAndGuestsSelectorComponent";
import { SearchResultsPage } from "@pages/search/search_results/SearchResultsPage";
import { SearchPanelSelectors } from "@pages/main/components/search_panel/SearchPanelSelectors";
import type { SearchCriteria } from "@pages/main/components/search_panel/SearchCriteria";
import { Step } from "@logger/Step";


export class SearchPanel extends BasePage implements ILoadable {
    locators = {
        componentWrapper: () => this.page.locator('#choiceSearch__component'),
        departureAirportInput: () => this.locators.componentWrapper().locator('[data-test-id="airport-input"]'),
        destinationInput: () => this.locators.componentWrapper().locator('[data-test-id="destination-input"]'),
        departureDateInput: () => this.locators.componentWrapper().locator('[data-test-id="departure-date-input"]'),
        durationSelect: () => this.locators.componentWrapper().locator('[data-test-id="duration-input"]'),
        roomsAndGuestsInput: () => this.locators.componentWrapper().locator('[data-test-id="rooms-and-guest-input"]'),
        searchButton: () => this.locators.componentWrapper().locator('[data-test-id="search-button"]')
    }

    @Step('Load')
    async waitForLoad(): Promise<this> {
        await expect(this.locators.componentWrapper()).toBeVisible()
        return this
    }

    async openSelector(type: typeof SearchPanelSelectors.DepartureAirport): Promise<DepartureSelectorComponent>
    async openSelector(type: typeof SearchPanelSelectors.Destination): Promise<DestinationListSelectorComponent>
    async openSelector(type: typeof SearchPanelSelectors.DepartureDate): Promise<DepartureDateSelectorComponent>
    async openSelector(type: typeof SearchPanelSelectors.RoomsAndGuests): Promise<RoomsAndGuestsSelectorComponent>
    @Step('Open {0}')
    async openSelector(type: typeof SearchPanelSelectors[keyof typeof SearchPanelSelectors]): Promise<DepartureSelectorComponent | DestinationListSelectorComponent | DepartureDateSelectorComponent | RoomsAndGuestsSelectorComponent> {
        switch (type) {
            case SearchPanelSelectors.DepartureAirport:
                await this.locators.departureAirportInput().click()
                return new DepartureSelectorComponent(this.page).waitForLoad()
            case SearchPanelSelectors.Destination:
                await this.locators.destinationInput().locator('../span/span').click()
                return new DestinationListSelectorComponent(this.page).waitForLoad()
            case SearchPanelSelectors.DepartureDate:
                await this.locators.departureDateInput().click()
                return new DepartureDateSelectorComponent(this.page).waitForLoad()
            case SearchPanelSelectors.RoomsAndGuests:
                await this.locators.roomsAndGuestsInput().click()
                return new RoomsAndGuestsSelectorComponent(this.page).waitForLoad()
            default:
                throw new Error(`Unknown selector: ${type}`)
        }

    }

    @Step('Get {0}')
    async getSelectorValue(key: keyof typeof SearchPanelSelectors) {
        switch (key) {
            case SearchPanelSelectors.DepartureAirport:
                return this.locators.departureAirportInput().getAttribute('placeholder')
            case SearchPanelSelectors.Destination:
                return this.locators.destinationInput().getAttribute('placeholder')
            case SearchPanelSelectors.DepartureDate:
                return this.locators.departureDateInput().inputValue()
            default:
                throw new Error(`Unknown selector: ${key}`)
        }
    }

    @Step('Search')
    async clickSearchButton() {
        await this.locators.searchButton().click()
        return new SearchResultsPage(this.page).waitForLoad()
    }

    @Step('Perform')
    async performSearch(criteria: SearchCriteria) {

        if (criteria.departureAirport) {
            const departureSelector = await this.openSelector(SearchPanelSelectors.DepartureAirport)
            const airports = await departureSelector.getAirports()
            const airport = criteria.departureAirport === 'first'
                ? airports.at(0)!
                : criteria.departureAirport === 'random'
                    ? airports[Math.floor(Math.random() * airports.length)]!
                    : criteria.departureAirport
            logger.info(`Selected departure airport: ${airport}`)
            await departureSelector.selectAirportByName(airport)
            await departureSelector.clickSave()
            await expect.poll(() => this.getSelectorValue(SearchPanelSelectors.DepartureAirport)).toContain(airport)
        }

        if (criteria.destination) {
            const destinationListSelector = await this.openSelector(SearchPanelSelectors.Destination)
            const destinations = await destinationListSelector.getAvailableDestinations()
            const dest = criteria.destination === 'first'
                ? destinations.at(0)!
                : criteria.destination === 'random'
                    ? destinations[Math.floor(Math.random() * destinations.length)]!
                    : criteria.destination
            logger.info(`Selected destination: ${dest}`)
            const destinationSelectorDetails = await destinationListSelector.selectDestinationByName(dest)
            await destinationSelectorDetails.selectAll()
            await destinationSelectorDetails.clickSave()
            await expect.poll(() => this.getSelectorValue(SearchPanelSelectors.Destination)).toContain(dest)
        }

        if (criteria.departureDate) {
            const departureDateSelector = await this.openSelector(SearchPanelSelectors.DepartureDate)
            const days = await departureDateSelector.getAvailableDays()
            const date = criteria.departureDate === 'first'
                ? days.at(0)!
                : criteria.departureDate === 'random'
                    ? days[Math.floor(Math.random() * days.length)]!
                    : criteria.departureDate
            logger.info(`Selected departure date: ${date}`)
            await departureDateSelector.setAvailableDay(date)
            await departureDateSelector.clickSave()
            await expect.poll(() => this.getSelectorValue(SearchPanelSelectors.DepartureDate)).toContain(date)
        }

        if (criteria.rooms) {
            const roomsAndGuestsSelector = await this.openSelector(SearchPanelSelectors.RoomsAndGuests)
            if (criteria.rooms.adultsCount !== undefined) {
                await roomsAndGuestsSelector.setAdultsCount(criteria.rooms.adultsCount)
                logger.info(`Selected adults count: ${criteria.rooms.adultsCount}`)
            }
            await roomsAndGuestsSelector.setChildrenCount(criteria.rooms.childrenCount)
            logger.info(`Selected children count: ${criteria.rooms.childrenCount}`)
            const selectors = await roomsAndGuestsSelector.getChildrenAgeSelectors()

            for (let i = 0; i < selectors.length; i++) {
                const selector = selectors[i]!
                const availableAges = await selector.getAvailableAges()
                const age = criteria.rooms.childrenAges[i] ?? availableAges[Math.floor(Math.random() * availableAges.length)]!
                if (age) {
                    logger.info(`Selected age for child ${i + 1}: ${age}`)
                    await selector.setAge(age)
                }
            }
            await roomsAndGuestsSelector.clickSave()
        }

        return this.clickSearchButton()
    }
}