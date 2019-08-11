import {BlockContent} from "./BlockContent";

export class CourseBlock {
    private readonly contents: Array<BlockContent> = [];

    constructor(private readonly name: string, private readonly link: string) {}

    public getName(): string {
        return this.name;
    }

    public getLink(): string {
        return this.link;
    }

    public getContents(): Array<BlockContent> {
        return this.contents;
    }

    public addContent(blockContent: BlockContent) {
        this.contents.push(blockContent);
    }
}
