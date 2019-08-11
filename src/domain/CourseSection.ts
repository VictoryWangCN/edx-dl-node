import {CourseSubSection} from "./CourseSubSection";

export class CourseSection {
    private readonly subSections: Array<CourseSubSection> = [];

    constructor(private readonly name: string) {}

    public addSubSection(section: CourseSubSection): CourseSection {
        this.subSections.push(section);
        return this;
    }

    public getName(): string {
        return this.name;
    }


    public getSubSections(): Array<CourseSubSection> {
        return this.subSections;
    }

    static buildFromJSON(section: Section): CourseSection {
        let courseSection = new CourseSection(section.name);
        section.subSections.forEach(subSection => courseSection.addSubSection(CourseSubSection.buildFromJSON(subSection)));
        return courseSection;
    }
}
