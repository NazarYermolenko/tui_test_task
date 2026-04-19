import { DynamicComponent } from "@base/dynamic_components/DynamicComponent";
import { Step } from "@logger/Step";

export class ChildrenAgeSelectorComponent extends DynamicComponent {
    locators = {
        options: () => this.wrapper().locator('option')
    }
    @Step('Age: {0}')
    async setAge(age: string) {
        await this.wrapper().selectOption({ label: age })
    }
    @Step('Get available')
    async getAvailableAges() {
        return this.locators.options().allTextContents()
    }

}