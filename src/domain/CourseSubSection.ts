import {CourseBlock} from "./CourseBlock";

export class CourseSubSection {
    private readonly blocks: Array<CourseBlock> = [];

    constructor(private readonly name: string) {}

    public addBlock(section: CourseBlock): CourseSubSection {
        this.blocks.push(section);
        return this;
    }

    public getName(): string {
        return this.name;
    }


    public getBlocks(): Array<CourseBlock> {
        return this.blocks;
    }

    static buildFromJSON(subSection: SubSection) {
        let courseSubSection = new CourseSubSection(subSection.name);
        subSection.blocks.forEach(block => courseSubSection.addBlock(new CourseBlock(block.name, block.link)));
        return courseSubSection;
    }
}
