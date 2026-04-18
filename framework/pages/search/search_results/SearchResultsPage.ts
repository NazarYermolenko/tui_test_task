import { BasePage } from "../../../base/pages/BasePage";
import type { ILoadable } from "../../../base/pages/ILoadable";
import { SearchPanel } from "../../main/components/choice_search_component/SearchPanel";
import { ResultItem } from "./components/ResultItem";
import { Step } from "../../../logger/StepDecorator";

export class SearchResultsPage extends BasePage implements ILoadable {
    locators = {
        results: () => this.page.locator('[data-test-id="result-item"]')
    }

    get searchPanel() {
        return new SearchPanel(this.page)
    }

    @Step('Waiting for SearchResultsPage to load')
    async waitForLoad(): Promise<this> {
        return this
    }

    @Step('Getting search results')
    async getSearchResults() {
        return Promise.all((await this.locators.results().all()).map((locator) => new ResultItem(() => locator)))
    }

}