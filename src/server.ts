interface ICache {
    useCache: boolean;

    [propName: string]: any;
}

const cache: ICache = {useCache: true};
