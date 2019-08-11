import {CourseSection} from "./CourseSection";

export class CourseStructure {
    private readonly sections: Array<CourseSection> = [];

    constructor(private readonly name: string) {}

    static buildFromJSON(name: string, sections: Array<Section>): CourseStructure {
        // WTF reduce && generic in class level ........
        let structure = new CourseStructure(name);
        sections.forEach(section => structure.addSection(CourseSection.buildFromJSON(section)));
        return structure;
    }

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
