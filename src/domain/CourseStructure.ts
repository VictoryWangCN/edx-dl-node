import {CourseSection} from "./CourseSection";

export class CourseStructure {
    private readonly sections: Array<CourseSection> = [];

    constructor(private readonly name: string) {}

    public addSection(section: CourseSection): CourseStructure {
        this.sections.push(section);
        return this;
    }

    public addSections(sections: Array<CourseSection>): CourseStructure {
        this.sections.push(...sections);
        return this;
    }

    public getName(): string {
        return this.name;
    }


    public getSections(): Array<CourseSection> {
        return this.sections;
    }
}
