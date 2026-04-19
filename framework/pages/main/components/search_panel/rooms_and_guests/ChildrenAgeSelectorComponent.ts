import { DynamicComponent } from "@base/dynamic_components/DynamicComponent";
import { Step } from "@logger/Step";

export class ChildrenAgeSelectorComponent extends DynamicComponent {
    locators = {
        options: () => this.wrapper().locator('option')
    }
    @Step('Setting children age')
    async setAge(age: string) {
        await this.wrapper().selectOption({ label: age })
    }
    @Step('Getting available ages')
    async getAvailableAges() {
        return this.locators.options().allTextContents()
    }

}