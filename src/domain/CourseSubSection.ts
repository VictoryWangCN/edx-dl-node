import {CourseBlock} from "./CourseBlock";

export class CourseSubSection {
    private readonly blocks: Array<CourseBlock> = [];

    constructor(private readonly name: string) {}

    public addBlocks(section: CourseBlock): CourseSubSection {
        this.blocks.push(section);
        return this;
    }

    public getName(): string {
        return this.name;
    }


    public getBlocks(): Array<CourseBlock> {
        return this.blocks;
    }
}
