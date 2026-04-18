import type { Locator } from "@playwright/test"

export abstract class DynamicComponent {
    locators: Record<string, () => Locator> = {}
    readonly wrapper: () => Locator

    constructor(wrapper: () => Locator) {
        this.wrapper = wrapper
    }

}