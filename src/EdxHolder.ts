import {Browser, launch} from "puppeteer";

export class EdxHolder {
    private static browser: Promise<Browser> = launch({
        headless: false,
        ignoreDefaultArgs: ["--enable-automation"],
        args: ["--proxy-server=socks5://127.0.0.1:1080"]
    });

    constructor(private readonly username: string, private readonly password: string) {}

    public async login(): Promise<Browser> {
        let browser: Browser = await EdxHolder.browser;
        let page = await browser.newPage();

        await page.setRequestInterception(true);
        page.on("request", (request) => {
            const filterResources = ['image', 'stylesheet', 'font'];
            if (filterResources.indexOf(request.resourceType()) !== -1) {
                request.abort();
            } else {
                request.continue();
            }
        });

        await page.goto("https://courses.edx.org/login", {waitUntil: "domcontentloaded"});

        await page.type("#login-email", this.username);
        await page.type("#login-password", this.password);

        await page.click("#login button[type='submit']");

        await page.waitForNavigation({waitUntil: "domcontentloaded", timeout: 10000});

        return browser;
    }
}





