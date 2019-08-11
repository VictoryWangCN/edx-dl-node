import * as fs from "fs";
import * as path from "path";

import {EdxHolder} from "./EdxHolder";
import {CourseStructure} from "./domain/CourseStructure";
import {CourseSection} from "./domain/CourseSection";

export class CourseSpider {
    constructor(private readonly edxHolder: EdxHolder, private readonly course: string) {}

    public async extractStructure(): Promise<CourseStructure> {

        let browser = await this.edxHolder.login();

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

        await page.goto(this.course, {waitUntil: "domcontentloaded"});

        let courseName = await page.$eval(".page-title", element => element.textContent);

        let sections: Array<CourseSection> = await page.evaluate(
            fs.readFileSync(path.resolve(__dirname, "./resources/sections.js"), "UTF-8"));

        if (courseName === null || sections === null || Object.keys(sections).length === 0) {
            throw new Error("Mismatch course page");
        }

        let structure = new CourseStructure(courseName);

        structure.addSections(sections);

        return structure;
    }

}
