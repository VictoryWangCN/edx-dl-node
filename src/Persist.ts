import * as fs from "fs";

import {CourseStructure} from "./domain/CourseStructure";
import {EdxHolder} from "./EdxHolder";
import {BinaryPNGBlock, BlockContent, NotesBlock, VideoBlock, YoutubeBlock} from "./domain/BlockContent";
import {CourseSubSection} from "./domain/CourseSubSection";
import {CourseSection} from "./domain/CourseSection";
import {Aria2Box} from "./Aria2Box";
import filenamify = require("filenamify");

export class Persist {
    constructor(private readonly structure: CourseStructure,
                private readonly folder: string,
                private readonly holder: EdxHolder) {
    }

    public persist() {
        let courseName = this.structure.getName();
        let courseFolder = `${this.folder}/${filenamify(courseName)}`;

        console.log(`Start persist course: ${courseName}`);

        Persist.createFolderIfNotExist(courseFolder);

        this.persistSection(courseFolder);

    }


    private persistSection(courseFolder: string) {
        let sections = this.structure.getSections();

        for (let sectionIdx = 0; sectionIdx < sections.length; sectionIdx++) {
            let section = sections[sectionIdx];

            let sectionName = section.getName();
            let sectionFolder = `${courseFolder}/${sectionIdx}.${filenamify(sectionName)}`;

            console.log(`\tStart persist section: ${sectionName}`);

            Persist.createFolderIfNotExist(sectionFolder);

            Persist.persistSubSection(section, sectionFolder);
        }
    }

    private static persistSubSection(section: CourseSection, sectionFolder: string) {
        let subSections = section.getSubSections();

        for (let subIdx = 0; subIdx < subSections.length; subIdx++) {
            let subSection = subSections[subIdx];

            let subSectionName = subSection.getName();
            let subSectionFolder = `${sectionFolder}/${subIdx}.${filenamify(subSectionName)}`;

            console.log(`\t\tStart persist subSection: ${subSectionName}`);

            Persist.createFolderIfNotExist(subSectionFolder);

            Persist.persistBlock(subSection, subSectionFolder);
        }
    }

    private static persistBlock(subSection: CourseSubSection, subSectionFolder: string) {
        let blocks = subSection.getBlocks();

        for (let blockIdx = 0; blockIdx < blocks.length; blockIdx++) {
            let block = blocks[blockIdx];

            let blockName = block.getName();
            let blockFolder = `${subSectionFolder}/${blockIdx}.${filenamify(blockName)}`;

            console.log(`\t\t\tStart persist block: ${blockName}`);

            Persist.createFolderIfNotExist(blockFolder);

            let contents = block.getContents();

            for (let contentIdx = 0; contentIdx < contents.length; contentIdx++) {
                let content = contents[contentIdx];
                Persist.persistContent(content, blockFolder, contentIdx)
            }
        }
    }

    private static persistContent(content: BlockContent, blockFolder: string, idx: number) {
        switch (content.type) {
            case VideoBlock.TYPE: {
                Aria2Box.addTask((<VideoBlock>content).video, blockFolder);
                Aria2Box.addTask((<VideoBlock>content).srt, blockFolder);
                console.log("\t\t\t\t" + (<VideoBlock>content).video);
                console.log("\t\t\t\t" + (<VideoBlock>content).srt);
                return;
            }
            case YoutubeBlock.TYPE: {
                fs.writeFileSync(`${blockFolder}/youtube_${idx}.txt`, (<YoutubeBlock>content).video);
                console.log("\t\t\t\t" + (<YoutubeBlock>content).video);
                return;
            }
            case BinaryPNGBlock.TYPE: {
                fs.writeFileSync(`${blockFolder}/${idx}.png`, (<BinaryPNGBlock>content).buffer);
                return;
            }
            case NotesBlock.TYPE: {
                (<NotesBlock>content).notes.forEach((k ,v) => {
                    let noteFolder = `${blockFolder}/${filenamify(v)}`;
                    Persist.createFolderIfNotExist(noteFolder);

                    fs.writeFileSync(`${noteFolder}/target.txt`, k);
                    Aria2Box.addTask(v, noteFolder);
                });
                return;
            }
            default: {
                console.log(`Unknown block content: ${content.constructor.name}`)
            }
        }
    }

    private static createFolderIfNotExist(folder: string) {
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, {recursive: true});
        }
    }
}
