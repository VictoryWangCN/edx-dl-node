import * as fs from "fs";
import * as path from "path";

import {EdxHolder} from "./EdxHolder";
import {CourseStructure} from "./domain/CourseStructure";
import {openPage} from "./index";

export class CourseSpider {
    constructor(private readonly edxHolder: EdxHolder, private readonly course: string) {}

    public async extractStructure(): Promise<CourseStructure> {

        let browser = await this.edxHolder.getBrowser();

        let page = await openPage(browser, this.course);

        let courseName = await page.$eval(".page-title", element => element.textContent);

        let sections: Array<Section> = await page.evaluate(
            fs.readFileSync(path.resolve(__dirname, "./resources/sections.js"), "UTF-8"));

        if (courseName === null || sections === null || Object.keys(sections).length === 0) {
            throw new Error("Mismatch course page");
        }

        await page.close();

        return CourseStructure.buildFromJSON(courseName, sections);
    }

}
