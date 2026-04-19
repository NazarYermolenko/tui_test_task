import { BasePage } from "@base/pages/BasePage";
import { HolidayDetailsPricePanel } from "@pages/search/search_result_details/holiday_details/components/HolidayDetailsPricePanel";
import type { ILoadable } from "@base/pages/ILoadable";
import { Step } from "@logger/Step";

export class HolidayDetailsPage extends BasePage implements ILoadable {

    get pricePanel() {
        return new HolidayDetailsPricePanel(this.page)
    }

    @Step('Load')
    async waitForLoad() {
        await this.pricePanel.locators.wrapper().waitFor({ state: 'visible' })
        return this
    }

}