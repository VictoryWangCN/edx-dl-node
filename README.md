# edx-dl
Node Version

1. download video, slides and code examples
2. youtube path
3. screen shot for html body
4. resources in html body

## Usage

```
npm install 

```

then

``` 
(async () => {
    let holder = new EdxHolder("##username##", "##pwd##");
    let courseStructure = await new CourseSpider(holder, 
        "https://courses.edx.org/courses/##course##/course/").extractStructure();
    let structure = await new DetailContentSpider(courseStructure, holder).populateDetail();

    new Persist(structure, "#store_path#", holder).persist();
    
})();
```

## config

|config|path|default|
|---|---|---|
|Max tab for parse | [link](https://github.com/VictoryWangCN/edx-dl/blob/master/src/DetailContentSpider.ts#L18) | 5 |
|Proxy | [link](https://github.com/VictoryWangCN/edx-dl/blob/master/src/EdxHolder.ts#L8) | http://localhost:8087 |
|Aria2 | [link](https://github.com/VictoryWangCN/edx-dl/blob/master/src/Aria2Box.ts) | - |
