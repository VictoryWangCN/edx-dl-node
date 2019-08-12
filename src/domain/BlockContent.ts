abstract class BlockContent {
    protected constructor(readonly type: string) {}
}

class VideoBlock extends BlockContent {
    static TYPE: string = "VIDEO";

    constructor(readonly video: string, readonly srt: string) {
        super(VideoBlock.TYPE);
    }
}

class YoutubeBlock extends BlockContent {
    static TYPE: string = "YOUTUBE";

    constructor(readonly video: string) {
        super(YoutubeBlock.TYPE);
    }
}

class BinaryPNGBlock extends BlockContent {
    static TYPE: string = "BINARY_PNG";

    constructor(readonly buffer: Buffer) {
        super(BinaryPNGBlock.TYPE)
    }

}

class NotesBlock extends BlockContent {
    static TYPE: string = "NOTES";

    constructor(readonly notes: Map<string, string>) {
        super(NotesBlock.TYPE)
    }
}

export {
    BlockContent,
    BinaryPNGBlock,
    NotesBlock,
    VideoBlock,
    YoutubeBlock
}
