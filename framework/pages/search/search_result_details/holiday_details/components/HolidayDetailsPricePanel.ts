import { BasePage } from "../../../../../base/pages/BasePage";
import { PassengerDetailsPage } from "../../passenger_details/PassengerDetailsPage";
import { Step } from "../../../../../logger/StepDecorator";

export class HolidayDetailsPricePanel extends BasePage {
    locators = {
        wrapper: () => this.page.locator(".ProgressbarNavigation__pricePanelWrapper"),
        bookNowButton: () => this.locators.wrapper().locator('button').filter({ visible: true })
    }
    @Step('Clicking book now button')
    async clickBookNow() {
        const button = this.locators.bookNowButton()
        await button.click()
        await button.waitFor({ state: 'hidden' })
        return new PassengerDetailsPage(this.page).waitForLoad()
    }

}