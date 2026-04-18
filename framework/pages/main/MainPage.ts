import type { Page } from '@playwright/test';
import { BasePage } from '../../base/pages/BasePage';
import { CookiesModal } from './components/CookiesModal';
import { SearchPanel } from './components/choice_search_component/SearchPanel';
import type { ILoadable } from '../../base/pages/ILoadable';
import { Step } from '../../logger/StepDecorator';

import { TuiUrlProvider } from '../../utils/TuiUrlProvider';

export class MainPage extends BasePage implements ILoadable {
  get searchPanel() {
    return new SearchPanel(this.page);
  }

  @Step('Waiting for MainPage to load')
  async waitForLoad(): Promise<this> {
    await this.searchPanel.waitForLoad()
    return this
  }

  @Step('Opening MainPage at {url}')
  static async open(page: Page, url: string) {
    await page.goto(url);
    return new MainPage(page).waitForLoad()
  }

  @Step('Waiting for CookiesModal')
  async waitForCookiesModal() {
    return new CookiesModal(this.page).waitForLoad()
  }
}
