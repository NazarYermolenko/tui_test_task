import { test as base } from '@playwright/test';
import { MainPage } from '../../framework/pages/main/MainPage';
import { TuiUrlProvider } from '../../framework/utils/TuiUrlProvider';

export const tui_fixture = base.extend<{ mainPage: MainPage }>({
  mainPage: async ({ page }, use) => {
    const tuiUrl = TuiUrlProvider.getBaseUrl()
    const mainPage = await MainPage.open(page, tuiUrl);

    // as most cases will require that :) 
    const cookiesModal = await mainPage.waitForCoockiesModal()
    await cookiesModal.acceptCookies()

    await use(mainPage);
  },
});

export { expect } from '@playwright/test';
