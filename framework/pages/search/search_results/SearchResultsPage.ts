import { BasePage } from "@base/pages/BasePage";
import type { ILoadable } from "@base/pages/ILoadable";
import { SearchPanel } from "@pages/main/components/search_panel/SearchPanel";
import { ResultItem } from "@pages/search/search_results/components/ResultItem";
import { Step } from "@logger/Step";

export class SearchResultsPage extends BasePage implements ILoadable {
    locators = {
        results: () => this.page.locator('[data-test-id="result-item"]')
    }

    get searchPanel() {
        return new SearchPanel(this.page)
    }

    @Step('Load')
    async waitForLoad(): Promise<this> {
        return this
    }

    @Step('Results')
    async getSearchResults() {
        return Promise.all((await this.locators.results().all()).map((locator) => new ResultItem(() => locator)))
    }

}