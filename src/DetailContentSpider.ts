import {CourseStructure} from "./domain/CourseStructure";
import {EdxHolder} from "./EdxHolder";
import {BlockContent, BinaryPNGBlock, VideoBlock, NotesBlock, YoutubeBlock} from "./domain/BlockContent";
import {CourseBlock} from "./domain/CourseBlock";
import {openPage} from "./index";
import {Page} from "puppeteer";

export class DetailContentSpider {

    constructor(private readonly structure: CourseStructure, private readonly holder: EdxHolder) {
    }

    public async populateDetail() {

        let allTasks = this.structure.getSections().flatMap(section => section.getSubSections())
            .flatMap(subSection => subSection.getBlocks());

        let chunkTasks = DetailContentSpider.chunkTask(allTasks, 5);

        for (let i = 0; i < chunkTasks.length; i++) {
            let subTasks = chunkTasks[i].map(x => this.populateBlockContent(x));
            await Promise.all(subTasks);
        }

        return this.structure;
    }


    private async populateBlockContent(block: CourseBlock): Promise<void> {
        let browser = await this.holder.getBrowser();

        let page = await openPage(browser, block.getLink(), true);

        let extractors = [
            this.extractRegularVideo(page),
            this.extractYoutube(page),
            this.extractScreenShot(page),
            this.extractNotes(page)
        ].map(it => this.extractBox(it, block));

        await Promise.all(extractors).then(ret => {
            if (block.getContents().length === 0) {
                console.log(`name: ${block.getName()}, link: ${block.getLink()} parse failed`)
            } else {
                let contentTypes = block.getContents().map(it => it.constructor.name);
                console.log(`name: ${block.getName()}, link: ${block.getLink()}, content: [${contentTypes}]`)
            }
        }).finally(() => page.close());
    }

    private extractBox(r: Promise<BlockContent>, block: CourseBlock): Promise<BlockContent | void> {
        return r.catch(x => {
            // do nothing
        }).then(x => {
            if (x instanceof BlockContent) {
                block.addContent(x)
            }
        })
    }

    private async extractRegularVideo(page: Page): Promise<VideoBlock> {
        const selector = ".wrapper-download-video a";
        await page.waitForSelector(selector, {timeout: 5000});
        const video = await page.$eval(selector, el => (el as HTMLBaseElement).href);
        const srt = await page.$eval(".list-download-transcripts a", el => (el as HTMLBaseElement).href);

        return new VideoBlock(video, srt);
    }

    private async extractYoutube(page: Page): Promise<YoutubeBlock> {
        const selector = ".video-player iframe";
        await page.waitForSelector(selector, {timeout: 5000});
        const video = await page.$eval(selector, el => (el as HTMLIFrameElement).src);

        return new YoutubeBlock(video);
    }

    private async extractScreenShot(page: Page): Promise<BinaryPNGBlock> {
        const selector = ".vert-mod .xblock-student_view-html";

        let handle = await page.waitForSelector(selector, {timeout: 8000});

        let notesSelector = `${selector} .edx-notes-wrapper-content`;

        let length = await page.$eval(notesSelector, el => (<HTMLElement>el).innerText.trim().length);

        if (length <= 21) {
            throw new Error("Too small, guess is slides")
        }

        let buffer = await handle.screenshot({type: "png", encoding: "binary"});

        return new BinaryPNGBlock(buffer);

    }

    private async extractNotes(page: Page): Promise<NotesBlock> {
        const selector = ".vert-mod .xblock-student_view-html";

        let notesSelector = `${selector} .edx-notes-wrapper-content p a`;
        await page.waitForSelector(notesSelector, {timeout: 4000});

        let notes = await page.$$eval(notesSelector, els => els.map(el => {
            let linkEl = el as HTMLLinkElement;
            return {
                name: linkEl.innerText.trim(),
                link: linkEl.href
            }
        }));

        if (notes === null || notes.length === 0) {
            throw new Error("Just return")
        }

        let notesMap = new Map<string, string>();
        notes.forEach(r => notesMap.set(r.name, r.link));

        return new NotesBlock(notesMap);
    }

    private static chunkTask(tasks: Array<CourseBlock>, bunchSize: number) {
        let taskLength = tasks.length;
        let ret = [];

        for (let index = 0; index < taskLength; index += bunchSize) {
            let part = tasks.slice(index, index + bunchSize);
            ret.push(part);
        }

        return ret;
    }
}
