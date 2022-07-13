# Koa Body Parser
A class for creating Koa middlewares that parse certain types of request bodies.

This is built on top of [formidable](https://www.npmjs.com/package/formidable) V3.

## Installation
Install the package with NPM:

```
npm install @donutteam/koa-body-parser
```

## Usage
To use this class, simply instantiate an instance and add it to your Koa stack:

```js
import Koa from "koa";

import { BodyParserMiddleware } from "@donutteam/koa-body-parser";

const app = new Koa();

const bodyParserMiddleware = new BodyParserMiddleware();

// Be sure to add the execute function on the instance
// and NOT the instance itself
app.use(bodyParserMiddleware.execute);
```

This will add a `parsedBody` object to `context` that will contain 4 fields:

- `fields`: An object containing a key for every field in the request and the **first** value with that name.
- `fieldArrays`: An object containing a key for every field in the request and **an array** of all values with that name.
- `files`: An object containing a key for every file in the request and the **first** value with that name.
- `fileArrays`: An object containing a key for every file in the request and **an array** of all values with that name.

This middleware supports parsing these types of incoming request bodies:

- `application/x-www-form-urlencoded`
- `multipart/form-data`
- `application/json`

**All other types will throw an error.**

## License
[MIT](https://github.com/donutteam/koa-body-parser/blob/main/LICENSE.md)