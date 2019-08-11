export class CourseBlock {
    protected constructor(private readonly name: string, private readonly link: string) {}

    public getName(): string {
        return this.name;
    }

    public getLink(): string {
        return this.link;
    }
}
