interface Section {
    name: string,
    subSections: Array<SubSection>
}

interface SubSection {
    name: string,
    blocks: Array<Block>
}

interface Block {
    name: string,
    link: string
}
