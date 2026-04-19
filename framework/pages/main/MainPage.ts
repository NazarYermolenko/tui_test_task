import type { Page } from '@playwright/test';
import { BasePage } from '@base/pages/BasePage';
import { CookiesModal } from '@pages/main/components/CookiesModal';
import { SearchPanel } from '@pages/main/components/search_panel/SearchPanel';
import type { ILoadable } from '@base/pages/ILoadable';
import { Step } from '@logger/Step';


export class MainPage extends BasePage implements ILoadable {
  get searchPanel() {
    return new SearchPanel(this.page);
  }

  @Step('Load')
  async waitForLoad(): Promise<this> {
    await this.searchPanel.waitForLoad()
    return this
  }

  @Step('Open {url}')
  static async open(page: Page, url: string) {
    await page.goto(url);
    return new MainPage(page).waitForLoad()
  }

  @Step('Wait for cookies')
  async waitForCookiesModal() {
    return new CookiesModal(this.page).waitForLoad()
  }
}
