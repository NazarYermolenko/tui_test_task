import { BasePage } from "../../../../base/pages/BasePage";
import { HolidayDetailsPricePanel } from "./components/HolidayDetailsPricePanel";
import type { ILoadable } from "../../../../base/pages/ILoadable";
import { Step } from "../../../../logger/StepDecorator";

export class HolidayDetailsPage extends BasePage implements ILoadable {

    get pricePanel() {
        return new HolidayDetailsPricePanel(this.page)
    }

    @Step('Waiting for HolidayDetailsPage to load')
    async waitForLoad() {
        await this.pricePanel.locators.wrapper().waitFor({ state: 'visible' })
        return this
    }

}