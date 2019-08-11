import {Browser, Page} from "puppeteer";

const openPage = async (browser: Browser, target: string, loadAll: boolean = false): Promise<Page> => {
    let page = await browser.newPage();

    if (!loadAll) {
        await page.setRequestInterception(true);
        page.on("request", (request) => {
            const filterResources = ['image', 'stylesheet', 'font'];
            if (filterResources.indexOf(request.resourceType()) !== -1) {
                request.abort();
            } else {
                request.continue();
            }
        });
    }

    await page.goto(target, {waitUntil: "domcontentloaded"});

    return page;
};

export {
    openPage
}
