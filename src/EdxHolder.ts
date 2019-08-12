import {Browser, launch} from "puppeteer";
import {openPage} from "./index";

export class EdxHolder {
    private static readonly browser: Promise<Browser> = launch({
        headless: true,
        ignoreDefaultArgs: ["--enable-automation", "about:blank"],
        args: ["--proxy-server=socks5://localhost:8087"]
    });

    readonly browser: Promise<Browser>;

    constructor(private readonly username: string, private readonly password: string) {
        this.browser = this.buildBrowser();
    }

    private async buildBrowser(): Promise<Browser> {
        let browser: Browser = await EdxHolder.browser;
        let page = await openPage(browser, "https://courses.edx.org/login");

        await page.type("#login-email", this.username);
        await page.type("#login-password", this.password);

        await page.click("#login button[type='submit']");

        await page.waitForNavigation({waitUntil: "domcontentloaded", timeout: 10000});

        await page.close();
        return browser;
    }

    public getBrowser() {
        return this.browser;
    }
}





