const Aria2 = require("aria2");

export class Aria2Box {

    private static INSTANCE = new Aria2({
        host: 'localhost',
        port: 6800,
        secure: false,
        secret: '',
        path: '/jsonrpc'
    });

    public static addTask(url: string, folder: string) {
        Aria2Box.INSTANCE.call("addUri", [url], {
            "dir": folder,
            "all-proxy": "http://127.0.0.1:8087",

        }).catch((e: Error) => {
            console.log(`Download ${url} to folder: ${folder} failed, message: ${e.message}`)
        })
    }
}

